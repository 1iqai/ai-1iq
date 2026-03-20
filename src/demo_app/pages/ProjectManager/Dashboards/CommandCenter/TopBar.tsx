import React, { useMemo, useCallback } from "react";
import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent, Box } from "@mui/material";

interface Organization {
  id: string;
  name: string;
  description?: string;
}

interface Project {
  id: string;
  name: string;
  milestones: { id: string; name: string; displayName?: string }[];
  teams?: { id: string; name: string }[];
}

interface TopBarProps {
  organizationList: Organization[];
  selectOrganization: (organizationId: string | null) => void;
  selectedOrganization: string | null;

  projectList: Project[];
  selectProject: (projectId: string) => void;
  selectedProject: Project | null;

  selectedMilestone: string | null;
  selectMilestone: (milestoneId: string | null) => void;
  milestones: { id: string; name: string; displayName?: string }[];

  selectedTeam: string | null;
  selectTeam: (teamId: string | null) => void;
  teams: { id: string; name: string; displayName?: string }[];

  selectedTask: string | null;
  selectTask: (taskId: string | null) => void;
  taskCandidates: any[];
}

const TopBar: React.FC<TopBarProps> = ({
  organizationList,
  selectOrganization,
  selectedOrganization,

  projectList,
  selectProject,
  selectedProject,

  selectedMilestone,
  selectMilestone,
  milestones,

  // selectedTeam,
  // selectTeam,
  // teams,

  selectedTask,
  selectTask,
  taskCandidates,
}) => {
  const handleOrganizationChange = useCallback(
    (event: SelectChangeEvent) => selectOrganization(event.target.value === "all" ? null : event.target.value),
    [selectOrganization]
  );

  const handleProjectChange = useCallback(
    (event: SelectChangeEvent) => selectProject(event.target.value),
    [selectProject]
  );

  const handleMilestoneChange = useCallback(
    (event: SelectChangeEvent) => selectMilestone(event.target.value === "all" ? null : event.target.value),
    [selectMilestone]
  );

  // const handleTeamChange = useCallback(
  //   (event: SelectChangeEvent) => selectTeam(event.target.value === "all" ? null : event.target.value),
  //   [selectTeam]
  // );

  const handleTaskChange = useCallback(
    (event: SelectChangeEvent) => selectTask(event.target.value === "all" ? null : event.target.value),
    [selectTask]
  );

  const organizationValue = useMemo(() => selectedOrganization || "all", [selectedOrganization]);
  const projectValue = useMemo(() => selectedProject?.id || "", [selectedProject]);
  const milestoneValue = useMemo(() => selectedMilestone || "all", [selectedMilestone]);
  // const teamValue = useMemo(() => selectedTeam || "all", [selectedTeam]);
  const taskValue = useMemo(() => selectedTask || "all", [selectedTask]);

  return (
    <Box sx={{ px: 2, py: 1, backgroundColor: "background.default" }}>
      <div className={`w-full py-2 rounded-lg gap-3 flex lg:flex-row flex-col items-center transition-colors duration-200`}>
        <FormControl size="small" sx={{ flex: 1, minWidth: 150, width: "100%" }} disabled={projectList.length === 0}>
          <InputLabel id="project-select-label">Project</InputLabel>
          <Select labelId="project-select-label" value={projectValue} onChange={handleProjectChange} label="Project">
            <MenuItem value="all">All Projects</MenuItem>
            {projectList.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedProject && (
          <FormControl size="small" sx={{ flex: 1, minWidth: 150, width: "100%" }} disabled={milestones.length === 0}>
            <InputLabel id="milestone-select-label">Milestone</InputLabel>
            <Select
              labelId="milestone-select-label"
              value={milestoneValue}
              onChange={handleMilestoneChange}
              label="Milestone"
            >
              <MenuItem value="all">All Milestones</MenuItem>
              {milestones.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.displayName || m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {selectedProject && (
          <FormControl size="small" sx={{ flex: 1, minWidth: 150, width: "100%" }} disabled={organizationList.length === 0}>
            <InputLabel id="organization-select-label">Team</InputLabel>
            <Select labelId="organization-select-label" value={organizationValue} onChange={handleOrganizationChange} label="Organization">
              <MenuItem value="all">All Teams</MenuItem>
              {organizationList.map((o) => (
                <MenuItem key={o.id} value={o.id}>
                  {o.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Team dropdown - hidden
        {selectedProject && (
          <FormControl size="small" sx={{ flex: 1, minWidth: 150, width: "100%" }} disabled={teams.length === 0}>
            <InputLabel id="team-select-label">Team</InputLabel>
            <Select labelId="team-select-label" value={teamValue} onChange={handleTeamChange} label="Team">
              <MenuItem value="all">All Teams</MenuItem>
              {teams.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.displayName || t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )} */}

        {selectedProject && (
          <FormControl
            size="small"
            sx={{ flex: 1, minWidth: 150, width: "100%" }}
            disabled={taskCandidates.length === 0}
          >
            <InputLabel id="task-select-label">Task</InputLabel>
            <Select labelId="task-select-label" value={taskValue} onChange={handleTaskChange} label="Task">
              <MenuItem value="all">All Tasks</MenuItem>
              {taskCandidates.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
    </Box>
  );
};

export default TopBar;
