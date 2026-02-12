import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';
import { TaskList } from './task-list';
import { TaskManager } from '../task-manager';
import { Task } from '../task';

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;
  let taskManager: TaskManager;

  // Helper function to create mock tasks
  const createMockTask = (overrides: Partial<Task> = {}): Task => ({
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    priority: 'Medium',
    ...overrides,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskList, ReactiveFormsModule],
      providers: [TaskManager],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
    taskManager = TestBed.inject(TaskManager);
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have isEditing set to false initially', () => {
      expect(component.isEditing).toBe(false);
    });

    it('should have taskForm initialized', () => {
      expect(component.taskForm).toBeTruthy();
    });

    it('should have taskManager injected', () => {
      expect(component.taskmanager).toBeTruthy();
    });

    it('should have form controls for title, description, and priority', () => {
      expect(component.taskForm.get('title')).toBeTruthy();
      expect(component.taskForm.get('description')).toBeTruthy();
      expect(component.taskForm.get('priority')).toBeTruthy();
    });

    it('should have default priority set to Low', () => {
      expect(component.taskForm.get('priority')?.value).toBe('Low');
    });
  });

  describe('Form Behavior', () => {
    it('should update form values when user types', () => {
      component.taskForm.patchValue({
        title: 'New Task',
        description: 'New Description',
        priority: 'High',
      });

      expect(component.taskForm.get('title')?.value).toBe('New Task');
      expect(component.taskForm.get('description')?.value).toBe('New Description');
      expect(component.taskForm.get('priority')?.value).toBe('High');
    });

    it('should reset form after task submission', () => {
      component.taskForm.patchValue({
        title: 'Task',
        description: 'Desc',
        priority: 'Medium',
      });

      component.onSubmit();

      expect(component.taskForm.get('title')?.value).toBeFalsy();
      expect(component.taskForm.get('description')?.value).toBeFalsy();
    });
  });

  describe('onSubmit - Add Mode', () => {
    it('should add task when form is submitted and not editing', () => {
      const addTaskSpy = vi.spyOn(taskManager, 'addTask');
      const getTasksSpy = vi.spyOn(taskManager, 'getTasks').mockReturnValue([]);

      component.taskForm.patchValue({
        title: 'New Task',
        description: 'Description',
        priority: 'Medium',
      });

      component.onSubmit();

      expect(addTaskSpy).toHaveBeenCalled();
      expect(getTasksSpy).toHaveBeenCalled();
    });

    it('should call addTask with form values', () => {
      const addTaskSpy = vi.spyOn(taskManager, 'addTask');
      vi.spyOn(taskManager, 'getTasks').mockReturnValue([]);

      component.taskForm.patchValue({
        title: 'My Task',
        description: 'My Description',
        priority: 'High',
      });

      component.onSubmit();

      expect(addTaskSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'My Task',
          description: 'My Description',
          priority: 'High',
        })
      );
    });

    it('should refresh tasks list after adding', () => {
      const mockTasks = [createMockTask()];
      vi.spyOn(taskManager, 'addTask');
      vi.spyOn(taskManager, 'getTasks').mockReturnValue(mockTasks);

      component.onSubmit();

      expect(component.tasks).toEqual(mockTasks);
    });
  });

  describe('onSubmit - Edit Mode', () => {
    it('should call editTask when isEditing is true', () => {
      const editTaskSpy = vi.spyOn(taskManager, 'editTask');
      component.isEditing = true;

      component.taskForm.patchValue({
        title: 'Updated Task',
        description: 'Updated Description',
        priority: 'Low',
      });

      component.onSubmit();

      expect(editTaskSpy).toHaveBeenCalled();
    });

    it('should set isEditing to false after edit submission', () => {
      vi.spyOn(taskManager, 'editTask');
      component.isEditing = true;

      component.onSubmit();

      expect(component.isEditing).toBe(false);
    });

    it('should reset form after edit submission', () => {
      vi.spyOn(taskManager, 'editTask');
      component.isEditing = true;

      component.taskForm.patchValue({
        title: 'Task',
        description: 'Desc',
      });

      component.onSubmit();

      expect(component.taskForm.get('title')?.value).toBeFalsy();
    });

    it('should not call addTask when editing', () => {
      const addTaskSpy = vi.spyOn(taskManager, 'addTask');
      vi.spyOn(taskManager, 'editTask');
      component.isEditing = true;

      component.onSubmit();

      expect(addTaskSpy).not.toHaveBeenCalled();
    });
  });

  describe('editTask', () => {
    it('should populate form with task values', () => {
      const task = createMockTask({
        title: 'Edit Me',
        description: 'Edit Description',
        priority: 'High',
      });

      component.editTask(task);

      expect(component.taskForm.get('title')?.value).toBe('Edit Me');
      expect(component.taskForm.get('description')?.value).toBe('Edit Description');
      expect(component.taskForm.get('priority')?.value).toBe('High');
    });

    it('should set isEditing to true', () => {
      const task = createMockTask();

      component.editTask(task);

      expect(component.isEditing).toBe(true);
    });

    it('should handle task with Low priority', () => {
      const task = createMockTask({ priority: 'Low' });

      component.editTask(task);

      expect(component.taskForm.get('priority')?.value).toBe('Low');
    });

    it('should handle task with Medium priority', () => {
      const task = createMockTask({ priority: 'Medium' });

      component.editTask(task);

      expect(component.taskForm.get('priority')?.value).toBe('Medium');
    });
  });

  describe('deleteTask', () => {
    it('should call taskManager.deleteTask with correct id', () => {
      const deleteTaskSpy = vi.spyOn(taskManager, 'deleteTask');
      vi.spyOn(taskManager, 'getTasks').mockReturnValue([]);

      const task = createMockTask({ id: 42 });
      component.deleteTask(task);

      expect(deleteTaskSpy).toHaveBeenCalledWith(42);
    });

    it('should refresh tasks list after deletion', () => {
      const remainingTasks = [createMockTask({ id: 2 })];
      vi.spyOn(taskManager, 'deleteTask');
      vi.spyOn(taskManager, 'getTasks').mockReturnValue(remainingTasks);

      component.deleteTask(createMockTask({ id: 1 }));

      expect(component.tasks).toEqual(remainingTasks);
    });

    it('should update tasks to empty array when last task deleted', () => {
      vi.spyOn(taskManager, 'deleteTask');
      vi.spyOn(taskManager, 'getTasks').mockReturnValue([]);

      component.deleteTask(createMockTask({ id: 1 }));

      expect(component.tasks).toEqual([]);
    });
  });

  describe('Template Rendering', () => {
    it('should display "Add task" button when not editing', async () => {
      component.isEditing = false;
      await fixture.whenStable();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[type="submit"]');

      expect(button?.textContent).toContain('Add');
    });

    it('should display "Update task" button when editing', async () => {
      component.isEditing = true;
      await fixture.whenStable();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const button = compiled.querySelector('button[type="submit"]');

      expect(button?.textContent).toContain('Update');
    });

    it('should render form elements', async () => {
      await fixture.whenStable();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('input[formControlName="title"]')).toBeTruthy();
      expect(compiled.querySelector('textarea[formControlName="description"]')).toBeTruthy();
      expect(compiled.querySelector('select[formControlName="priority"]')).toBeTruthy();
    });

    it('should render task list table', async () => {
      await fixture.whenStable();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('table')).toBeTruthy();
      expect(compiled.querySelector('thead')).toBeTruthy();
      expect(compiled.querySelector('tbody')).toBeTruthy();
    });

    it('should render tasks in the table', async () => {
      component.tasks = [
        createMockTask({ id: 1, title: 'Task 1', description: 'Desc 1', priority: 'Low' }),
        createMockTask({ id: 2, title: 'Task 2', description: 'Desc 2', priority: 'High' }),
      ];
      await fixture.whenStable();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const rows = compiled.querySelectorAll('tbody tr');

      expect(rows.length).toBe(2);
    });

    it('should render edit and delete buttons for each task', async () => {
      component.tasks = [createMockTask()];
      await fixture.whenStable();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('tbody button');

      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent).toContain('Edit');
      expect(buttons[1].textContent).toContain('Delete');
    });
  });

  describe('Form Interactions', () => {
    it('should call onSubmit when form is submitted', async () => {
      const onSubmitSpy = vi.spyOn(component, 'onSubmit');
      fixture.detectChanges();

      const form = fixture.nativeElement.querySelector('form');
      form.dispatchEvent(new Event('submit'));
      await fixture.whenStable();

      expect(onSubmitSpy).toHaveBeenCalled();
    });

    it('should call editTask when edit button is clicked', async () => {
      const task = createMockTask({ id: 1, title: 'Test' });
      component.tasks = [task];
      const editTaskSpy = vi.spyOn(component, 'editTask');

      await fixture.whenStable();
      fixture.detectChanges();

      const editButton = fixture.nativeElement.querySelector('tbody button:first-child');
      editButton?.click();
      await fixture.whenStable();

      expect(editTaskSpy).toHaveBeenCalledWith(task);
    });

    it('should call deleteTask when delete button is clicked', async () => {
      const task = createMockTask({ id: 1, title: 'Test' });
      component.tasks = [task];
      const deleteTaskSpy = vi.spyOn(component, 'deleteTask');

      await fixture.whenStable();
      fixture.detectChanges();

      const deleteButton = fixture.nativeElement.querySelector('tbody button:last-child');
      deleteButton?.click();
      await fixture.whenStable();

      expect(deleteTaskSpy).toHaveBeenCalledWith(task);
    });
  });

  describe('Integration Tests', () => {
    it('should complete full add-edit-delete workflow', () => {
      // Add a task
      component.taskForm.patchValue({
        title: 'New Task',
        description: 'Task Description',
        priority: 'Medium',
      });
      component.onSubmit();
      expect(component.tasks.length).toBe(1);

      // Edit the task
      component.editTask(component.tasks[0]);
      expect(component.isEditing).toBe(true);
      expect(component.taskForm.get('title')?.value).toBe('New Task');

      component.taskForm.patchValue({ title: 'Updated Task' });
      component.onSubmit();
      expect(component.isEditing).toBe(false);

      // Delete the task
      component.deleteTask(component.tasks[0]);
      expect(component.tasks.length).toBe(0);
    });

    it('should manage multiple tasks correctly', () => {
      // Manually add tasks with IDs to the taskManager
      const task1 = createMockTask({ id: 1, title: 'Task 1' });
      const task2 = createMockTask({ id: 2, title: 'Task 2' });
      const task3 = createMockTask({ id: 3, title: 'Task 3' });

      taskManager.addTask(task1);
      taskManager.addTask(task2);
      taskManager.addTask(task3);
      component.tasks = taskManager.getTasks();

      expect(component.tasks.length).toBe(3);

      // Delete first task
      const firstTask = component.tasks[0];
      component.deleteTask(firstTask);

      expect(component.tasks.length).toBe(2);
      expect(component.tasks.some(t => t.id === 1)).toBe(false);
      expect(component.tasks.some(t => t.id === 2)).toBe(true);
      expect(component.tasks.some(t => t.id === 3)).toBe(true);
    });
  });
});
