// Define roll numbers for all sections in a single object
const rollNumbers = {
    section1: [
        '22WJ1A04R7', '22WJ1A04R8', '22WJ1A04R9',
        '22WJ1A04T0', '22WJ1A04T1', '22WJ1A04T2', '22WJ1A04T3', '22WJ1A04T4', '22WJ1A04T5', '22WJ1A04T6', '22WJ1A04T7', '22WJ1A04T8', '22WJ1A04T9',
        '22WJ1A04U0', '22WJ1A04U1', '22WJ1A04U2', '22WJ1A04U3', '22WJ1A04U4', '22WJ1A04U5', '22WJ1A04U6', '22WJ1A04U7', '22WJ1A04U8', '22WJ1A04U9',
        '22WJ1A04V0', '22WJ1A04V1', '22WJ1A04V2', '22WJ1A04V3', '22WJ1A04V4', '22WJ1A04V5', '22WJ1A04V6', '22WJ1A04V7', '22WJ1A04V8', '22WJ1A04V9',
        '22WJ1A04W0', '22WJ1A04W1', '22WJ1A04W2', '22WJ1A04W3', '22WJ1A04W4', '22WJ1A04W5', '22WJ1A04W6', '22WJ1A04W7', '22WJ1A04W8', '22WJ1A04W9',
        '22WJ1A04X0', '22WJ1A04X1', '22WJ1A04X2', '22WJ1A04X3', '22WJ1A04X4', '22WJ1A04X5', '22WJ1A04X6', '22WJ1A04X7', '22WJ1A04X8', '22WJ1A04X9',
        '22WJ1A04Y0', '22WJ1A04Y1', '22WJ1A04Y2', '22WJ1A04Y3', '22WJ1A04Y4', '22WJ1A04Y5', '22WJ1A04Y6', '22WJ1A04Y7', '22WJ1A04Y8', '22WJ1A04Y9',
        '22WJ1A04Z0', '22WJ1A04Z1'
    ],
    section2: [
        '22WJ1A0501', '22WJ1A0502', '22WJ1A0503', '22WJ1A0504', '22WJ1A0505',
        // ... add more roll numbers for section 2
    ],
    section3: [
        '22WJ1A0601', '22WJ1A0602', '22WJ1A0603', '22WJ1A0604', '22WJ1A0605',
        // ... add more roll numbers for section 3
    ],
    section4: [
        '22WJ1A0701', '22WJ1A0702', '22WJ1A0703', '22WJ1A0704', '22WJ1A0705',
        // ... add more roll numbers for section 4
    ],
    section5: [
        '22WJ1A0801', '22WJ1A0802', '22WJ1A0803', '22WJ1A0804', '22WJ1A0805',
        // ... add more roll numbers for section 5
    ]
};

// New object for section names
const sectionNames = {
    1: "ECE1 (2nd year)",
    2: "ECE (3rd year)",
    3: "CSE (1st year)",
    4: "Mech (4th year)",
    5: "Civil (3rd year)"
};

function createSection(sectionNumber) {
    const sectionContainer = document.getElementById('sectionContainer');
    const section = document.createElement('div');
    section.className = 'section-card';
    section.innerHTML = `
        <h1>${sectionNames[sectionNumber]}</h1>
        <button class="takeAttendanceBtn">Take Attendance</button>
        <button class="viewAttendanceBtn">View</button>

        <div class="attendanceForm hidden">
            <div class="attendanceList"></div>
            <button class="saveAttendanceBtn">Save</button>
            <div class="attendanceResults hidden">
                <!-- ... (existing attendance results HTML) -->
            </div>
        </div>

        <div class="viewAttendance hidden">
            <h2 class="currentDate"></h2>
            <div class="lastAttendanceResults"></div>
        </div>
    `;
    sectionContainer.appendChild(section);

    let attendance = {};

    function getRollNumbersForSection(sectionNumber) {
        return rollNumbers[`section${sectionNumber}`];
    }

    function createAttendanceList() {
        const attendanceList = section.querySelector('.attendanceList');
        const rollNumbers = getRollNumbersForSection(sectionNumber);
        const midpoint = Math.ceil(rollNumbers.length / 2);

        attendanceList.innerHTML = '';

        const leftColumn = document.createElement('div');
        leftColumn.className = 'attendance-column';
        const rightColumn = document.createElement('div');
        rightColumn.className = 'attendance-column';

        rollNumbers.forEach((rollNumber, index) => {
            const div = document.createElement('div');
            div.className = 'student-item';
            div.innerHTML = `
                <input type="checkbox" id="student${sectionNumber}${rollNumber}" checked>
                <label for="student${sectionNumber}${rollNumber}">${rollNumber.slice(-2)}</label>
            `;

            if (index < midpoint) {
                leftColumn.appendChild(div);
            } else {
                rightColumn.appendChild(div);
            }
        });

        attendanceList.appendChild(leftColumn);
        attendanceList.appendChild(rightColumn);
    }

    function saveAttendance() {
        const present = [];
        const absent = [];
        const rollNumbers = getRollNumbersForSection(sectionNumber);

        rollNumbers.forEach(rollNumber => {
            const checkbox = section.querySelector(`#student${sectionNumber}${rollNumber}`);
            if (checkbox.checked) {
                present.push(rollNumber);
            } else {
                absent.push(rollNumber);
            }
        });

        attendance = {
            date: new Date().toLocaleDateString('en-IN'),
            present: present,
            absent: absent
        };

        // Save to local storage
        localStorage.setItem(`attendance_section${sectionNumber}`, JSON.stringify(attendance));

        const attendanceResults = section.querySelector('.attendanceResults');
        attendanceResults.innerHTML = `
            <h2 class="currentDate">Date: ${attendance.date}</h2>
            <table class="attendance-results-table">
                <thead>
                    <tr>
                        <th>Present Students</th>
                        <th>Absent Students</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="presentStudents">${present.map(roll => roll.slice(-2)).join(', ')}</td>
                        <td class="absentStudents">${absent.map(roll => roll.slice(-2)).join(', ')}</td>
                    </tr>
                    <tr class="total-row">
                        <td>Total Present: ${present.length}</td>
                        <td>Total Absent: ${absent.length}</td>
                    </tr>
                </tbody>
            </table>
            <p class="totalStudents">Total Students: ${rollNumbers.length}</p>
        `;
        attendanceResults.classList.remove('hidden');
        
    }

    function viewLastAttendance() {
        // Retrieve from local storage
        const storedAttendance = localStorage.getItem(`attendance_section${sectionNumber}`);
        if (storedAttendance) {
            attendance = JSON.parse(storedAttendance);
        }

        const lastAttendanceResults = section.querySelector('.lastAttendanceResults');
        if (Object.keys(attendance).length === 0) {
            lastAttendanceResults.innerHTML = '<p>No attendance data available.</p>';
        } else {
            section.querySelector('.currentDate').textContent = `Date: ${attendance.date}`;
            lastAttendanceResults.innerHTML = `
                <table>
                    <tr>
                        <th>Present Students</th>
                        <th>Absent Students</th>
                    </tr>
                    <tr>
                        <td>${attendance.present.map(roll => roll.slice(-2)).join(', ')}</td>
                        <td>${attendance.absent.map(roll => roll.slice(-2)).join(', ')}</td>
                    </tr>
                    <tr>
                        <td>Total Present: ${attendance.present.length}</td>
                        <td>Total Absent: ${attendance.absent.length}</td>
                    </tr>
                </table>
                <p>Total Students: ${getRollNumbersForSection(sectionNumber).length}</p>
            `;
        }
         
    }
    
       


    function toggleView(viewToShow) {
        const views = ['attendanceForm', 'attendanceResults', 'viewAttendance'];
        views.forEach(view => {
            const element = section.querySelector(`.${view}`);
            if (view === viewToShow && element.classList.contains('hidden')) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        });
    }

    function loadSavedAttendance() {
        const storedAttendance = localStorage.getItem(`attendance_section${sectionNumber}`);
        if (storedAttendance) {
            attendance = JSON.parse(storedAttendance);
        }
    }

    section.querySelector('.takeAttendanceBtn').addEventListener('click', () => {
        toggleView('attendanceForm');
    });

    section.querySelector('.viewAttendanceBtn').addEventListener('click', () => {
        toggleView('viewAttendance');
        viewLastAttendance();
    });

    section.querySelector('.saveAttendanceBtn').addEventListener('click', () => {
        saveAttendance();
    });

    createAttendanceList();
    loadSavedAttendance();
}

// Create 5 sections
for (let i = 1; i <= 5; i++) {
    createSection(i);
}