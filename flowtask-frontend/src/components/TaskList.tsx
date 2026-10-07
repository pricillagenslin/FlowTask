import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
  AppBar,
  Toolbar,
  Container,
  Paper,
  Tooltip,
  Fade,
  Checkbox,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  TaskAlt as TaskAltIcon,
  Inbox as InboxIcon,
} from "@mui/icons-material";

import type { RootState } from "../store/store";

import {
  setTasks,
  addTask,
  updateTask,
  removeTask,
} from "../store/taskSlice";

import { logout } from "../store/authSlice";

import {
  getTasks,
  createTask,
  toggleTask,
  deleteTask,
  logoutUser,
} from "../services/api";

export default function TaskList() {
  const dispatch = useDispatch();

  // =========================
  // REDUX STATE
  // =========================

  const token = useSelector((state: RootState) => state.auth.token);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  // =========================
  // LOCAL STATE
  // =========================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // =========================
  // DERIVED
  // =========================

  const { completedCount, pendingCount } = useMemo(() => {
    const completed = tasks.filter((t) => t.isCompleted).length;
    return {
      completedCount: completed,
      pendingCount: tasks.length - completed,
    };
  }, [tasks]);

  // =========================
  // LOAD TASKS
  // =========================

  useEffect(() => {
    if (!token) {
      setInitialLoading(false);
      return;
    }

    const loadTasks = async () => {
      try {
        setError("");
        setInitialLoading(true);

        const data = await getTasks(token);
        dispatch(setTasks(data));
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
      } finally {
        setInitialLoading(false);
      }
    };

    loadTasks();
  }, [token, dispatch]);

  // =========================
  // CREATE TASK
  // =========================

  const handleCreate = async () => {
    if (!token) return;

    if (!title.trim() || !description.trim()) {
      setError("Please enter title and description");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const task = await createTask(token, title, description);
      dispatch(addTask(task));

      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TOGGLE TASK
  // =========================

  const handleToggle = async (id: number) => {
    if (!token) return;

    try {
      setError("");
      setTogglingId(id);

      const updatedTask = await toggleTask(token, id);
      dispatch(updateTask(updatedTask));
    } catch (err) {
      console.error(err);
      setError("Failed to update task");
    } finally {
      setTogglingId(null);
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const handleDelete = async (id: number) => {
    if (!token) return;

    try {
      setError("");
      setDeletingId(id);

      await deleteTask(token, id);
      dispatch(removeTask(id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    if (!token) return;

    try {
      await logoutUser(token);
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      dispatch(logout());
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", pb: 6 }}>
      {/* App Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Toolbar sx={{ maxWidth: 960, width: "100%", mx: "auto" }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              mr: 1.5,
            }}
          >
            <TaskAltIcon fontSize="small" />
          </Box>

          <Typography
            variant="h6"
            fontWeight={800}
            letterSpacing="-0.02em"
            sx={{ flexGrow: 1 }}
          >
            FlowTask
          </Typography>

          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              textTransform: "none",
              color: "grey.600",
              "&:hover": { color: "error.main", bgcolor: "error.50" },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Page Title + Stats */}
        <Box mb={3}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            My Tasks
          </Typography>

          <Stack direction="row" spacing={1}>
            <Chip
              label={`${pendingCount} pending`}
              size="small"
              sx={{
                bgcolor: "#eff6ff",
                color: "#1d4ed8",
                fontWeight: 600,
              }}
            />
            <Chip
              label={`${completedCount} completed`}
              size="small"
              sx={{
                bgcolor: "#dcfce7",
                color: "#15803d",
                fontWeight: 600,
              }}
            />
          </Stack>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Create Task Card */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "grey.200",
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              gutterBottom
              sx={{ mb: 2 }}
            >
              Create Task
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Task title"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                size="small"
                disabled={loading}
              />

              <TextField
                label="Task description"
                placeholder="Add more details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                maxRows={5}
                size="small"
                disabled={loading}
              />

              <Button
                variant="contained"
                onClick={handleCreate}
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <AddIcon />
                  )
                }
                sx={{
                  alignSelf: "flex-start",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  boxShadow: "0 6px 12px -4px rgba(37, 99, 235, 0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  },
                }}
              >
                {loading ? "Creating..." : "Add Task"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Task List */}
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          Your Tasks
        </Typography>

        {initialLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              py: 8,
              px: 3,
              textAlign: "center",
              borderRadius: 3,
              border: "1px dashed",
              borderColor: "grey.300",
              bgcolor: "transparent",
            }}
          >
            <InboxIcon sx={{ fontSize: 56, color: "grey.300", mb: 1 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first task above to get started.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={1.5}>
            {tasks.map((task) => (
              <Fade in key={task.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: task.isCompleted ? "grey.200" : "grey.200",
                    bgcolor: task.isCompleted ? "grey.50" : "white",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: "primary.300",
                      boxShadow: "0 8px 16px -8px rgba(37, 99, 235, 0.2)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    {/* Checkbox */}
                    <Checkbox
                      checked={task.isCompleted}
                      onChange={() => handleToggle(task.id)}
                      disabled={togglingId === task.id}
                      icon={<UncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      sx={{
                        color: "grey.400",
                        "&.Mui-checked": { color: "success.main" },
                        mt: -0.5,
                      }}
                    />

                    {/* Content */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                          textDecoration: task.isCompleted
                            ? "line-through"
                            : "none",
                          color: task.isCompleted
                            ? "text.secondary"
                            : "text.primary",
                          wordBreak: "break-word",
                        }}
                      >
                        {task.title}
                      </Typography>

                      {task.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            textDecoration: task.isCompleted
                              ? "line-through"
                              : "none",
                            wordBreak: "break-word",
                          }}
                        >
                          {task.description}
                        </Typography>
                      )}
                    </Box>

                    {/* Actions */}
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Delete task">
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(task.id)}
                            disabled={deletingId === task.id}
                            sx={{
                              color: "grey.400",
                              "&:hover": {
                                color: "error.main",
                                bgcolor: "error.50",
                              },
                            }}
                          >
                            {deletingId === task.id ? (
                              <CircularProgress size={16} />
                            ) : (
                              <DeleteIcon fontSize="small" />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Paper>
              </Fade>
            ))}

            <Divider sx={{ my: 1 }} />

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
              </Typography>
            </Box>
          </Stack>
        )}
      </Container>
    </Box>
  );
}