using FlowTask.Data;
using FlowTask.DTOs;
using FlowTask.Models;

namespace FlowTask.Services;

public class TaskService
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    // Create a new task
    public TaskItem CreateTask(TaskRequest request, int userId)
    {
        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow,
            UserId = userId
        };

        _context.Tasks.Add(task);
        _context.SaveChanges();

        return task;
    }

    // Get all tasks for a user
    public List<TaskItem> GetTasks(int userId)
    {
        return _context.Tasks
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToList();
    }

    // Get one task
    public TaskItem? GetTaskById(int id, int userId)
    {
        return _context.Tasks
            .FirstOrDefault(x => x.Id == id && x.UserId == userId);
    }

    // Update a task
    public TaskItem? UpdateTask(int id, TaskRequest request, int userId)
    {
        var task = GetTaskById(id, userId);

        if (task == null)
        {
            return null;
        }

        task.Title = request.Title;
        task.Description = request.Description;

        _context.SaveChanges();

        return task;
    }

    // Mark task as completed/incomplete
    public TaskItem? ToggleTask(int id, int userId)
    {
        var task = GetTaskById(id, userId);

        if (task == null)
        {
            return null;
        }

        task.IsCompleted = !task.IsCompleted;

        _context.SaveChanges();

        return task;
    }

    // Delete a task
    public bool DeleteTask(int id, int userId)
    {
        var task = GetTaskById(id, userId);

        if (task == null)
        {
            return false;
        }

        _context.Tasks.Remove(task);
        _context.SaveChanges();

        return true;
    }
}