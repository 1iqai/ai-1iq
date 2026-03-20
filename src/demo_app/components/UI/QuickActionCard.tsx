import { Box, Typography } from "@mui/material";

type QuickActionCardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
};

export const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, description, icon, onClick }) => {
  const IconComponent = icon;

  return (
    <>
      <Box sx={{ height: "120px", padding: "0 24px", cursor: "pointer" }} onClick={onClick}>
        <div className="flex items-center gap-5 h-full">
          <div>
            <IconComponent sx={{ fontSize: 36, color: "primary.main" }} />
          </div>
          <div>
            <Typography
              variant="h4"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                fontSize: "1.125rem",
                lineHeight: 1.5,
                marginBottom: "0.5rem",
              }}
            >
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {description}
            </Typography>
          </div>
        </div>
      </Box>
    </>
  );
};
