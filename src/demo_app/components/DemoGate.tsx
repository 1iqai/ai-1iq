import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
const logo = "/1iQ.webp";

const DEMO_PASSWORD = "1iQDemo";
const SESSION_KEY = "1iq_demo_unlocked";

const DemoGate = ({ children }: { children: React.ReactNode }) => {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true"
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setUnlocked(true);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0F2854 0%, #1a3a6b 50%, #0F2854 100%)",
      }}
    >
      <Paper
        elevation={12}
        sx={{
          p: { xs: 4, sm: 5 },
          borderRadius: 3,
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          background: "rgba(255,255,255,0.97)",
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={logo}
          alt="1iQ Logo"
          sx={{ height: 56, objectFit: "contain", mb: 1 }}
        />

        {/* Lock icon + heading */}
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0F2854, #4988C4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 1.5,
            }}
          >
            <LockOutlinedIcon sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Demo Access
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Enter the demo password to continue
          </Typography>
        </Box>

        {/* Password form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(false);
            }}
            error={error}
            helperText={error ? "Incorrect password. Please try again." : ""}
            fullWidth
            autoFocus
            size="medium"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((s) => !s)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              borderRadius: 2,
              py: 1.2,
              fontWeight: 700,
              fontSize: "1rem",
              background: "linear-gradient(90deg, #0F2854 0%, #4988C4 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #0a1e3d 0%, #3a78b4 100%)",
              },
            }}
          >
            Enter Demo
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DemoGate;
