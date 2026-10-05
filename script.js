// Student data
let students = JSON.parse(
    localStorage.getItem("students")
) || [];

// Attendance data
let attendance = JSON.parse(
    localStorage.getItem("attendance")
) || {};


// Get today's date
function getToday() {

    const date = new Date();

    return date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");
}


// Set default date
document.getElementById("attendanceDate").value = getToday();


// Save data
function saveData() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );
}


// Add student
document
    .getElementById("studentForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("studentName").value.trim();

        const roll =
            document.getElementById("rollNumber").value.trim();

        const studentClass =
            document.getElementById("studentClass").value.trim();


        // Check duplicate roll number
        const exists = students.some(
            student => student.roll === roll
        );

        if (exists) {
            alert("Roll number already exists.");
            return;
        }


        const student = {

            id: Date.now(),

            name: name,

            roll: roll,

            className: studentClass

        };


        students.push(student);

        saveData();

        document.getElementById("studentForm").reset();

        render();

    });


// Mark attendance
function markAttendance(studentId, status) {

    const date =
        document.getElementById("attendanceDate").value;


    if (!attendance[date]) {

        attendance[date] = {};

    }


    attendance[date][studentId] = status;

    saveData();

    render();

}


// Get student's status
function getStatus(studentId, date) {

    if (
        attendance[date] &&
        attendance[date][studentId]
    ) {
        return attendance[date][studentId];
    }

    return "Not Marked";
}


// Calculate attendance percentage
function getPercentage(studentId) {

    let total = 0;

    let present = 0;


    Object.keys(attendance).forEach(date => {

        const status =
            attendance[date][studentId];


        if (status) {

            total++;

            if (
                status === "Present" ||
                status === "Late"
            ) {
                present++;
            }

        }

    });


    if (total === 0) {
        return 0;
    }


    return Math.round(
        (present / total) * 100
    );

}


// Delete student
function deleteStudent(id) {

    const student =
        students.find(s => s.id === id);

    if (!student) {
        return;
    }


    if (
        !confirm(
            "Delete " + student.name + "?"
        )
    ) {
        return;
    }


    students = students.filter(
        student => student.id !== id
    );


    // Remove attendance records
    Object.keys(attendance).forEach(date => {

        delete attendance[date][id];

    });


    saveData();

    render();

}


// Get status HTML
function statusHTML(status) {

    if (status === "Present") {

        return `
            <span class="status status-present">
                Present
            </span>
        `;

    }


    if (status === "Absent") {

        return `
            <span class="status status-absent">
                Absent
            </span>
        `;

    }


    if (status === "Late") {

        return `
            <span class="status status-late">
                Late
            </span>
        `;

    }


    return `
        <span class="status status-none">
            Not Marked
        </span>
    `;

}


// Render students
function render() {

    const table =
        document.getElementById("studentTable");

    const search =
        document
            .getElementById("search")
            .value
            .toLowerCase();

    const date =
        document.getElementById("attendanceDate").value;


    const filteredStudents =
        students.filter(student => {

            return (
                student.name.toLowerCase().includes(search) ||
                student.roll.toLowerCase().includes(search) ||
                student.className.toLowerCase().includes(search)
            );

        });


    table.innerHTML = "";


    if (filteredStudents.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No students found.
                </td>
            </tr>
        `;

        updateDashboard();

        return;
    }


    filteredStudents.forEach(student => {

        const status =
            getStatus(student.id, date);

        const percentage =
            getPercentage(student.id);


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${student.name}</strong>
            </td>

            <td>
                ${student.roll}
            </td>

            <td>
                ${student.className}
            </td>

            <td>
                ${statusHTML(status)}
            </td>

            <td>

                <div class="attendance-buttons">

                    <button
                        class="present-btn"
                        onclick="markAttendance(
                            ${student.id},
                            'Present'
                        )"
                    >
                        Present
                    </button>

                    <button
                        class="absent-btn"
                        onclick="markAttendance(
                            ${student.id},
                            'Absent'
                        )"
                    >
                        Absent
                    </button>

                    <button
                        class="late-btn"
                        onclick="markAttendance(
                            ${student.id},
                            'Late'
                        )"
                    >
                        Late
                    </button>

                </div>

            </td>

            <td>
                <strong>${percentage}%</strong>
            </td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteStudent(
                        ${student.id}
                    )"
                >
                    Delete
                </button>

            </td>

        `;


        table.appendChild(row);

    });


    updateDashboard();

}


// Update dashboard
function updateDashboard() {

    const date =
        document.getElementById("attendanceDate").value;


    let present = 0;

    let absent = 0;

    let late = 0;


    if (attendance[date]) {

        Object.values(
            attendance[date]
        ).forEach(status => {

            if (status === "Present") {
                present++;
            }

            if (status === "Absent") {
                absent++;
            }

            if (status === "Late") {
                late++;
            }

        });

    }


    document.getElementById(
        "totalStudents"
    ).textContent = students.length;


    document.getElementById(
        "presentCount"
    ).textContent = present;


    document.getElementById(
        "absentCount"
    ).textContent = absent;


    document.getElementById(
        "lateCount"
    ).textContent = late;

}


// Search
document
    .getElementById("search")
    .addEventListener(
        "input",
        render
    );


// Date change
document
    .getElementById("attendanceDate")
    .addEventListener(
        "change",
        render
    );


// Demo students on first run
if (students.length === 0) {

    students = [

        {
            id: 1,
            name: "Rahul Sharma",
            roll: "101",
            className: "BCA"
        },

        {
            id: 2,
            name: "Priya Patel",
            roll: "102",
            className: "BCA"
        },

        {
            id: 3,
            name: "Amit Kumar",
            roll: "103",
            className: "BCA"
        }

    ];

    saveData();

}


// Start application
render();
