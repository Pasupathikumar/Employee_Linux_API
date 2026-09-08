const apiUrl = "/api/employees";

const employeeForm =
    document.getElementById("employeeForm");

const employeeTableBody =
    document.getElementById("employeeTableBody");

const message =
    document.getElementById("message");

const employeeId =
    document.getElementById("employeeId");

const nameInput =
    document.getElementById("name");

const departmentInput =
    document.getElementById("department");

const roleInput =
    document.getElementById("role");

const emailInput =
    document.getElementById("email");

const formTitle =
    document.getElementById("formTitle");

const saveButton =
    document.getElementById("saveButton");

const cancelButton =
    document.getElementById("cancelButton");


document.addEventListener(
    "DOMContentLoaded",
    loadEmployees
);


employeeForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const employee = {

            name: nameInput.value.trim(),

            department:
                departmentInput.value.trim(),

            role:
                roleInput.value.trim(),

            email:
                emailInput.value.trim()

        };

        try {

            if (employeeId.value) {

                await updateEmployee(
                    employeeId.value,
                    employee
                );

            } else {

                await createEmployee(employee);

            }

        } catch (error) {

            showMessage(
                "Operation failed: " + error.message,
                "error"
            );

        }

    }
);


async function loadEmployees() {

    try {

        const response =
            await fetch(apiUrl);

        if (!response.ok) {

            throw new Error(
                "Unable to load employees"
            );

        }

        const employees =
            await response.json();

        employeeTableBody.innerHTML = "";

        if (employees.length === 0) {

            employeeTableBody.innerHTML = `
                <tr>
                    <td colspan="6">
                        No employees found
                    </td>
                </tr>
            `;

            return;
        }

        employees.forEach(employee => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>${employee.id}</td>

                <td>${employee.name}</td>

                <td>${employee.department}</td>

                <td>${employee.role}</td>

                <td>${employee.email}</td>

                <td>

                    <button
                        class="edit-button"
                        onclick="editEmployee(${employee.id})">

                        Edit

                    </button>

                    <button
                        class="delete-button"
                        onclick="deleteEmployee(${employee.id})">

                        Delete

                    </button>

                </td>

            `;

            employeeTableBody.appendChild(row);

        });

    } catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

}


async function createEmployee(employee) {

    const response =
        await fetch(apiUrl, {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(employee)

        });

    if (!response.ok) {

        throw new Error(
            "Unable to create employee"
        );

    }

    showMessage(
        "Employee created successfully",
        "success"
    );

    resetForm();

    await loadEmployees();
}


async function editEmployee(id) {

    try {

        const response =
            await fetch(`${apiUrl}/${id}`);

        if (!response.ok) {

            throw new Error(
                "Unable to load employee"
            );

        }

        const employee =
            await response.json();

        employeeId.value =
            employee.id;

        nameInput.value =
            employee.name;

        departmentInput.value =
            employee.department;

        roleInput.value =
            employee.role;

        emailInput.value =
            employee.email;

        formTitle.textContent =
            "Edit Employee";

        saveButton.textContent =
            "Update Employee";

        cancelButton.hidden =
            false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

}


async function updateEmployee(
    id,
    employee
) {

    const response =
        await fetch(
            `${apiUrl}/${id}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(employee)

            }
        );

    if (!response.ok) {

        throw new Error(
            "Unable to update employee"
        );

    }

    showMessage(
        "Employee updated successfully",
        "success"
    );

    resetForm();

    await loadEmployees();
}


async function deleteEmployee(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this employee?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${apiUrl}/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            throw new Error(
                "Unable to delete employee"
            );

        }

        showMessage(
            "Employee deleted successfully",
            "success"
        );

        await loadEmployees();

    } catch (error) {

        showMessage(
            error.message,
            "error"
        );

    }

}


function cancelEdit() {

    resetForm();

}


function resetForm() {

    employeeForm.reset();

    employeeId.value = "";

    formTitle.textContent =
        "Add Employee";

    saveButton.textContent =
        "Save Employee";

    cancelButton.hidden =
        true;

}


function showMessage(
    text,
    type
) {

    message.textContent =
        text;

    message.className =
        type;

    setTimeout(() => {

        message.textContent = "";

        message.className = "";

    }, 4000);

}