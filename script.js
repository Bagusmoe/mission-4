document.addEventListener('DOMContentLoaded', () => {
    const dateTimeElement = document.getElementById('date-time');
    const taskInput = document.getElementById('task');
    const prioritySelect = document.getElementById('priority');
    const dueDateInput = document.getElementById('due-date');
    const addTaskButton = document.getElementById('add-task');
    const todoBody = document.getElementById('todo-body');
    const doneTasks = document.getElementById('done-tasks');
    const deleteAllButton = document.getElementById('delete-all');

    let tasks = [];

    // Initialize flatpickr for the due date input
    flatpickr(dueDateInput, {
        dateFormat: "d/m/Y",
        minDate: "today"
    });

    const updateDateTime = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = now.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        dateTimeElement.textContent = `Waktu dan Tanggal: ${formattedDate} ${now.toLocaleTimeString()}`;
    };

    const renderTasks = () => {
        todoBody.innerHTML = '';

        tasks.sort((a, b) => {
            const [dayA, monthA, yearA] = a.dueDate.split('/').map(Number);
            const [dayB, monthB, yearB] = b.dueDate.split('/').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            return dateA - dateB;
        });

        tasks.forEach((task, index) => {
            const row = document.createElement('tr');

            const taskCell = document.createElement('td');
            taskCell.textContent = task.text;
            if (task.done) {
                taskCell.classList.add('done');
            }
            row.appendChild(taskCell);

            const priorityCell = document.createElement('td');
            priorityCell.textContent = task.priority;
            row.appendChild(priorityCell);

            const dueDateCell = document.createElement('td');
            dueDateCell.textContent = task.dueDate;
            row.appendChild(dueDateCell);

            const statusCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.done;
            checkbox.addEventListener('change', () => {
                task.done = checkbox.checked;
                renderTasks();
                if (checkbox.checked) {
                    const doneItem = document.createElement('li');
                    doneItem.textContent = task.text;
                    doneTasks.appendChild(doneItem);
                } else {
                    Array.from(doneTasks.children).forEach((item) => {
                        if (item.textContent === task.text) {
                            doneTasks.removeChild(item);
                        }
                    });
                }
            });
            statusCell.appendChild(checkbox);
            row.appendChild(statusCell);

            const deleteCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Hapus';
            deleteButton.addEventListener('click', () => {
                tasks.splice(index, 1);
                renderTasks();
            });
            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);

            todoBody.appendChild(row);
        });
    };

    const addTask = () => {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;
        const dueDate = dueDateInput.value;

        if (taskText === '' || dueDate === '') {
            alert('Tugas dan tanggal harus diisi!');
            return;
        }

        tasks.push({
            text: taskText,
            priority: priority,
            dueDate: dueDate,
            done: false
        });

        renderTasks();

        taskInput.value = '';
        prioritySelect.value = 'low';
        dueDateInput.value = '';
    };

    const deleteAllTasks = () => {
        tasks = [];
        renderTasks();
        doneTasks.innerHTML = '';
    };

    addTaskButton.addEventListener('click', addTask);
    deleteAllButton.addEventListener('click', deleteAllTasks);

    setInterval(updateDateTime, 1000);
    updateDateTime();
});
