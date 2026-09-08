using employee_management_api.Data;
using employee_management_api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace employee_management_api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly EmployeeDbContext _context;

    public EmployeesController(EmployeeDbContext context)
    {
        _context = context;
    }

    // GET: /api/employees
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
    {
        var employees = await _context.Employees
            .OrderBy(e => e.Id)
            .ToListAsync();

        return Ok(employees);
    }

    // GET: /api/employees/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Employee>> GetEmployee(int id)
    {
        var employee = await _context.Employees.FindAsync(id);

        if (employee == null)
        {
            return NotFound(new
            {
                message = $"Employee with ID {id} not found"
            });
        }

        return Ok(employee);
    }

    // POST: /api/employees
    [HttpPost]
    public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
    {
        employee.Id = 0;

        _context.Employees.Add(employee);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetEmployee),
            new { id = employee.Id },
            employee
        );
    }

    // PUT: /api/employees/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEmployee(
        int id,
        Employee employee)
    {
        var existingEmployee = await _context.Employees.FindAsync(id);

        if (existingEmployee == null)
        {
            return NotFound(new
            {
                message = $"Employee with ID {id} not found"
            });
        }

        existingEmployee.Name = employee.Name;
        existingEmployee.Department = employee.Department;
        existingEmployee.Role = employee.Role;
        existingEmployee.Email = employee.Email;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: /api/employees/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        var employee = await _context.Employees.FindAsync(id);

        if (employee == null)
        {
            return NotFound(new
            {
                message = $"Employee with ID {id} not found"
            });
        }

        _context.Employees.Remove(employee);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}