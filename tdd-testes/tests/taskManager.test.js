import { describe, it, expect, beforeEach } from 'vitest';
import {
    validateTitle,
    createTask,
    addTask,
    toggleTask,
    removeTask,
    filterTasks,
    countTasks,
    countCompleted,
    countPending,
    validatePriority,
    filterByPriority,
    isDuplicate,
    sortTasks,
    searchTasks,
    resetId,
} from '../src/taskManager.js';

describe('validateTitle', () => {
    it('deve retornar true para um título válido', () => {
        expect(validateTitle('Estudar Vitest')).toBe(true);
    });

    it('deve retornar true para título com exatamente 3 caracteres', () => {
        expect(validateTitle('abc')).toBe(true);
    });

    it('deve retornar false para string vazia', () => {
        expect(validateTitle('')).toBe(false);
    });

    it('deve retornar false para string com apenas espaços', () => {
        expect(validateTitle('   ')).toBe(false);
    });

    it('deve retornar false para título com menos de 3 caracteres', () => {
        expect(validateTitle('ab')).toBe(false);
    });

    it('deve retornar false para null', () => {
        expect(validateTitle(null)).toBe(false);
    });

    it('deve retornar false para undefined', () => {
        expect(validateTitle(undefined)).toBe(false);
    });

    it('deve retornar false para número', () => {
        expect(validateTitle(123)).toBe(false);
    });

    it('deve retornar false para booleano', () => {
        expect(validateTitle(true)).toBe(false);
    });

    it('deve retornar false para array', () => {
        expect(validateTitle(['tarefa'])).toBe(false);
    });

    it('deve considerar o título após trim', () => {
        expect(validateTitle('  abc  ')).toBe(true);
    });
});

describe('createTask', () => {
    beforeEach(() => {
        resetId();
    });

    it('deve criar uma tarefa com as propriedades corretas', () => {
        const task = createTask('Estudar TDD');

        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('title', 'Estudar TDD');
        expect(task).toHaveProperty('completed', false);
    });

    it('deve atribuir IDs incrementais', () => {
        const task1 = createTask('Tarefa 1');
        const task2 = createTask('Tarefa 2');

        expect(task2.id).toBe(task1.id + 1);
    });

    it('deve iniciar com completed = false', () => {
        const task = createTask('Nova tarefa');

        expect(task.completed).toBe(false);
    });

    it('deve fazer trim do título', () => {
        const task = createTask('  Título com espaços  ');

        expect(task.title).toBe('Título com espaços');
    });
});

describe('addTask', () => {
    beforeEach(() => {
        resetId();
    });

    it('deve adicionar uma tarefa a uma lista vazia', () => {
        const tasks = addTask([], 'Primeira tarefa');

        expect(tasks).toHaveLength(1);
        expect(tasks[0].title).toBe('Primeira tarefa');
    });

    it('deve adicionar uma tarefa a uma lista existente', () => {
        let tasks = addTask([], 'Tarefa 1');
        tasks = addTask(tasks, 'Tarefa 2');

        expect(tasks).toHaveLength(2);
        expect(tasks[1].title).toBe('Tarefa 2');
    });

    it('deve retornar um NOVO array (imutabilidade)', () => {
        const original = [];
        const updated = addTask(original, 'Nova tarefa');

        expect(updated).not.toBe(original);
        expect(original).toHaveLength(0);
    });

    it('deve lançar erro para título vazio', () => {
        expect(() => addTask([], '')).toThrow('Título inválido');
    });

    it('deve lançar erro para título null', () => {
        expect(() => addTask([], null)).toThrow('Título inválido');
    });

    it('deve lançar erro para título undefined', () => {
        expect(() => addTask([], undefined)).toThrow('Título inválido');
    });

    it('deve lançar erro para título com menos de 3 caracteres', () => {
        expect(() => addTask([], 'ab')).toThrow('Título inválido');
    });

    it('deve lançar erro para título numérico', () => {
        expect(() => addTask([], 42)).toThrow('Título inválido');
    });
});

describe('toggleTask', () => {
    beforeEach(() => {
        resetId();
    });

    it('deve marcar uma tarefa pendente como concluída', () => {
        const task = createTask('Tarefa pendente');
        const toggled = toggleTask(task);

        expect(toggled.completed).toBe(true);
    });

    it('deve desmarcar uma tarefa concluída', () => {
        const task = createTask('Tarefa pendente');
        const completed = toggleTask(task);
        const uncompleted = toggleTask(completed);

        expect(uncompleted.completed).toBe(false);
    });

    it('deve manter o id e o título inalterados', () => {
        const task = createTask('Minha tarefa');
        const toggled = toggleTask(task);

        expect(toggled.id).toBe(task.id);
        expect(toggled.title).toBe(task.title);
    });

    it('deve retornar um NOVO objeto (imutabilidade)', () => {
        const task = createTask('Tarefa original');
        const toggled = toggleTask(task);

        expect(toggled).not.toBe(task);
        expect(task.completed).toBe(false);
    });
});

describe('removeTask', () => {
    let tasks;

    beforeEach(() => {
        resetId();
        tasks = addTask([], 'Tarefa 1');
        tasks = addTask(tasks, 'Tarefa 2');
        tasks = addTask(tasks, 'Tarefa 3');
    });

    it('deve remover uma tarefa pelo ID', () => {
        const updated = removeTask(tasks, 2);

        expect(updated).toHaveLength(2);
        expect(updated.find((t) => t.id === 2)).toBeUndefined();
    });

    it('deve manter as outras tarefas intactas', () => {
        const updated = removeTask(tasks, 2);

        expect(updated[0].title).toBe('Tarefa 1');
        expect(updated[1].title).toBe('Tarefa 3');
    });

    it('deve retornar um NOVO array (imutabilidade)', () => {
        const updated = removeTask(tasks, 1);

        expect(updated).not.toBe(tasks);
        expect(tasks).toHaveLength(3);
    });

    it('deve retornar a lista completa se o ID não existir', () => {
        const updated = removeTask(tasks, 999);

        expect(updated).toHaveLength(3);
    });

    it('deve retornar array vazio ao remover de lista vazia', () => {
        const updated = removeTask([], 1);

        expect(updated).toHaveLength(0);
    });
});

describe('filterTasks', () => {
    let tasks;

    beforeEach(() => {
        resetId();
        tasks = addTask([], 'Tarefa 1');
        tasks = addTask(tasks, 'Tarefa 2');
        tasks = addTask(tasks, 'Tarefa 3');
        tasks = tasks.map((t) => (t.id === 2 ? toggleTask(t) : t));
    });

    it('deve retornar todas as tarefas com filtro "all"', () => {
        const result = filterTasks(tasks, 'all');

        expect(result).toHaveLength(3);
    });

    it('deve retornar apenas pendentes com filtro "pending"', () => {
        const result = filterTasks(tasks, 'pending');

        expect(result).toHaveLength(2);
        result.forEach((t) => expect(t.completed).toBe(false));
    });

    it('deve retornar apenas concluídas com filtro "completed"', () => {
        const result = filterTasks(tasks, 'completed');

        expect(result).toHaveLength(1);
        expect(result[0].title).toBe('Tarefa 2');
        expect(result[0].completed).toBe(true);
    });

    it('deve retornar todas as tarefas para filtro desconhecido (default)', () => {
        const result = filterTasks(tasks, 'invalido');

        expect(result).toHaveLength(3);
    });

    it('deve retornar array vazio para lista vazia', () => {
        expect(filterTasks([], 'all')).toHaveLength(0);
        expect(filterTasks([], 'pending')).toHaveLength(0);
        expect(filterTasks([], 'completed')).toHaveLength(0);
    });

    it('deve retornar um NOVO array (imutabilidade)', () => {
        const result = filterTasks(tasks, 'all');

        expect(result).not.toBe(tasks);
    });
});

describe('countTasks', () => {
    it('deve retornar 0 para lista vazia', () => {
        expect(countTasks([])).toBe(0);
    });

    it('deve retornar o total de tarefas', () => {
        resetId();
        let tasks = addTask([], 'Tarefa 1');
        tasks = addTask(tasks, 'Tarefa 2');
        tasks = addTask(tasks, 'Tarefa 3');

        expect(countTasks(tasks)).toBe(3);
    });
});

describe('countCompleted', () => {
    let tasks;

    beforeEach(() => {
        resetId();
        tasks = addTask([], 'Tarefa 1');
        tasks = addTask(tasks, 'Tarefa 2');
        tasks = addTask(tasks, 'Tarefa 3');
        tasks = tasks.map((t) => (t.id <= 2 ? toggleTask(t) : t));
    });

    it('deve retornar 0 para lista vazia', () => {
        expect(countCompleted([])).toBe(0);
    });

    it('deve contar corretamente as tarefas concluídas', () => {
        expect(countCompleted(tasks)).toBe(2);
    });

    it('deve retornar 0 quando nenhuma tarefa está concluída', () => {
        resetId();
        let noCompleted = addTask([], 'Tarefa A');
        noCompleted = addTask(noCompleted, 'Tarefa B');

        expect(countCompleted(noCompleted)).toBe(0);
    });
});

describe('countPending', () => {
    let tasks;

    beforeEach(() => {
        resetId();
        tasks = addTask([], 'Tarefa 1');
        tasks = addTask(tasks, 'Tarefa 2');
        tasks = addTask(tasks, 'Tarefa 3');
        tasks = tasks.map((t) => (t.id === 1 ? toggleTask(t) : t));
    });

    it('deve retornar 0 para lista vazia', () => {
        expect(countPending([])).toBe(0);
    });

    it('deve contar corretamente as tarefas pendentes', () => {
        expect(countPending(tasks)).toBe(2);
    });

    it('deve retornar 0 quando todas as tarefas estão concluídas', () => {
        const allCompleted = tasks.map((t) => ({ ...t, completed: true }));

        expect(countPending(allCompleted)).toBe(0);
    });
});

describe('validatePriority', () => {
    it('deve retornar true para prioridades válidas', () => {
        expect(validatePriority('low')).toBe(true);
        expect(validatePriority('medium')).toBe(true);
        expect(validatePriority('high')).toBe(true);
    });

    it('deve retornar false para prioridades inválidas', () => {
        expect(validatePriority('urgente')).toBe(false);
        expect(validatePriority('')).toBe(false);
        expect(validatePriority(null)).toBe(false);
    });
});

describe('createTask com Prioridade', () => {
    beforeEach(() => {
        resetId();
    });

    it('deve criar tarefa com prioridade explicitada', () => {
        const task = createTask('Estudar Vitest', 'high');
        expect(task).toHaveProperty('priority', 'high');
    });

    it('deve adotar prioridade "medium" como padrão', () => {
        const task = createTask('Comprar café');
        expect(task).toHaveProperty('priority', 'medium');
    });
});

describe('filterByPriority', () => {
    let tasks;

    beforeEach(() => {
        resetId();
        tasks = [];
        tasks.push({ id: 1, title: 'T1', completed: false, priority: 'high' });
        tasks.push({ id: 2, title: 'T2', completed: false, priority: 'low' });
        tasks.push({ id: 3, title: 'T3', completed: false, priority: 'high' });
    });

    it('deve filtrar corretamente por prioridade', () => {
        const highPriority = filterByPriority(tasks, 'high');
        expect(highPriority).toHaveLength(2);
        expect(highPriority[0].id).toBe(1);
        expect(highPriority[1].id).toBe(3);
    });

    it('deve retornar um array vazio se não houver correspondência', () => {
        const mediumPriority = filterByPriority(tasks, 'medium');
        expect(mediumPriority).toHaveLength(0);
    });

    it('deve retornar um NOVO array (imutabilidade)', () => {
        const result = filterByPriority(tasks, 'high');
        expect(result).not.toBe(tasks);
    });
});

describe('isDuplicate', () => {
    let tasks;

    beforeEach(() => {
        resetId();
        tasks = [
        { id: 1, title: 'Estudar Vitest', completed: false, priority: 'medium' }
        ];
    });

    it('deve retornar true se o título for idêntico', () => {
        expect(isDuplicate(tasks, 'Estudar Vitest')).toBe(true);
    });

    it('deve retornar true ignorando maiúsculas e minúsculas (case-insensitive)', () => {
        expect(isDuplicate(tasks, 'estudar vitest')).toBe(true);
        expect(isDuplicate(tasks, 'ESTUDAR VITEST')).toBe(true);
    });

    it('deve retornar true ignorando espaços extras nas pontas', () => {
        expect(isDuplicate(tasks, '  Estudar Vitest  ')).toBe(true);
    });

    it('deve retornar false se o título não existir na lista', () => {
        expect(isDuplicate(tasks, 'Fazer café')).toBe(false);
    });
    });

    describe('addTask com validação de duplicata', () => {
    it('deve lançar erro ao tentar adicionar tarefa com título duplicado', () => {
        const tasks = addTask([], 'Estudar TDD');

        expect(() => addTask(tasks, 'Estudar TDD')).toThrow('Título duplicado');
        expect(() => addTask(tasks, '  estudar tdd  ')).toThrow('Título duplicado');
    });
});

describe('sortTasks', () => {
    let tasks;

    beforeEach(() => {
        resetId();
        tasks = [
        { id: 1, title: 'T1', completed: true, priority: 'medium' },
        { id: 2, title: 'T2', completed: false, priority: 'medium' },
        { id: 3, title: 'T3', completed: true, priority: 'medium' },
        { id: 4, title: 'T4', completed: false, priority: 'medium' },
        ];
    });

    it('deve ordenar trazendo as tarefas pendentes primeiro', () => {
        const sorted = sortTasks(tasks);

        expect(sorted).toHaveLength(4);
        expect(sorted[0].id).toBe(2); 
        expect(sorted[1].id).toBe(4); 
        expect(sorted[2].id).toBe(1); 
        expect(sorted[3].id).toBe(3); 
    });

    it('deve retornar um array vazio se receber uma lista vazia', () => {
        expect(sortTasks([])).toHaveLength(0);
    });

    it('deve retornar um NOVO array (imutabilidade)', () => {
        const sorted = sortTasks(tasks);
        expect(sorted).not.toBe(tasks);
        expect(tasks[0].id).toBe(1);
    });
});

describe('searchTasks', () => {
    let tasks;

    beforeEach(() => {
        resetId();
        tasks = [
        { id: 1, title: 'Estudar Vitest', completed: false, priority: 'medium' },
        { id: 2, title: 'Testar aplicação', completed: false, priority: 'medium' },
        { id: 3, title: 'Fazer café', completed: false, priority: 'medium' },
        ];
    });

    it('deve encontrar tarefas que contenham o termo buscado', () => {
        const result = searchTasks(tasks, 'est');
        expect(result).toHaveLength(2);
        expect(result[0].id).toBe(1);
        expect(result[1].id).toBe(2);
    });

    it('deve funcionar independente de maiúsculas/minúsculas (case-insensitive)', () => {
        const result = searchTasks(tasks, 'EST');
        expect(result).toHaveLength(2);
    });

    it('deve retornar todas as tarefas se a busca for uma string vazia', () => {
        const result = searchTasks(tasks, '');
        expect(result).toHaveLength(3);
    });

    it('deve retornar array vazio se não encontrar nenhuma correspondência', () => {
        const result = searchTasks(tasks, 'xyz');
        expect(result).toHaveLength(0);
    });

    it('deve retornar array vazio se buscar em uma lista vazia', () => {
        const result = searchTasks([], 'est');
        expect(result).toHaveLength(0);
    });

    it('deve retornar um NOVO array (imutabilidade)', () => {
        const result = searchTasks(tasks, 'café');
        expect(result).not.toBe(tasks);
    });
});