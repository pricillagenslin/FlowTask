import { useState } from "react";
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
  LinearProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

import { registerUser } from "../services/api";

interface RegisterProps {
  onRegistered: () => void;
}

export default function Register({ onRegistered }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Simple password strength meter
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(score, 4);
  };

  const strength = getPasswordStrength(password);
  const strengthColors = ["#ef4444", "#f59e0b", "#eab308", "#22c55e"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const result = await registerUser(name, email, password);
      console.log("Registration response:", result);

      setSuccess("Registration successful. You can now login.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleRegister();
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
              <PersonAddIcon fontSize="large" />
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
              Create Account
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Register for FlowTask
            </Typography>
          </Stack>

          {/* Alerts */}
          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ mb: 2, borderRadius: 2 }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              onClose={() => setSuccess("")}
              sx={{ mb: 2, borderRadius: 2 }}
            >
              {success}
            </Alert>
          )}

          {/* Form */}
          <Stack spacing={2.5}>
            <TextField
              label="Name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
              autoComplete="name"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />

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

            <Box>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                fullWidth
                autoComplete="new-password"
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

              {/* Password strength bar */}
              {password && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(strength / 4) * 100}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: strengthColors[strength - 1] || "#ef4444",
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      display: "block",
                      color: strengthColors[strength - 1] || "text.secondary",
                      fontWeight: 600,
                    }}
                  >
                    {strengthLabels[strength - 1] || "Weak"} password
                  </Typography>
                </Box>
              )}
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleRegister}
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
              {loading ? "Creating Account..." : "Register"}
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
              onClick={onRegistered}
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
              Back to Login
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}