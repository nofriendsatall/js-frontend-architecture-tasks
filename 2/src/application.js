import axios from 'axios';

const routes = {
  tasksPath: () => '/api/tasks',
};

// BEGIN


const app = async () => {
    const tasksList = document.querySelector('#tasks');
    const form = document.querySelector('form');
    const input = form.querySelector('input[name="name"]');

    const createTaskElement = (name) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = name;
        return li;
    };

    const renderTasks = (tasks) => {
        tasksList.innerHTML = '';
        tasks.forEach(task => tasksList.prepend(createTaskElement(task.name)));
    };

    const loadTasks = async () => {
        try {
            const { data } = await axios.get(routes.tasksPath());
            renderTasks(data.items);
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const taskName = input.value.trim();
        
        if (!taskName) {
            input.focus();
            return;
        }

        try {
            const { status } = await axios.post(routes.tasksPath(), { name: taskName });
            if (status === 201) {
                input.value = '';
                input.focus();
                await loadTasks();
            }
        } catch (error) {
            console.error('Failed to add task:', error);
            input.select();
        }
    };

    await loadTasks();
    form.addEventListener('submit', handleSubmit);
};

export default app;
// END