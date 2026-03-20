import { useNavigate } from "react-router-dom";
import { Box, Grid, Paper } from "@mui/material";
import { QuickActionCard } from "../../components/UI/QuickActionCard";
import { PeopleRounded, SettingsRounded, FolderRounded } from "@mui/icons-material";

const AdminOverview = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Manage Users",
      description: "View, edit, and assign roles to users",
      icon: PeopleRounded,
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "Manage Projects",
      description: "View, edit, and assign projects",
      icon: FolderRounded,
      onClick: () => navigate("/admin/projectmanagement"),
    },
    {
      title: "Settings",
      description: "Configure system and admin preferences",
      icon: SettingsRounded,
      onClick: () => navigate("/admin/settings"),
    },
  ];

  return (
    <Box sx={{ p: 2}}>
      <Grid container spacing={2}>
        {cards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }} key={index}>
            <Paper variant="outlined" elevation={3} sx={{ borderRadius: "8px", backgroundColor: "background.default" }}>
              <QuickActionCard {...card} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminOverview;
