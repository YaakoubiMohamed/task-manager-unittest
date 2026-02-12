import { TestBed } from '@angular/core/testing';
import { TaskManager } from './task-manager';
import { Task } from './task';

describe('TaskManager', () => {
  let service: TaskManager;

  // Helper function to create mock tasks
  const createMockTask = (overrides: Partial<Task> = {}): Task => ({
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    priority: 'Medium',
    ...overrides,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskManager],
    });
    service = TestBed.inject(TaskManager);
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with an empty task list', () => {
      expect(service.getTasks()).toEqual([]);
      expect(service.getTasks().length).toBe(0);
    });
  });

  describe('addTask', () => {
    it('should add a single task to the list', () => {
      const task = createMockTask();

      service.addTask(task);

      expect(service.getTasks().length).toBe(1);
      expect(service.getTasks()[0]).toEqual(task);
    });

    it('should add multiple tasks to the list', () => {
      const task1 = createMockTask({ id: 1, title: 'Task 1' });
      const task2 = createMockTask({ id: 2, title: 'Task 2' });
      const task3 = createMockTask({ id: 3, title: 'Task 3' });

      service.addTask(task1);
      service.addTask(task2);
      service.addTask(task3);

      expect(service.getTasks().length).toBe(3);
      expect(service.getTasks()).toContain(task1);
      expect(service.getTasks()).toContain(task2);
      expect(service.getTasks()).toContain(task3);
    });

    it('should preserve task order when adding tasks', () => {
      const task1 = createMockTask({ id: 1, title: 'First' });
      const task2 = createMockTask({ id: 2, title: 'Second' });

      service.addTask(task1);
      service.addTask(task2);

      expect(service.getTasks()[0].title).toBe('First');
      expect(service.getTasks()[1].title).toBe('Second');
    });

    it('should add task with Low priority', () => {
      const task = createMockTask({ priority: 'Low' });

      service.addTask(task);

      expect(service.getTasks()[0].priority).toBe('Low');
    });

    it('should add task with High priority', () => {
      const task = createMockTask({ priority: 'High' });

      service.addTask(task);

      expect(service.getTasks()[0].priority).toBe('High');
    });
  });

  describe('getTasks', () => {
    it('should return empty array when no tasks exist', () => {
      const tasks = service.getTasks();

      expect(tasks).toEqual([]);
      expect(Array.isArray(tasks)).toBe(true);
    });

    it('should return all tasks after adding', () => {
      const task1 = createMockTask({ id: 1 });
      const task2 = createMockTask({ id: 2 });

      service.addTask(task1);
      service.addTask(task2);

      const tasks = service.getTasks();

      expect(tasks.length).toBe(2);
      expect(tasks).toContain(task1);
      expect(tasks).toContain(task2);
    });

    it('should return the same reference to internal tasks array', () => {
      const task = createMockTask();
      service.addTask(task);

      const tasks1 = service.getTasks();
      const tasks2 = service.getTasks();

      expect(tasks1).toBe(tasks2);
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task by id', () => {
      const task1 = createMockTask({ id: 1 });
      const task2 = createMockTask({ id: 2 });

      service.addTask(task1);
      service.addTask(task2);
      service.deleteTask(1);

      expect(service.getTasks().length).toBe(1);
      expect(service.getTasks()[0].id).toBe(2);
    });

    it('should not affect other tasks when deleting', () => {
      const task1 = createMockTask({ id: 1, title: 'Task 1' });
      const task2 = createMockTask({ id: 2, title: 'Task 2' });
      const task3 = createMockTask({ id: 3, title: 'Task 3' });

      service.addTask(task1);
      service.addTask(task2);
      service.addTask(task3);
      service.deleteTask(2);

      const remainingTasks = service.getTasks();
      expect(remainingTasks.length).toBe(2);
      expect(remainingTasks.some(t => t.id === 1)).toBe(true);
      expect(remainingTasks.some(t => t.id === 3)).toBe(true);
      expect(remainingTasks.some(t => t.id === 2)).toBe(false);
    });

    it('should handle deletion of non-existent task gracefully', () => {
      const task = createMockTask({ id: 1 });
      service.addTask(task);

      service.deleteTask(999);

      expect(service.getTasks().length).toBe(1);
      expect(service.getTasks()[0]).toEqual(task);
    });

    it('should handle deletion from empty list', () => {
      service.deleteTask(1);

      expect(service.getTasks().length).toBe(0);
    });

    it('should delete the only task, leaving empty list', () => {
      const task = createMockTask({ id: 1 });
      service.addTask(task);

      service.deleteTask(1);

      expect(service.getTasks().length).toBe(0);
      expect(service.getTasks()).toEqual([]);
    });

    it('should delete all tasks when called for each', () => {
      const tasks = [
        createMockTask({ id: 1 }),
        createMockTask({ id: 2 }),
        createMockTask({ id: 3 }),
      ];
      tasks.forEach(t => service.addTask(t));

      service.deleteTask(1);
      service.deleteTask(2);
      service.deleteTask(3);

      expect(service.getTasks()).toEqual([]);
    });
  });

  describe('editTask', () => {
    it('should update task title', () => {
      const task = createMockTask({ id: 1, title: 'Original Title' });
      service.addTask(task);

      const updatedTask = { ...task, title: 'Updated Title' };
      service.editTask(updatedTask);

      expect(service.getTasks()[0].title).toBe('Updated Title');
    });

    it('should update task description', () => {
      const task = createMockTask({ id: 1, description: 'Original' });
      service.addTask(task);

      const updatedTask = { ...task, description: 'Updated Description' };
      service.editTask(updatedTask);

      expect(service.getTasks()[0].description).toBe('Updated Description');
    });

    it('should update task priority', () => {
      const task = createMockTask({ id: 1, priority: 'Low' });
      service.addTask(task);

      const updatedTask: Task = { ...task, priority: 'High' };
      service.editTask(updatedTask);

      expect(service.getTasks()[0].priority).toBe('High');
    });

    it('should update multiple properties at once', () => {
      const task = createMockTask({
        id: 1,
        title: 'Original',
        description: 'Original Desc',
        priority: 'Low',
      });
      service.addTask(task);

      const updatedTask: Task = {
        id: 1,
        title: 'New Title',
        description: 'New Description',
        priority: 'High',
      };
      service.editTask(updatedTask);

      const result = service.getTasks()[0];
      expect(result.title).toBe('New Title');
      expect(result.description).toBe('New Description');
      expect(result.priority).toBe('High');
    });

    it('should not modify other tasks when editing one', () => {
      const task1 = createMockTask({ id: 1, title: 'Task 1' });
      const task2 = createMockTask({ id: 2, title: 'Task 2' });
      service.addTask(task1);
      service.addTask(task2);

      const updatedTask = { ...task1, title: 'Updated Task 1' };
      service.editTask(updatedTask);

      expect(service.getTasks()[1].title).toBe('Task 2');
    });

    it('should preserve task id when editing', () => {
      const task = createMockTask({ id: 42 });
      service.addTask(task);

      const updatedTask = { ...task, title: 'New Title' };
      service.editTask(updatedTask);

      expect(service.getTasks()[0].id).toBe(42);
    });

    it('should handle editing non-existent task without error', () => {
      const task = createMockTask({ id: 1 });
      service.addTask(task);

      const nonExistentTask = createMockTask({ id: 999, title: 'Ghost Task' });
      service.editTask(nonExistentTask);

      // Original task should remain unchanged
      expect(service.getTasks().length).toBe(1);
      expect(service.getTasks()[0].id).toBe(1);
    });

    it('should handle editing in empty list', () => {
      const task = createMockTask({ id: 1 });

      // Should not throw error
      expect(() => service.editTask(task)).not.toThrow();
      expect(service.getTasks().length).toBe(0);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle add, edit, delete workflow', () => {
      // Add tasks
      const task1 = createMockTask({ id: 1, title: 'Task 1' });
      const task2 = createMockTask({ id: 2, title: 'Task 2' });
      service.addTask(task1);
      service.addTask(task2);
      expect(service.getTasks().length).toBe(2);

      // Edit task
      service.editTask({ ...task1, title: 'Updated Task 1' });
      expect(service.getTasks()[0].title).toBe('Updated Task 1');

      // Delete task
      service.deleteTask(1);
      expect(service.getTasks().length).toBe(1);
      expect(service.getTasks()[0].id).toBe(2);
    });

    it('should manage a realistic task lifecycle', () => {
      // Create initial tasks
      const tasks: Task[] = [
        { id: 1, title: 'Setup project', description: 'Initialize Angular', priority: 'High' },
        { id: 2, title: 'Write tests', description: 'Add unit tests', priority: 'Medium' },
        { id: 3, title: 'Deploy', description: 'Deploy to production', priority: 'Low' },
      ];

      tasks.forEach(t => service.addTask(t));
      expect(service.getTasks().length).toBe(3);

      // Complete high priority task (delete it)
      service.deleteTask(1);
      expect(service.getTasks().length).toBe(2);

      // Escalate deploy priority
      service.editTask({ ...tasks[2], priority: 'High' });
      const deployTask = service.getTasks().find(t => t.id === 3);
      expect(deployTask?.priority).toBe('High');

      // Add new urgent task
      const urgentTask: Task = {
        id: 4,
        title: 'Hotfix',
        description: 'Critical bug fix',
        priority: 'High',
      };
      service.addTask(urgentTask);
      expect(service.getTasks().length).toBe(3);
    });
  });
});
