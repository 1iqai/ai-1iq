import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogContent,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { useReCaptcha } from "../../hooks/useReCaptcha";
import { signIn } from "../../utility/utils";
import { handleError } from "../../utility/errorHandler";
import Logo from "../../components/Logo/Logo";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user: loggedInUser, setUser, setIsLoggedIn, isLoggedIn } = useAuth();
  const { getToken } = useReCaptcha();

  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn && loggedInUser) {
      const redirectPath = getRedirectPath(loggedInUser.role);
      navigate(redirectPath);
    }
  }, [isLoggedIn, loggedInUser, navigate]);

  const getRedirectPath = (role: string) => {
    switch (role) {
      case "Project Manager":
        return "/analyticsDashboard";
      case "Admin":
        return "/admindashboard";
      case "Super Admin":
        return "/super-admin/dashboard";
      default:
        return "/login";
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Generate reCAPTCHA token
      const recaptchaToken = await getToken('login');

      if (!recaptchaToken) {
        throw new Error('Unable to verify you are human. Please refresh and try again.');
      }

      const user = await signIn(formData.email, formData.password, recaptchaToken);

      setUser(user);
      setShowSuccess(true);
      setIsLoggedIn(true);

      const redirectPath = getRedirectPath(user.role);
      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);
    } catch (err: any) {
      // Check if user needs to set a new password (first-time login)
      if (err?.name === 'NewPasswordRequiredError' || err?.message === 'NEW_PASSWORD_REQUIRED') {
        navigate("/set-new-password");
        return;
      }
      setError(handleError(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Success Dialog */}
      <Dialog
        open={showSuccess}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              textAlign: "center",
              p: 2,
            },
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 32, color: "white" }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Login Successful!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirecting to your dashboard...
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Main Container */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "",
          px: { xs: 2, sm: 4 },
          py: { xs: 5, sm: 10 },
        }}
      >
        <Box></Box>
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: 400, sm: 480 },
            backgroundColor: "background.default",
            borderRadius: 4,
            p: { xs: 3, sm: 4 },
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
            <Box sx={{ mb: 2.5 }}>
              <Logo />
            </Box>

            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1.5,
                fontSize: { xs: "1.5rem", sm: "1.5rem" },
              }}
            >
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to manage your projects efficiently
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {/* Email TextField */}
            <TextField
              fullWidth
              type="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              autoFocus
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
                htmlInput: { maxLength: 64 },
              }}
              sx={{ mb: 3 }}
            />

            {/* Password TextField */}
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        size="small"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
                htmlInput: { minLength: 6, maxLength: 32 },
              }}
              sx={{ mb: 2 }}
            />

            {/* Forgot Password Link */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot your password?
                </Typography>
              </Link>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: "0.875rem",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: "50px",
                color: "#fff",
                background: "linear-gradient(to right, #0073E6, #4ca3f5)",
                
                "&:hover": {
                  background: "linear-gradient(to right, #005bb5, #3a8dd6)",
                  boxShadow: 3,
                },

                "&.Mui-disabled": {
                  color: "#fff",
                  opacity: 0.7,
                  background: "linear-gradient(to right, #0073E6, #4ca3f5)",
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  Signing In...
                </Box>
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;
