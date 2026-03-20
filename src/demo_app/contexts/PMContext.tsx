import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "../hooks/useAuth";
import { toDate } from "date-fns";
import { toast } from "react-toastify";
import { getPercentComplete, getTaskProgress } from "../utility/analyticsCalculations";
import { maxDate, minDate } from "../utility/dateCalculations";
import { BudgetChartColours, IssueStatusColours, TaskStatusByDatesColours, TaskStatusColours, TaskPriorityColours } from "../constants";
import type { ProjectType, Task } from "../pages/ProjectManager/AnalyticsDashboard.types";
import type { PMContextType, ProjectStatusType, OrganizationType } from "../types/PMContextType";
import projectsData from "../mockData/projects.json";

const PMContext = createContext<PMContextType | null>(null);

// Chart cache TTL (5 minutes)
const CHART_CACHE_TTL = 5 * 60 * 1000;

export function PMProvider({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  const [organizationList, setOrganizationList] = useState<OrganizationType[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null);
  const [projectList, setProjectList] = useState<ProjectType[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>();
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [projectTasks, setProjectTasks] = useState<{ [key: string]: any[] }>({});
  const [issueData, setIssueData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusByStartDate, setStatusByStartDate] = useState<any[]>([]);
  const [taskStatusOverview, setTaskStatusOverview] = useState<any[]>([]);
  const [statusByEndDate, setStatusByEndDate] = useState<any[]>([]);
  const [taskPriorityOverview, setTaskPriorityOverview] = useState<any[]>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [overallProjectStatus, setOverallProjectStatus] = useState<any>(null);
  const [taskDetailRefreshKey, setTaskDetailRefreshKey] = useState<number>(0);

  // Chart data item type for caching
  type ChartDataItem = { id: string; value: number; color: string };

  // Cache for chart data - keyed by "projectId-milestoneId-teamId"
  const chartCacheRef = useRef<Map<string, {
    taskStatusOverview: ChartDataItem[];
    statusByStartDate: ChartDataItem[];
    statusByEndDate: ChartDataItem[];
    taskPriorityOverview: ChartDataItem[];
    timestamp: number;
  }>>(new Map());

  const { socket, connected } = useSocket();
  const { user } = useAuth();

  const fetchedProjectsRef = useRef(false);
  const fetchedOrganizationsRef = useRef(false);
  const selectedProjectIdRef = useRef<string | null>(null);

  const getTaskCandidates = useCallback(() => {
    let tasks: any[] = [];
    if (selectedProject?.id === "all") {
      tasks = Object.values(projectTasks).flat();
    } else {
      tasks = projectTasks[selectedProject?.id] ?? [];
    }

    if (selectedMilestone && selectedMilestone !== "all") {
      let milestoneTaskIds: string[] = [];
      if (selectedProject.id === "all") {
        for (const p of projectList) {
          const m = p.milestones.find((mm: any) => mm.id === selectedMilestone);
          if (m) {
            milestoneTaskIds = milestoneTaskIds.concat(m.tasks.map((t: any) => t.id));
            break;
          }
        }
      } else {
        const milestone = selectedProject?.milestones?.find((m: any) => m.id === selectedMilestone);
        if (milestone) {
          milestoneTaskIds = milestone.tasks.map((t: any) => t.id);
        }
      }
      if (milestoneTaskIds.length > 0) {
        tasks = tasks.filter((task: any) => milestoneTaskIds.includes(task.id));
      } else {
        tasks = [];
      }
    }

    if (selectedTeam && selectedTeam !== "all") {
      tasks = tasks.filter((task: any) => task.teamId === selectedTeam);
    }

    return tasks;
  }, [selectedProject, selectedMilestone, selectedTeam, projectTasks, projectList]);

  const getFilteredTasks = useCallback(() => {
    let tasks = getTaskCandidates();

    if (selectedTask) {
      tasks = tasks.filter((task: any) => task.id === selectedTask);
    }

    return tasks;
  }, [getTaskCandidates, selectedTask]);

  useEffect(() => {
    selectedProjectIdRef.current = selectedProject?.id ?? null;
  }, [selectedProject]);

  const computeProjectStatus = useCallback((tasks: Task[]): ProjectStatusType => {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return {
        initialPercentComplete: 0,
        averageInitialCompletion: 0,
        actualPercentComplete: 0,
        averageActualCompletion: 0,
        isEmpty: true,
      };
    }

    let totalInitialFraction = 0;
    let totalActualFraction = 0;

    for (const task of tasks) {
      const { actualFraction, initialFraction } = getPercentComplete(task);

      totalInitialFraction += initialFraction;
      totalActualFraction += actualFraction;
    }

    const averageInitialFraction = totalInitialFraction / tasks.length;
    const initialPercentComplete = averageInitialFraction * 100;

    const averageActualFraction = totalActualFraction / tasks.length;
    const actualPercentComplete = averageActualFraction * 100;

    return {
      initialPercentComplete,
      averageInitialCompletion: initialPercentComplete,
      actualPercentComplete,
      averageActualCompletion: actualPercentComplete,
      isEmpty: false,
    };
  }, []);

  // Helper to generate cache key
  const getCacheKey = (
    projectId: string | null,
    milestoneId: string | null,
    teamId: string | null
  ): string => `${projectId || 'null'}-${milestoneId || 'null'}-${teamId || 'null'}`;

  // Compute chart data from local projectTasks state (no API call needed)
  const fetchTaskDetailsForCharts = useCallback(async (
    projectId: string | null,
    milestoneId: string | null,
    teamId: string | null,
    forceRefresh: boolean = false
  ) => {
    if (!projectId) {
      setTaskStatusOverview([]);
      setStatusByStartDate([]);
      setStatusByEndDate([]);
      setTaskPriorityOverview([]);
      return;
    }

    const cacheKey = getCacheKey(projectId, milestoneId, teamId);
    const cachedData = chartCacheRef.current.get(cacheKey);
    const now = Date.now();

    // Use cached data if valid (not expired and not forcing refresh)
    if (!forceRefresh && cachedData && (now - cachedData.timestamp) < CHART_CACHE_TTL) {
      setTaskStatusOverview(cachedData.taskStatusOverview);
      setStatusByStartDate(cachedData.statusByStartDate);
      setStatusByEndDate(cachedData.statusByEndDate);
      setTaskPriorityOverview(cachedData.taskPriorityOverview || []);
      return;
    }

    setChartLoading(true);

    try {
      // Get task list from local projectTasks state
      let taskList: any[] = [];
      if (projectId === "all") {
        taskList = Object.values(projectTasks).flat();
      } else {
        taskList = projectTasks[projectId] ?? [];
      }

      // Apply milestone filter
      if (milestoneId && milestoneId !== "all") {
        taskList = taskList.filter((t: any) => t.milestoneId === milestoneId);
      }

      // Apply team filter
      if (teamId && teamId !== "all") {
        taskList = taskList.filter((t: any) => t.teamId === teamId || t.teamResponsibleId === teamId);
      }

      // Compute chart data from backend's pre-computed fields
      const statusCounts = {
        NotStarted: 0,
        InProgress: 0,
        MarkedComplete: 0,
        TaskComplete: 0,
        TaskRejected: 0,
      };
      taskList.forEach((t: any) => {
        if (t.taskStatus in statusCounts) {
          statusCounts[t.taskStatus as keyof typeof statusCounts]++;
        }
      });

      const taskData = [
        { id: "Finished", value: statusCounts.TaskComplete, color: TaskStatusColours["Finished"] },
        { id: "Pending", value: statusCounts.MarkedComplete, color: "#66bb6a" },
        { id: "Started", value: statusCounts.InProgress, color: TaskStatusColours["Started"] },
        { id: "Not Started", value: statusCounts.NotStarted, color: TaskStatusColours["Not Started"] },
        { id: "Rejected", value: statusCounts.TaskRejected, color: "#e07a62" },
      ].filter((d) => d.value > 0);

      const startCounts = { Delayed: 0, "On Time": 0, Early: 0 };
      taskList.forEach((t: any) => {
        if (t.taskStartStatus === -1) startCounts.Delayed++;
        else if (t.taskStartStatus === 0) startCounts["On Time"]++;
        else if (t.taskStartStatus === 1) startCounts.Early++;
      });

      const startStatusData = [
        { id: "Delayed", value: startCounts.Delayed, color: TaskStatusByDatesColours["Delayed"] },
        { id: "On Time", value: startCounts["On Time"], color: TaskStatusByDatesColours["On Time"] },
        { id: "Early", value: startCounts.Early, color: TaskStatusByDatesColours["Early"] },
      ].filter((d) => d.value > 0);

      const endCounts = { Delayed: 0, "On Time": 0, Early: 0 };
      taskList.forEach((t: any) => {
        if (t.taskEndStatus === -1) endCounts.Delayed++;
        else if (t.taskEndStatus === 0) endCounts["On Time"]++;
        else if (t.taskEndStatus === 1) endCounts.Early++;
      });

      const endStatusData = [
        { id: "Delayed", value: endCounts.Delayed, color: TaskStatusByDatesColours["Delayed"] },
        { id: "On Time", value: endCounts["On Time"], color: TaskStatusByDatesColours["On Time"] },
        { id: "Early", value: endCounts.Early, color: TaskStatusByDatesColours["Early"] },
      ].filter((d) => d.value > 0);

      // Compute priority counts from the task list
      const priorityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
      taskList.forEach((t: any) => {
        if (t.priority === "Critical") priorityCounts.Critical++;
        else if (t.priority === "High") priorityCounts.High++;
        else if (t.priority === "Medium") priorityCounts.Medium++;
        else if (t.priority === "Low") priorityCounts.Low++;
      });

      const priorityData = [
        { id: "Critical", value: priorityCounts.Critical, color: TaskPriorityColours["Critical"] },
        { id: "High", value: priorityCounts.High, color: TaskPriorityColours["High"] },
        { id: "Medium", value: priorityCounts.Medium, color: TaskPriorityColours["Medium"] },
        { id: "Low", value: priorityCounts.Low, color: TaskPriorityColours["Low"] },
      ].filter((d) => d.value > 0);

      // Store in cache
      chartCacheRef.current.set(cacheKey, {
        taskStatusOverview: taskData,
        statusByStartDate: startStatusData,
        statusByEndDate: endStatusData,
        taskPriorityOverview: priorityData,
        timestamp: now,
      });

      setTaskStatusOverview(taskData);
      setStatusByStartDate(startStatusData);
      setStatusByEndDate(endStatusData);
      setTaskPriorityOverview(priorityData);
    } catch (err: any) {
      console.error("Error computing chart data:", err);
    } finally {
      setChartLoading(false);
    }
  }, [projectTasks]);

  // const getAllTasks = useCallback(() => {
  //   if (selectedProject?.id === "all") {
  //     return Object.values(projectTasks).flat();
  //   } else {
  //     return projectTasks[selectedProject?.id] ?? [];
  //   }
  // }, [selectedProject, projectTasks]);

  // Update overallProjectStatus when projectTasks changes
  useEffect(() => {
    if (!selectedProject) {
      setOverallProjectStatus(null);
      return;
    }

    // For "All Projects", calculate average of each project's percentage / # of projects
    if (selectedProject.id === "all") {
      const projectIds = Object.keys(projectTasks);
      if (projectIds.length === 0) {
        setOverallProjectStatus({
          initialPercentComplete: 0,
          averageInitialCompletion: 0,
          actualPercentComplete: 0,
          averageActualCompletion: 0,
          isEmpty: true,
        });
        return;
      }

      let totalInitialPercent = 0;
      let totalActualPercent = 0;

      for (const projectId of projectIds) {
        const projectStatus = computeProjectStatus(projectTasks[projectId] || []);
        totalInitialPercent += projectStatus.initialPercentComplete;
        totalActualPercent += projectStatus.actualPercentComplete;
      }

      const avgInitialPercent = totalInitialPercent / projectIds.length;
      const avgActualPercent = totalActualPercent / projectIds.length;

      setOverallProjectStatus({
        initialPercentComplete: avgInitialPercent,
        averageInitialCompletion: avgInitialPercent,
        actualPercentComplete: avgActualPercent,
        averageActualCompletion: avgActualPercent,
        isEmpty: false,
      });
      return;
    }

    // For single project, compute tasks directly from projectTasks to avoid stale closures
    const tasks = projectTasks[selectedProject.id] ?? [];
    setOverallProjectStatus(computeProjectStatus(tasks));
  }, [selectedProject, computeProjectStatus, projectTasks]);

  const updateStats = useCallback(() => {
    // Chart data is now fetched from /task/project-details API via fetchTaskDetailsForCharts
    // Only compute issue data here since it's not provided by that API
    const filteredTasks = getFilteredTasks();
    const allIssues = filteredTasks.flatMap((task) => task.issues || []).filter(Boolean);
    const issueData = [
      {
        id: "Resolved",
        value: allIssues.filter((i) => i?.status === "Resolved").length,
        color: IssueStatusColours["Resolved"],
      },
      {
        id: "Not Resolved",
        value: allIssues.filter((i) => i?.status === "NotResolved").length,
        color: IssueStatusColours["Not Resolved"],
      },
    ];
    setIssueData(issueData);
  }, [getFilteredTasks]);

  const taskCandidates = useMemo(() => getTaskCandidates(), [getTaskCandidates]);

  const fetchOrganizations = useCallback(async () => {
    try {
      const orgs: OrganizationType[] = [{ id: "org1", name: "Demo Org" }];
      setOrganizationList(orgs);
    } catch (err) {
      console.error("Error fetching organizations:", err);
    }
  }, [token]);

  const selectOrganization = useCallback(
    (organizationId: string | null) => {
      setSelectedOrganization(organizationId);
      // Reset project selection when organization changes
      setSelectedProject(null);
      setSelectedMilestone(null);
      setSelectedTeam(null);
      setSelectedTask(null);
      // Clear chart cache when organization changes to avoid stale data
      chartCacheRef.current.clear();
      // Re-fetch projects with the new organization filter
      fetchedProjectsRef.current = false;
    },
    []
  );

  const filteredTasks = useMemo(() => {
    let tasks = taskCandidates;

    if (selectedProject && selectedProject.id !== "all") {
      tasks = tasks.filter((t) =>
        selectedProject.milestones.some((m: any) => m.tasks.some((mt: any) => mt.id === t.id))
      );
    }

    if (selectedMilestone && selectedMilestone !== "all") {
      tasks = tasks.filter((t) => t.milestoneId === selectedMilestone);
    }

    if (selectedTeam && selectedTeam !== "all") {
      tasks = tasks.filter((t) => t.teamResponsibleId === selectedTeam);
    }

    return tasks;
  }, [selectedProject, selectedMilestone, selectedTeam, taskCandidates]);

  const budgetData1 = useMemo(() => {
    const tasks = filteredTasks;

    const changeOrderSum = tasks.reduce((sum, t) => sum + (t.changeOrder || 0), 0);
    const actualBudgetSum = tasks.reduce((sum, t) => sum + (t.taskBudget || 0), 0);
    const totalBudget = changeOrderSum + actualBudgetSum;

    // Calculate budget utilized based on task progress (same formula as ProjectTaskDetails)
    const budgetUtilized = tasks.reduce((sum, t) => {
      const progress = getTaskProgress(t); // returns 0-1 fraction
      const newBudget = (t.taskBudget || 0) + (t.changeOrder || 0);
      const rawValue = progress * newBudget;
      return sum + Math.round((rawValue + Number.EPSILON) * 100) / 100;
    }, 0);

    return [
      { category: "Initial Budget", value: actualBudgetSum, color: BudgetChartColours["Initial Budget"] },
      { category: "Change Order", value: changeOrderSum, color: BudgetChartColours["Change Order"] },
      { category: "Total Budget", value: totalBudget, color: BudgetChartColours["Total Budget"] },
      { category: "Budget Utilized", value: budgetUtilized, color: BudgetChartColours["Budget Utilized"] },
      { category: "Remaining Budget", value: totalBudget - budgetUtilized, color: BudgetChartColours["Remaining Budget"] },
    ];
  }, [filteredTasks]);

  const selectProject = useCallback(
    (projectId: string) => {
      const allStartDates = projectList.map((p) => toDate(p.startDate));
      const allEndDates = projectList.map((p) => toDate(p.endDate));
      const aggregateStart = minDate(allStartDates);
      const aggregateEnd = maxDate(allEndDates);
      setSelectedProject(
        projectId === "all"
          ? {
            id: "all",
            name: "All Projects",
            startDate: aggregateStart,
            endDate: aggregateEnd,
            milestones: projectList.flatMap((p) => p.milestones),
            teams: projectList.flatMap((p) => p.teams),
          }
          : projectList.find((p) => p.id === projectId) || null
      );

      setSelectedMilestone(null);
      setSelectedTeam(null);
      setSelectedTask(null);

      updateStats();
    },
    [projectList, updateStats]
  );

  const availableMilestones = useMemo(() => {
    if (!selectedProject) return [];

    if (selectedProject.id === "all") {
      return projectList.flatMap((p) =>
        p.milestones.map((m) => ({
          ...m,
          displayName: `${p.name} - ${m.name}`,
        }))
      );
    }
    return selectedProject.milestones || [];
  }, [selectedProject, projectList]);

  const availableTeams = useMemo(() => {
    if (!selectedProject) return [];

    // Get unique divisions from tasks (teamResponsible)
    const divisionMap = new Map<string, { id: string; name: string }>();

    let tasksToProcess = taskCandidates;
    if (selectedMilestone && selectedMilestone !== "all") {
      tasksToProcess = taskCandidates.filter((t) => t.milestoneId === selectedMilestone);
    }

    tasksToProcess.forEach((task: any) => {
      if (task.teamResponsible && task.teamResponsible.id) {
        divisionMap.set(task.teamResponsible.id, {
          id: task.teamResponsible.id,
          name: task.teamResponsible.name,
        });
      }
    });

    return Array.from(divisionMap.values());
  }, [selectedProject, selectedMilestone, taskCandidates]);

  const selectMilestone = useCallback(
    (milestoneId: string | null) => {
      setSelectedMilestone(milestoneId);
      if (milestoneId && milestoneId !== "all") {
        const milestone = availableMilestones.find((m: any) => m.id === milestoneId);
        if (milestone) {
          const project = projectList.find((p) => p.id === milestone.projectId);
          if (project) {
            setSelectedProject(project);
          }
        }
      }
      setSelectedTask(null);
      updateStats();
    },
    [availableMilestones, projectList, updateStats]
  );

  const selectTeam = useCallback(
    (teamId: string | null) => {
      setSelectedTeam(teamId);
      setSelectedTask(null);
      updateStats();
    },
    [updateStats]
  );

  const selectTask = useCallback(
    (taskId: string | null) => {
      setSelectedTask(taskId);

      if (taskId && taskId !== "all") {
        const task = taskCandidates.find((t) => t.id === taskId);
        if (task) {
          const taskProject = projectList.find((p) => p.milestones.some((m) => m.tasks.some((t) => t.id === taskId)));

          if (taskProject && (!selectedProject || selectedProject.id !== taskProject.id)) {
            setSelectedProject(taskProject);
          }

          if (task.milestoneId) {
            setSelectedMilestone(task.milestoneId);
          }
          if (task.teamResponsibleId) {
            setSelectedTeam(task.teamResponsibleId);
          }
        }
      }
      updateStats();
    },
    [taskCandidates, projectList, selectedProject, updateStats]
  );

  const fetchProjects = useCallback(
    async (preserveSelection = false, showLoading = true, selectProjectId?: string) => {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      try {
        const data: any = projectsData;

        const fromData = Array.isArray(data?.data) ? data.data : null;
        const fromItems = Array.isArray(data?.items) ? data.items : null;
        const fromArray = Array.isArray(data) ? data : null;
        let projects: any[] = fromData ?? fromItems ?? fromArray ?? [];
        projects = projects.filter((p: any) => p && p.id);
        const enrichedProjectTasks: { [key: string]: any[] } = {};
        const enrichedProjects = projects.map((project: ProjectType) => {
          let allTasks: any[] = [];
          project.milestones?.forEach((milestone) => {
            milestone.tasks?.forEach((task: any) => {
              const teamId = task.teamResponsibleId;
              const teamResponsible = task.teamResponsible;
              // Extract assignee organization name from nested structure
              const assigneeOrganizationName = task.assigneeUser?.userOrganization?.organization?.name || '';
              allTasks.push({ ...task, teamId, teamResponsible, milestoneId: milestone.id, assigneeOrganizationName });
            });
          });

          const projectStatus = computeProjectStatus(allTasks);
          enrichedProjectTasks[project.id] = allTasks;

          return { ...project, projectStatus };
        });

        setProjectTasks(enrichedProjectTasks);
        setProjectList(enrichedProjects);

        if (enrichedProjects.length > 0) {
          let newSelected = null;

          // If a specific project ID was provided, select that project
          if (selectProjectId) {
            // console.log("fetchProjects: Looking for project with ID:", selectProjectId);
            // console.log("fetchProjects: Available project IDs:", enrichedProjects.map((p: any) => p.id));
            const targetProject = enrichedProjects.find((p: any) => p.id === selectProjectId);
            // console.log("fetchProjects: Found target project:", targetProject?.name || "NOT FOUND");
            if (targetProject) {
              newSelected = { ...targetProject };
              setSelectedMilestone(null);
              setSelectedTeam(null);
              setSelectedTask(null);
            }
          } else if (!selectedProject && !preserveSelection) {
            newSelected = { ...enrichedProjects[0] };
            setSelectedMilestone(null);
            setSelectedTeam(null);
            setSelectedTask(null);
          } else if (preserveSelection && selectedProject?.id !== "all") {
            const currentProject = enrichedProjects.find((p: any) => p.id === selectedProject.id);
            if (currentProject) {
              newSelected = { ...currentProject };
            }
          }

          if (newSelected) {
            setSelectedProject(newSelected);
          }
        }
      } catch (err: any) {
        // console.error("Failed to fetch projects:", err);
        setError(err.message ?? "An error occurred while fetching projects.");
      } finally {
        setLoading(false);
      }
    },
    [user.id, token, computeProjectStatus, selectedProject, selectedOrganization]
  );

  const createProject = useCallback(
    async (data: {
      name: string;
      description: string;
      managerId: string;
      startDate: string;
      endDate: string;
    }): Promise<{ success: boolean; message: string }> => {
      try {
        const createResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            managerId: data.managerId,
            startDate: data.startDate,
            endDate: data.endDate,
          }),
        });

        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          return { success: false, message: errorData.message || "Failed to create project" };
        }

        // Refresh projects list
        fetchedProjectsRef.current = false;
        await fetchProjects(false, false);

        return { success: true, message: "Project created successfully" };
      } catch (err: any) {
        // console.error("Failed to create project:", err);
        return { success: false, message: err.message || "An error occurred while creating the project" };
      }
    },
    [token, fetchProjects]
  );

  // Add task to project for instant UI updates (optimistic update)
  const addTaskToProject = useCallback((projectId: string, task: any) => {
    if (!projectId || projectId === "all") return;

    // Ensure task has required fields for progress calculation
    const normalizedTask = {
      ...task,
      status: task.status || "NotStarted",
      startDate: task.startDate || null,
      endDate: task.endDate || null,
      dateStarted: task.dateStarted || null,
      dateEnded: task.dateEnded || null,
      issues: task.issues || [],
    };

    // Add task to projectTasks state for immediate recalculation
    setProjectTasks((prev) => {
      const existingTasks = prev[projectId] || [];
      // Avoid duplicates
      if (existingTasks.some((t: any) => t.id === normalizedTask.id)) {
        return prev;
      }
      return {
        ...prev,
        [projectId]: [...existingTasks, normalizedTask],
      };
    });
  }, []);

  // Update task in project for instant UI updates (optimistic update)
  const updateTaskInProject = useCallback((projectId: string, taskId: string, updates: any) => {
    if (!projectId || projectId === "all" || !taskId) return;

    setProjectTasks((prev) => {
      const existingTasks = prev[projectId] || [];
      const taskIndex = existingTasks.findIndex((t: any) => t.id === taskId);

      if (taskIndex === -1) return prev;

      const updatedTasks = [...existingTasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        ...updates,
      };

      return {
        ...prev,
        [projectId]: updatedTasks,
      };
    });
  }, []);

  // Remove task from project for instant UI updates (optimistic update)
  const removeTaskFromProject = useCallback((projectId: string, taskId: string) => {
    if (!projectId || projectId === "all" || !taskId) return;

    setProjectTasks((prev) => {
      const existingTasks = prev[projectId] || [];
      const filteredTasks = existingTasks.filter((t: any) => t.id !== taskId);

      // Return new object reference to trigger React update
      return {
        ...prev,
        [projectId]: filteredTasks,
      };
    });
  }, []);

  // Fetch organizations on mount
  useEffect(() => {
    if (!user?.id || fetchedOrganizationsRef.current) return;
    fetchedOrganizationsRef.current = true;
    fetchOrganizations();
  }, [user?.id, fetchOrganizations]);

  // Fetch projects on mount or when organization changes
  useEffect(() => {
    if (!user?.id) return;
    if (!fetchedProjectsRef.current) {
      fetchedProjectsRef.current = true;
      fetchProjects(false, true);
    }
  }, [user?.id, fetchProjects]);

  // Refetch projects when organization selection changes
  useEffect(() => {
    if (!user?.id) return;
    // Only refetch if projects were previously fetched (not on initial mount)
    if (fetchedProjectsRef.current === false) {
      fetchedProjectsRef.current = true;
      fetchProjects(false, true);
    }
  }, [selectedOrganization, user?.id, fetchProjects]);

  // Update stats (issue data) when filters change or project changes
  // Clear issue data when project becomes null (e.g., organization change)
  useEffect(() => {
    if (selectedProject) {
      updateStats();
    } else {
      // Clear issue data when no project is selected
      setIssueData([]);
    }
  }, [selectedMilestone, selectedTeam, selectedTask, updateStats, selectedProject, projectTasks]);

  // Fetch chart data from /task/project-details API when project or filters change
  // Also clear chart data when project becomes null (e.g., organization change)
  useEffect(() => {
    fetchTaskDetailsForCharts(selectedProject?.id || null, selectedMilestone, selectedTeam);
  }, [selectedProject?.id, selectedMilestone, selectedTeam, fetchTaskDetailsForCharts]);

  useEffect(() => {
    if (selectedMilestone && selectedMilestone !== "all") {
      const isValid = availableMilestones.some((m: any) => m.id === selectedMilestone);
      if (!isValid) setSelectedMilestone(null);
    }
  }, [availableMilestones, selectedMilestone]);

  useEffect(() => {
    if (selectedTeam && selectedTeam !== "all") {
      const isValid = availableTeams.some((t: any) => t.id === selectedTeam);
      if (!isValid) setSelectedTeam(null);
    }
  }, [availableTeams, selectedTeam]);

  useEffect(() => {
    if (selectedTask) {
      const isValid = taskCandidates.some((t: any) => t.id === selectedTask);
      if (!isValid) setSelectedTask(null);
    }
  }, [taskCandidates, selectedTask]);

  useEffect(() => {
    if (!socket || !connected) return;

    // console.log("🔌 Socket connected:", connected, "Socket id:", socket?.id);

    const handleDashboardUpdated = (data: any) => {
      // console.log("Received dashboard_updated event:", data);
      if (data) {
        const { taskStatusOverview, statusByStartDate, statusByEndDate } = data;
        setTaskStatusOverview(taskStatusOverview || []);
        setStatusByStartDate(statusByStartDate || []);
        setStatusByEndDate(statusByEndDate || []);
      }
    };

    socket.on("dashboard_updated", handleDashboardUpdated);

    const handleTasksUpdated = async (data: any) => {
      // console.log("Received tasks_updated event:", data);
      // console.log("Current user.id:", user.id, "Event managerId:", data?.managerId);

      if (!data || data.managerId != user.id) {
        // console.log("❌ Skipping update - managerId mismatch or no data");
        return;
      }

      // Update task status in-place without full refresh
      if (data.tasks && Array.isArray(data.tasks)) {
        // console.log(" Updating tasks, received tasks:", data.tasks.map((t: any) => ({ id: t.id, taskStatus: t.taskStatus })));
        setProjectTasks((prev) => {
          // Create a completely new object to ensure React detects the change
          const updated: Record<string, any[]> = {};

          // Copy all existing projects with new array references
          for (const projectId in prev) {
            updated[projectId] = [...prev[projectId]];
          }

          // Process each incoming task
          // Get the project ID from the event data (data.id) as fallback
          const eventProjectId = data.id;

          // Collect all incoming task IDs for this project to detect deletions
          const incomingTaskIds = new Set(data.tasks.map((t: any) => t.id));

          for (const incomingTask of data.tasks) {
            const projectId = incomingTask.projectId || eventProjectId;
            if (!projectId) continue;

            // Initialize project array if it doesn't exist
            if (!updated[projectId]) {
              updated[projectId] = [];
            }

            const existingIndex = updated[projectId].findIndex((t: any) => t.id === incomingTask.id);

            if (existingIndex !== -1) {
              // Update existing task - preserve existing values if incoming data is undefined
              const existingTask = updated[projectId][existingIndex];
              updated[projectId] = [
                ...updated[projectId].slice(0, existingIndex),
                {
                  ...existingTask,
                  status: incomingTask.taskStatus || incomingTask.status || existingTask.status,
                  startDate: incomingTask.startDate ?? existingTask.startDate,
                  endDate: incomingTask.endDate ?? existingTask.endDate,
                  dateStarted: incomingTask.dateStarted ?? existingTask.dateStarted,
                  dateEnded: incomingTask.dateEnded ?? existingTask.dateEnded,
                  issues: incomingTask.issues ?? existingTask.issues,
                  taskStartStatus: incomingTask.taskStartStatus ?? existingTask.taskStartStatus,
                  taskEndStatus: incomingTask.taskEndStatus ?? existingTask.taskEndStatus,
                  daysAdjusted: incomingTask.daysAdjusted ?? existingTask.daysAdjusted,
                  progress: incomingTask.progress ?? existingTask.progress,
                },
                ...updated[projectId].slice(existingIndex + 1),
              ];
            } else {
              // Add new task
              updated[projectId] = [
                ...updated[projectId],
                {
                  id: incomingTask.id,
                  name: incomingTask.name || incomingTask.taskName,
                  status: incomingTask.taskStatus || incomingTask.status || "NotStarted",
                  startDate: incomingTask.startDate || null,
                  endDate: incomingTask.endDate || null,
                  dateStarted: incomingTask.dateStarted || null,
                  dateEnded: incomingTask.dateEnded || null,
                  issues: incomingTask.issues || [],
                  taskStartStatus: incomingTask.taskStartStatus ?? null,
                  taskEndStatus: incomingTask.taskEndStatus ?? null,
                  daysAdjusted: incomingTask.daysAdjusted ?? 0,
                  progress: incomingTask.progress ?? 0,
                },
              ];
            }
          }

          // Remove tasks that were deleted (exist locally but not in incoming data)
          // Only remove from the project that this event is for
          if (eventProjectId && updated[eventProjectId]) {
            updated[eventProjectId] = updated[eventProjectId].filter(
              (t: any) => incomingTaskIds.has(t.id)
            );
          }

          return updated;
        });

        // Refresh chart data for Core page (force refresh to bypass cache)
        const currentProjectId = selectedProjectIdRef.current;
        if (currentProjectId) {
          fetchTaskDetailsForCharts(currentProjectId, selectedMilestone, selectedTeam, true);
        }

        // Update issue stats immediately after task/issue updates
        updateStats();

        // Trigger Intel table refresh
        setTaskDetailRefreshKey(prev => prev + 1);

        // Note: We don't call fetchProjects here because we already updated tasks in-place above.
        // This prevents unnecessary full page refreshes in Field and Gantt pages.
      }
    };
    socket.on("tasks_updated", handleTasksUpdated);

    const handleTasksRescheduled = (data: any) => {
      if (!data || data.managerId !== user.id) {
        return;
      }

      const { tasks, count } = data;
      if (count === 1 && tasks?.[0]?.name) {
        toast.info(`Task "${tasks[0].name}" has been rescheduled`);
      } else if (count > 1) {
        const taskNames = tasks?.slice(0, 3).map((t: any) => t.name).join(", ");
        const moreText = count > 3 ? ` and ${count - 3} more` : "";
        toast.info(`${count} tasks rescheduled: ${taskNames}${moreText}`);
      }

      // Update task dates in-place without full refresh
      if (tasks && Array.isArray(tasks)) {
        setProjectTasks((prev) => {
          // Create a completely new object to ensure React detects the change
          const updated: Record<string, any[]> = {};
          for (const projectId in prev) {
            updated[projectId] = prev[projectId].map((task: any) => {
              const rescheduledTask = tasks.find((t: any) => t.id === task.id);
              if (rescheduledTask) {
                return {
                  ...task,
                  startDate: rescheduledTask.startDate ?? task.startDate,
                  endDate: rescheduledTask.endDate ?? task.endDate,
                  status: rescheduledTask.taskStatus ?? task.status,
                };
              }
              return task;
            });
          }
          return updated;
        });

        // Refresh chart data (force refresh to bypass cache)
        const currentProjectId = selectedProjectIdRef.current;
        if (currentProjectId) {
          fetchTaskDetailsForCharts(currentProjectId, selectedMilestone, selectedTeam, true);
        }

        // Update issue stats after rescheduled tasks
        updateStats();
      }
    };

    socket.on("tasks_rescheduled", handleTasksRescheduled);

    return () => {
      socket.off("tasks_updated", handleTasksUpdated);
      socket.off("dashboard_updated", handleDashboardUpdated);
      socket.off("tasks_rescheduled", handleTasksRescheduled);
    };
  }, [socket, connected, user.id, fetchTaskDetailsForCharts, selectedMilestone, selectedTeam, fetchProjects, updateStats]);

  const filteredMilestones = useMemo(() => {
    let mls = availableMilestones;
    if (selectedMilestone && selectedMilestone !== "all") {
      mls = mls.filter((m: any) => m.id === selectedMilestone);
    }
    return mls;
  }, [availableMilestones, selectedMilestone]);

  const milestoneData = useMemo(() => {
    return filteredMilestones.map((milestone: any) => {
      const milestoneTaskIds = milestone.tasks.map((t: any) => t.id);
      const tasksInMilestone = taskCandidates.filter((t: any) => milestoneTaskIds.includes(t.id));
      if (tasksInMilestone.length === 0) {
        return {
          milestone: milestone.displayName ?? milestone.name,
          progress: 0,
        };
      }
      const totalProgress = tasksInMilestone.reduce((sum, task) => sum + getTaskProgress(task), 0);
      const progress = Math.round((totalProgress / tasksInMilestone.length) * 100);
      return {
        milestone: milestone.displayName ?? milestone.name,
        progress,
      };
    });
  }, [filteredMilestones, taskCandidates]);

  //  Team Progress = (Sum of all task progress fractions / Number of tasks) × 100
  const teamData = useMemo(() => {
    const candidates = taskCandidates;

    if (selectedTeam && selectedTeam !== "all") {
      const team = availableTeams.find((t: any) => t.id === selectedTeam) ?? { name: "Unknown Team" };
      const tasksInTeam = candidates.filter((t: any) => t.teamResponsibleId === selectedTeam || t.teamResponsible?.id === selectedTeam);
      if (tasksInTeam.length === 0) {
        return [
          {
            team: (team as any).displayName ?? team.name,
            progress: 0,
          },
        ];
      }
      const totalProgress = tasksInTeam.reduce((sum, task) => sum + getTaskProgress(task), 0);
      const progress = Math.round((totalProgress / tasksInTeam.length) * 100);
      return [
        {
          team: (team as any).displayName ?? team.name,
          progress,
        },
      ];
    } else {
      return availableTeams.map((team: any) => {
        const tasksInTeam = candidates.filter((t: any) => t.teamResponsibleId === team.id || t.teamResponsible?.id === team.id);
        if (tasksInTeam.length === 0) {
          return {
            team: team.displayName ?? team.name,
            progress: 0,
          };
        }
        const totalProgress = tasksInTeam.reduce((sum, task) => sum + getTaskProgress(task), 0);
        const progress = Math.round((totalProgress / tasksInTeam.length) * 100);
        return {
          team: team.displayName ?? team.name,
          progress,
        };
      });
    }
  }, [availableTeams, taskCandidates, selectedTeam]);

  // Organization Progress = (Sum of all task progress fractions / Number of tasks) × 100
  // Groups tasks by assignee organization
  const organizationData = useMemo(() => {
    const candidates = taskCandidates;

    // Group tasks by assignee organization
    const orgMap = new Map<string, { name: string; tasks: any[] }>();

    candidates.forEach((task: any) => {
      const orgName = task.assigneeOrganizationName || task.assigneeUser?.userOrganization?.organization?.name;
      if (orgName) {
        if (!orgMap.has(orgName)) {
          orgMap.set(orgName, { name: orgName, tasks: [] });
        }
        orgMap.get(orgName)!.tasks.push(task);
      }
    });

    // Calculate progress for each organization
    return Array.from(orgMap.values()).map((org) => {
      if (org.tasks.length === 0) {
        return {
          organization: org.name,
          progress: 0,
        };
      }
      const totalProgress = org.tasks.reduce((sum, task) => sum + getTaskProgress(task), 0);
      const progress = Math.round((totalProgress / org.tasks.length) * 100);
      return {
        organization: org.name,
        progress,
      };
    });
  }, [taskCandidates]);

  const contextValue: PMContextType = useMemo(
    () => ({
      selectedOrganization,
      selectedProject,
      selectedMilestone,
      selectedTeam,
      selectedTask,
      organizationList,
      projectList,
      selectOrganization,
      selectProject,
      selectMilestone,
      selectTeam,
      selectTask,
      milestoneData,
      teamData,
      organizationData,
      budgetData1,
      taskStatusOverview,
      statusByStartDate,
      statusByEndDate,
      taskPriorityOverview,
      issueData,
      overallProjectStatus,
      projectTasks,
      availableMilestones,
      availableTeams,
      taskCandidates,
      loading,
      chartLoading,
      error,
      taskDetailRefreshKey,
      fetchProjects,
      createProject,
      addTaskToProject,
      updateTaskInProject,
      removeTaskFromProject,
    }),
    [
      selectedOrganization,
      selectedProject,
      selectedMilestone,
      selectedTeam,
      selectedTask,
      organizationList,
      projectList,
      selectOrganization,
      selectProject,
      selectMilestone,
      selectTeam,
      selectTask,
      milestoneData,
      teamData,
      organizationData,
      budgetData1,
      taskStatusOverview,
      statusByStartDate,
      statusByEndDate,
      taskPriorityOverview,
      issueData,
      overallProjectStatus,
      projectTasks,
      availableMilestones,
      availableTeams,
      taskCandidates,
      loading,
      chartLoading,
      error,
      taskDetailRefreshKey,
      fetchProjects,
      createProject,
      addTaskToProject,
      updateTaskInProject,
      removeTaskFromProject,
    ]
  );

  return <PMContext.Provider value={contextValue}>{children}</PMContext.Provider>;
}

export function usePM() {
  const context = useContext(PMContext);
  if (!context) {
    throw new Error("usePM must be used within a PMProvider");
  }
  return context;
}
