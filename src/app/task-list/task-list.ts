import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TaskManager } from '../task-manager';
import { Task } from '../task';

@Component({
  selector: 'app-task-list',
  imports: [ReactiveFormsModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {

  tasks!: Task[];

  isEditing: boolean = false;

  fb = inject(FormBuilder);

  taskmanager = inject(TaskManager);


  taskForm = this.fb.group({
    title: [''],
    description: [''],
    priority: ['Low']
  });


  editTask(task: Task){

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority
    });
    this.isEditing = true;

    
  }

  deleteTask(task: Task){
    console.log('Deleting task:', task);
    this.taskmanager.deleteTask(task.id);
    this.tasks = this.taskmanager.getTasks();
  }

  onSubmit() {
    console.log(this.taskForm.value);
    if(this.isEditing){
      this.taskmanager.editTask(this.taskForm.value as Task);
      this.isEditing = false;
      this.taskForm.reset();
    }
    else {
    this.taskmanager.addTask(this.taskForm.value as Task);
    this.tasks = this.taskmanager.getTasks();
    this.taskForm.reset();
    }
  }

}
