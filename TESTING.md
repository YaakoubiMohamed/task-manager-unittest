# Task Manager - Unit Testing Guide

This document provides a comprehensive guide to the unit tests in this Angular 20 project using **Vitest**.

## Test Configuration

| File | Purpose |
|------|---------|
| `vitest.config.ts` | Main Vitest configuration with Angular plugin |
| `src/test-setup.ts` | Angular TestBed environment initialization |
| `tsconfig.spec.json` | TypeScript configuration for test files |

## Running Tests

### All Tests

```bash
# Watch mode (re-runs on file changes)
npm test

# Single run
npm run test:run

# With coverage report
npm run test:coverage
```

### Individual Test Files

```bash
# Run only TaskManager service tests
npm run test:run -- src/app/task-manager.spec.ts

# Run only TaskList component tests
npm run test:run -- src/app/task-list/task-list.spec.ts

# Run only App component tests
npm run test:run -- src/app/app.spec.ts
```

### Individual Test Suites (describe blocks)

```bash
# Run specific describe block by name pattern
npm run test:run -- -t "TaskManager"
npm run test:run -- -t "TaskList"
npm run test:run -- -t "App"

# Run nested describe blocks
npm run test:run -- -t "TaskManager > addTask"
npm run test:run -- -t "TaskManager > deleteTask"
npm run test:run -- -t "TaskManager > editTask"
npm run test:run -- -t "TaskList > Component Initialization"
npm run test:run -- -t "TaskList > Form Behavior"
```

### Individual Test Cases

```bash
# Run a specific test by exact name
npm run test:run -- -t "should be created"
npm run test:run -- -t "should add a single task to the list"
npm run test:run -- -t "should delete an existing task by id"

# Run tests matching a pattern
npm run test:run -- -t "should.*task"
npm run test:run -- -t "priority"
```

---

## Test Files Overview

## 1. TaskManager Service Tests

**File:** `src/app/task-manager.spec.ts`  
**Tests:** 26  
**Target:** `TaskManager` injectable service

### Test Suites

#### Service Initialization (2 tests)
```bash
npm run test:run -- -t "TaskManager > Service Initialization"
```

| Test | Description |
|------|-------------|
| `should be created` | Verifies service instantiation |
| `should initialize with an empty task list` | Confirms tasks array starts empty |

#### addTask (5 tests)
```bash
npm run test:run -- -t "TaskManager > addTask"
```

| Test | Description |
|------|-------------|
| `should add a single task to the list` | Basic add functionality |
| `should add multiple tasks to the list` | Adding 3 tasks sequentially |
| `should preserve task order when adding tasks` | FIFO order verification |
| `should add task with Low priority` | Low priority handling |
| `should add task with High priority` | High priority handling |

#### getTasks (3 tests)
```bash
npm run test:run -- -t "TaskManager > getTasks"
```

| Test | Description |
|------|-------------|
| `should return empty array when no tasks exist` | Empty state handling |
| `should return all tasks after adding` | Returns complete list |
| `should return the same reference to internal tasks array` | Reference equality |

#### deleteTask (6 tests)
```bash
npm run test:run -- -t "TaskManager > deleteTask"
```

| Test | Description |
|------|-------------|
| `should delete an existing task by id` | Basic delete by ID |
| `should not affect other tasks when deleting` | Isolation verification |
| `should handle deletion of non-existent task gracefully` | Invalid ID handling |
| `should handle deletion from empty list` | Empty state handling |
| `should delete the only task, leaving empty list` | Last item deletion |
| `should delete all tasks when called for each` | Complete cleanup |

#### editTask (8 tests)
```bash
npm run test:run -- -t "TaskManager > editTask"
```

| Test | Description |
|------|-------------|
| `should update task title` | Title modification |
| `should update task description` | Description modification |
| `should update task priority` | Priority modification |
| `should update multiple properties at once` | Batch update |
| `should not modify other tasks when editing one` | Isolation check |
| `should preserve task id when editing` | ID immutability |
| `should handle editing non-existent task without error` | Invalid ID handling |
| `should handle editing in empty list` | Empty state handling |

#### Integration Scenarios (2 tests)
```bash
npm run test:run -- -t "TaskManager > Integration Scenarios"
```

| Test | Description |
|------|-------------|
| `should handle add, edit, delete workflow` | Full CRUD cycle |
| `should manage a realistic task lifecycle` | Real-world scenario |

---

## 2. TaskList Component Tests

**File:** `src/app/task-list/task-list.spec.ts`  
**Tests:** 33  
**Target:** `TaskList` standalone component

### Test Suites

#### Component Initialization (6 tests)
```bash
npm run test:run -- -t "TaskList > Component Initialization"
```

| Test | Description |
|------|-------------|
| `should create` | Component instantiation |
| `should have isEditing set to false initially` | Initial edit state |
| `should have taskForm initialized` | Form creation |
| `should have taskManager injected` | DI verification |
| `should have form controls for title, description, and priority` | Form structure |
| `should have default priority set to Low` | Default values |

#### Form Behavior (2 tests)
```bash
npm run test:run -- -t "TaskList > Form Behavior"
```

| Test | Description |
|------|-------------|
| `should update form values when user types` | Form binding |
| `should reset form after task submission` | Post-submit cleanup |

#### onSubmit - Add Mode (3 tests)
```bash
npm run test:run -- -t "TaskList > onSubmit - Add Mode"
```

| Test | Description |
|------|-------------|
| `should add task when form is submitted and not editing` | Add flow |
| `should call addTask with form values` | Correct data passing |
| `should refresh tasks list after adding` | UI update |

#### onSubmit - Edit Mode (4 tests)
```bash
npm run test:run -- -t "TaskList > onSubmit - Edit Mode"
```

| Test | Description |
|------|-------------|
| `should call editTask when isEditing is true` | Edit flow trigger |
| `should set isEditing to false after edit submission` | State reset |
| `should reset form after edit submission` | Form cleanup |
| `should not call addTask when editing` | Exclusive operation |

#### editTask (4 tests)
```bash
npm run test:run -- -t "TaskList > editTask"
```

| Test | Description |
|------|-------------|
| `should populate form with task values` | Form population |
| `should set isEditing to true` | State change |
| `should handle task with Low priority` | Priority binding |
| `should handle task with Medium priority` | Priority binding |

#### deleteTask (3 tests)
```bash
npm run test:run -- -t "TaskList > deleteTask"
```

| Test | Description |
|------|-------------|
| `should call taskManager.deleteTask with correct id` | Correct ID passing |
| `should refresh tasks list after deletion` | UI update |
| `should update tasks to empty array when last task deleted` | Empty state |

#### Template Rendering (6 tests)
```bash
npm run test:run -- -t "TaskList > Template Rendering"
```

| Test | Description |
|------|-------------|
| `should display "Add task" button when not editing` | Button text |
| `should display "Update task" button when editing` | Button text toggle |
| `should render form elements` | Form presence |
| `should render task list table` | Table structure |
| `should render tasks in the table` | Data display |
| `should render edit and delete buttons for each task` | Action buttons |

#### Form Interactions (3 tests)
```bash
npm run test:run -- -t "TaskList > Form Interactions"
```

| Test | Description |
|------|-------------|
| `should call onSubmit when form is submitted` | Submit event |
| `should call editTask when edit button is clicked` | Edit click handler |
| `should call deleteTask when delete button is clicked` | Delete click handler |

#### Integration Tests (2 tests)
```bash
npm run test:run -- -t "TaskList > Integration Tests"
```

| Test | Description |
|------|-------------|
| `should complete full add-edit-delete workflow` | Full CRUD via component |
| `should manage multiple tasks correctly` | Multi-task operations |

---

## 3. App Component Tests

**File:** `src/app/app.spec.ts`  
**Tests:** 4  
**Target:** `App` root component

### Test Suites

#### Component Initialization (2 tests)
```bash
npm run test:run -- -t "App > Component Initialization"
```

| Test | Description |
|------|-------------|
| `should create the app` | Component instantiation |
| `should have title signal with value "task-manager"` | Signal initialization |

#### Template Rendering (1 test)
```bash
npm run test:run -- -t "App > Template Rendering"
```

| Test | Description |
|------|-------------|
| `should render TaskList component` | Child component rendering |

#### Signal Behavior (1 test)
```bash
npm run test:run -- -t "App > Signal Behavior"
```

| Test | Description |
|------|-------------|
| `should maintain title signal reactivity` | Signal consistency |

---

## Useful Vitest CLI Options

```bash
# Run tests in watch mode with UI
npm test -- --ui

# Run tests with verbose output
npm run test:run -- --reporter=verbose

# Run tests and show only failures
npm run test:run -- --reporter=dot

# Run tests with specific timeout (ms)
npm run test:run -- --testTimeout=10000

# Run tests in sequence (not parallel)
npm run test:run -- --no-threads

# Update snapshots (if any)
npm run test:run -- -u

# Show test coverage in terminal
npm run test:coverage -- --reporter=text
```

## Test Patterns Summary

| Pattern | Command |
|---------|---------|
| All tests | `npm run test:run` |
| Single file | `npm run test:run -- src/app/file.spec.ts` |
| By suite name | `npm run test:run -- -t "SuiteName"` |
| By test name | `npm run test:run -- -t "test name"` |
| Nested suite | `npm run test:run -- -t "Suite > Nested"` |
| Pattern match | `npm run test:run -- -t "should.*add"` |
