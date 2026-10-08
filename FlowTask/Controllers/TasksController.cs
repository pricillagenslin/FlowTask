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
    private readonly ILogger<TasksController> _logger;

    public TasksController(TaskService taskService, ILogger<TasksController> logger)
    {
        _taskService = taskService;
        _logger = logger;
    }

    // Safely get the logged-in user's ID from the JWT.
    // Returns null if the claim is missing or not a valid int.
    private int? GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(value) || !int.TryParse(value, out var id))
        {
            return null;
        }

        return id;
    }

    // GET: api/tasks
    [HttpGet]
    public IActionResult GetTasks()
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized("Invalid or missing user claim");

            var tasks = _taskService.GetTasks(userId.Value);
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET TASKS ERROR");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // GET: api/tasks/1
    [HttpGet("{id}")]
    public IActionResult GetTask(int id)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized("Invalid or missing user claim");

            var task = _taskService.GetTaskById(id, userId.Value);

            if (task == null)
                return NotFound("Task not found");

            return Ok(task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET TASK ERROR");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // POST: api/tasks
    [HttpPost]
    public IActionResult CreateTask(TaskRequest request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized("Invalid or missing user claim");

            var task = _taskService.CreateTask(request, userId.Value);
            return Ok(task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "CREATE TASK ERROR");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // PUT: api/tasks/1
    [HttpPut("{id}")]
    public IActionResult UpdateTask(int id, TaskRequest request)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized("Invalid or missing user claim");

            var task = _taskService.UpdateTask(id, request, userId.Value);

            if (task == null)
                return NotFound("Task not found");

            return Ok(task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "UPDATE TASK ERROR");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // PATCH: api/tasks/1/toggle
    [HttpPatch("{id}/toggle")]
    public IActionResult ToggleTask(int id)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized("Invalid or missing user claim");

            var task = _taskService.ToggleTask(id, userId.Value);

            if (task == null)
                return NotFound("Task not found");

            return Ok(task);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "TOGGLE TASK ERROR");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    // DELETE: api/tasks/1
    [HttpDelete("{id}")]
    public IActionResult DeleteTask(int id)
    {
        try
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized("Invalid or missing user claim");

            var deleted = _taskService.DeleteTask(id, userId.Value);

            if (!deleted)
                return NotFound("Task not found");

            return Ok("Task deleted successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "DELETE TASK ERROR");
            return StatusCode(500, new { error = ex.Message });
        }
    }
}