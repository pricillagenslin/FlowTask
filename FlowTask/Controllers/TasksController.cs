using System.Security.Claims;
using FlowTask.DTOs;
using FlowTask.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FlowTask.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly TaskService _taskService;

    public TasksController(TaskService taskService)
    {
        _taskService = taskService;
    }

    // Get the logged-in user's ID from JWT
    private int GetUserId()
    {
        return int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );
    }

    // GET: api/tasks
    [HttpGet]
    public IActionResult GetTasks()
    {
        var userId = GetUserId();

        var tasks = _taskService.GetTasks(userId);

        return Ok(tasks);
    }

    // GET: api/tasks/1
    [HttpGet("{id}")]
    public IActionResult GetTask(int id)
    {
        var userId = GetUserId();

        var task = _taskService.GetTaskById(id, userId);

        if (task == null)
        {
            return NotFound("Task not found");
        }

        return Ok(task);
    }

    // POST: api/tasks
    [HttpPost]
    public IActionResult CreateTask(TaskRequest request)
    {
        var userId = GetUserId();

        var task = _taskService.CreateTask(request, userId);

        return Ok(task);
    }

    // PUT: api/tasks/1
    [HttpPut("{id}")]
    public IActionResult UpdateTask(
        int id,
        TaskRequest request)
    {
        var userId = GetUserId();

        var task = _taskService.UpdateTask(
            id,
            request,
            userId
        );

        if (task == null)
        {
            return NotFound("Task not found");
        }

        return Ok(task);
    }

    // PATCH: api/tasks/1/toggle
    [HttpPatch("{id}/toggle")]
    public IActionResult ToggleTask(int id)
    {
        var userId = GetUserId();

        var task = _taskService.ToggleTask(id, userId);

        if (task == null)
        {
            return NotFound("Task not found");
        }

        return Ok(task);
    }

    // DELETE: api/tasks/1
    [HttpDelete("{id}")]
    public IActionResult DeleteTask(int id)
    {
        var userId = GetUserId();

        var deleted = _taskService.DeleteTask(id, userId);

        if (!deleted)
        {
            return NotFound("Task not found");
        }

        return Ok("Task deleted successfully");
    }
}