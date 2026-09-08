using employee_management_api.Models;
using Microsoft.EntityFrameworkCore;

namespace employee_management_api.Data;

public class EmployeeDbContext : DbContext
{
    public EmployeeDbContext(DbContextOptions<EmployeeDbContext> options)
        : base(options)
    {
    }

    public DbSet<Employee> Employees => Set<Employee>();
}