let _nextId = 1;

export function resetId() {
    _nextId = 1;
}

export function validateTitle(title) {
    if (typeof title !== 'string') {
        return false;
    }
    const trimmed = title.trim();
    return trimmed.length >= 3;
}

export function createTask(title) {
    return {
        id: _nextId++,
        title: title.trim(),
        completed: false,
    };
}

export function addTask(tasks, title) {
    if (!validateTitle(title)) {
        throw new Error(
        'Título inválido: deve ser uma string com pelo menos 3 caracteres.'
        );
    }

    const newTask = createTask(title);
    return [...tasks, newTask];
}

export function toggleTask(task) {
    return {
        ...task,
        completed: !task.completed,
    };
}

export function removeTask(tasks, taskId) {
    return tasks.filter((task) => task.id !== taskId);
}

export function filterTasks(tasks, status) {
    switch (status) {
        case 'completed':
        return tasks.filter((task) => task.completed === true);
        case 'pending':
        return tasks.filter((task) => task.completed === false);
        case 'all':
        default:
        return [...tasks];
    }
}

export function countTasks(tasks) {
    return tasks.length;
}

export function countCompleted(tasks) {
    return tasks.filter((task) => task.completed === true).length;
}

export function countPending(tasks) {
    return tasks.filter((task) => task.completed === false).length;
}