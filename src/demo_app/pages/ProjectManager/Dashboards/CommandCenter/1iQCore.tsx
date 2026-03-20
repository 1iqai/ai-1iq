import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid } from "@mui/material";
import Card from "../../Components/Charts/Card";
import Status from "../../Components/Charts/Status";
import { TaskPieChart } from "../../Components/Charts/TaskPieChart";
import BudgetChart1 from "../../Components/Charts/BudgetChart";
import MilestonesChart from "../../Components/Charts/MilestonesChart";
import OrganizationProgressChart from "../../Components/Charts/OrganizationProgressChart";
// import TeamCompletionChart from "../../Components/Charts/TeamCompletionChart";
import { IssueChart } from "../../Components/Charts/IssueChart";
import { useTheme } from "../../../../hooks/useTheme";
import GlassCard from "../../../../components/shared/GlassCard";
import ProjectStatus from "../../Components/Charts/ProjectStatus";

type OneiQCoreProps = {
  overallProjectStatus: any;
  selectedProject: any;
  teamData: any;
  milestoneData: any;
  organizationData: any;
  budgetData1: any;
  taskStatusOverview: any;
  statusByStartDate: any;
  statusByEndDate: any;
  taskPriorityOverview: any;
  issueData: any;
  isReport?: boolean;
  chartLoading?: boolean;
};

const OneiQCore: React.FC<OneiQCoreProps> = ({  isReport = false, ...props }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handlePriorityClick = useCallback((priority: string) => {
    navigate(`/pm/intel?priority=${encodeURIComponent(priority)}`);
  }, [navigate]);

  const handleIssueStatusClick = useCallback((status: string) => {
    navigate(`/pm/approvals?issueStatus=${encodeURIComponent(status)}`);
  }, [navigate]);

  return (
    <Box
      sx={{
        height: { xs: "auto", lg: isReport ? "auto" : "100%" },
        display: { xs: "flex", lg: "grid" },
        flexDirection: "column",
        gridTemplateRows: { lg: isReport ? "380px 240px 160px" : "1.8fr 1.3fr 1.2fr" },
        gap: isReport ? 0.5 : 1,
        overflow: { xs: "visible", lg: isReport ? "visible" : "hidden" },
        "& .MuiTypography-root": {
          filter: "blur(4px)",
          userSelect: "none",
        },
      }}
      className={isDark ? "scrollbar-custom-dark" : "scrollbar-custom"}
    >
      {/* Row 1: Project Status | Project Budget | Days Remaining + Status */}
      <Box sx={{ minHeight: { xs: 200, lg: 0 }, overflow: "hidden" }}>
        <Grid container spacing={isReport ? 0.25 : 1} sx={{ height: "100%", alignItems: "stretch" }}>
          <Grid size={{ xs: 6, md: 3 }} sx={{ height: { lg: "100%" } }}>
            <GlassCard title="Project Status" minHeight={0}>
              <ProjectStatus data={props.overallProjectStatus} />
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} order={{ xs: 3, md: 2 }} sx={{ height: { lg: "100%" } }}>
            <GlassCard title="" minHeight={0}>
              <BudgetChart1 data={props.budgetData1} />
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }} order={{ xs: 2, md: 3 }} sx={{ height: { lg: "100%" } }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, height: "100%", overflow: "hidden" }}>
              <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                <GlassCard title="Days Remaining" minHeight={0} sx={{ height: "100%" }}>
                  <Card data={props.selectedProject} />
                </GlassCard>
              </Box>
              <Box sx={{ flexShrink: 0 }}>
                <Status data={props.selectedProject} compact />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Row 2: Task Pie Charts - lazy loaded for better initial load performance */}
      <Box sx={{ minHeight: { xs: 200, lg: 0 }, overflow: "hidden" }}>
        <Grid container spacing={isReport ? 0.25 : 1} sx={{ height: "100%", alignItems: "stretch" }}>
          <Grid size={{ xs: 6, md: 3 }} sx={{ height: { lg: "100%" } }}>
            <GlassCard title="Task Status" minHeight={0} loading={props.chartLoading} lazy>
              <TaskPieChart data={props.taskStatusOverview} title="Task Status" />
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }} sx={{ height: { lg: "100%" } }}>
            <GlassCard title="Task Priority" minHeight={0} loading={props.chartLoading} lazy>
              <TaskPieChart data={props.taskPriorityOverview} title="Task Priority" onSegmentClick={handlePriorityClick} />
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }} sx={{ height: { lg: "100%" } }}>
            <GlassCard title="Task Completion" minHeight={0} loading={props.chartLoading} lazy>
              <TaskPieChart data={props.statusByEndDate} title="Task Completion" />
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }} sx={{ height: { lg: "100%" } }}>
            <GlassCard title="Issue Status" minHeight={0} lazy>
              <IssueChart data={props.issueData} title="Issue Status" onSegmentClick={handleIssueStatusClick} />
            </GlassCard>
          </Grid>
        </Grid>
      </Box>

      {/* Row 3: Organization Progress | Milestone Progress - lazy loaded for better initial load performance */}
      <Box sx={{ minHeight: { xs: 200, lg: 0 }, overflow: "hidden" }}>
        <Grid container spacing={isReport ? 0.25 : 1} sx={{ height: "100%", alignItems: "stretch" }}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ height: { lg: "100%" } }}>
            <GlassCard minHeight={0} lazy>
              <OrganizationProgressChart organizationData={props.organizationData} isReport={isReport} />
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ height: { lg: "100%" } }}>
            <GlassCard minHeight={0} lazy>
              <MilestonesChart milestoneData={props.milestoneData} isReport={isReport} />
            </GlassCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default OneiQCore;
