import { useNavigate } from "react-router-dom";
import { Grid, Paper } from "@mui/material";
import { QuickActionCard } from "../../components/UI/QuickActionCard";
import {
  PeopleRounded,
  FactoryRounded,
  BusinessRounded,
  AccountTreeRounded,
  SettingsRounded,
} from "@mui/icons-material";

const SuperAdminOverview = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Manage Users",
      description: "View, edit, and assign roles to users",
      icon: PeopleRounded,
      onClick: () => navigate("/super-admin/users"),
    },
    {
      title: "Industry Management",
      description: "Maintain the list of industries used in the system",
      icon: FactoryRounded,
      onClick: () => navigate("/super-admin/industries"),
    },
    {
      title: "Organization Management",
      description: "Manage and categorize organizations",
      icon: BusinessRounded,
      onClick: () => navigate("/super-admin/organizations"),
    },
    {
      title: "Team Management",
      description: "Manage and categorize teams within organizations",
      icon: AccountTreeRounded,
      onClick: () => navigate("/super-admin/divisions"),
    },
    {
      title: "Settings",
      description: "Configure system and admin preferences",
      icon: SettingsRounded,
      onClick: () => navigate("/super-admin/settings"),
    },
  ];

  return (
    <>
      <Grid container spacing={2}>
        {cards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }} key={index}>
            <Paper variant="outlined" elevation={3} sx={{ borderRadius: "8px", backgroundColor: "background.default" }}>
              <QuickActionCard {...card} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default SuperAdminOverview;
