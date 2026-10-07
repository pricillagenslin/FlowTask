import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  TaskAlt as TaskAltIcon,
} from "@mui/icons-material";

import { login } from "../store/authSlice";
import { loginUser } from "../services/api";

interface LoginProps {
  onRegister: () => void;
}

export default function Login({ onRegister }: LoginProps) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const result = await loginUser(email, password);

      console.log("Login response:", result);

      dispatch(login(result.token));
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        p: 2,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          boxShadow: "0 20px 40px -12px rgba(37, 99, 235, 0.25)",
          border: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
          {/* Logo + Heading */}
          <Stack alignItems="center" spacing={1.5} mb={4}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "white",
                boxShadow: "0 8px 16px -4px rgba(37, 99, 235, 0.4)",
              }}
            >
              <TaskAltIcon fontSize="large" />
            </Box>

            <Typography
              variant="h5"
              fontWeight={800}
              letterSpacing="-0.02em"
              sx={{
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              FlowTask
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Login to manage your tasks
            </Typography>
          </Stack>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ mb: 2, borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Stack spacing={2.5}>
            <TextField
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
              autoComplete="email"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
              autoComplete="current-password"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      size="small"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleLogin}
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : null
              }
              sx={{
                py: 1.4,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 2,
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                boxShadow: "0 8px 16px -4px rgba(37, 99, 235, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 12px 20px -6px rgba(37, 99, 235, 0.5)",
                },
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Divider>
              <Typography variant="caption" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Button
              type="button"
              variant="outlined"
              size="large"
              fullWidth
              onClick={onRegister}
              disabled={loading}
              sx={{
                py: 1.3,
                textTransform: "none",
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 2,
                color: "grey.700",
                borderColor: "grey.300",
                "&:hover": {
                  borderColor: "grey.400",
                  backgroundColor: "grey.50",
                },
              }}
            >
              Create Account
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}