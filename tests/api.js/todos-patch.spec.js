import { test, expect } from '../fixtures/api-client';

test.describe('TODO API - PATCH запросы @todos @patch', () => {
  let createdTodoId;
  let originalTodo;

  test.beforeEach(async ({ todoController, todoBuilder }) => {
    const todoData = todoBuilder
      .withTitle('Original TODO')
      .withDescription('Original desc')
      .build();
    const result = await todoController.createTodo(todoData);
    originalTodo = result.data;
    createdTodoId = originalTodo.id;
  });

  test('PATCH /todos/:id - частичное обновление title @smoke', async ({ todoController }) => {
    const patchData = { title: 'Patched Title' };
    const result = await todoController.patchTodo(createdTodoId, patchData);

    expect(result.status).toBe(200);
    expect(result.data.id).toBe(createdTodoId);
    expect(result.data.title).toBe(patchData.title);
    expect(result.data.doneStatus).toBe(originalTodo.doneStatus);
    expect(result.data.description).toBe(originalTodo.description);
  });

  test('PATCH /todos/:id - частичное обновление doneStatus @status', async ({ todoController }) => {
    const patchData = { doneStatus: true };
    const result = await todoController.patchTodo(createdTodoId, patchData);

    expect(result.status).toBe(200);
    expect(result.data.doneStatus).toBe(true);
    expect(result.data.title).toBe(originalTodo.title);
    expect(result.data.description).toBe(originalTodo.description);
  });

  test('PATCH /todos/:id - частичное обновление description @description', async ({
    todoController,
  }) => {
    const patchData = { description: 'Patched description' };
    const result = await todoController.patchTodo(createdTodoId, patchData);

    expect(result.status).toBe(200);
    expect(result.data.description).toBe(patchData.description);
    expect(result.data.title).toBe(originalTodo.title);
    expect(result.data.doneStatus).toBe(originalTodo.doneStatus);
  });

  test('PATCH /todos/:id - обновление нескольких полей @multiple', async ({ todoController }) => {
    const patchData = {
      title: 'Multi-patch Title',
      description: 'Multi-patch description',
    };

    const result = await todoController.patchTodo(createdTodoId, patchData);

    expect(result.status).toBe(200);
    expect(result.data.title).toBe(patchData.title);
    expect(result.data.description).toBe(patchData.description);
    expect(result.data.doneStatus).toBe(originalTodo.doneStatus);
  });

  test('PATCH /todos/:id - попытка обновить несуществующий TODO @negative', async ({
    todoController,
  }) => {
    const result = await todoController.patchTodo(99999, { title: 'Patched' });

    expect(result.status).toBe(404);
    todoController.validateErrorResponse(result.data);
    expect(result.data.errorMessages[0]).toContain('No such todo entity instance');
  });
});
