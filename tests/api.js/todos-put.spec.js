import { test, expect } from '../fixtures/api-client';

test.describe('TODO API - PUT запросы @todos @put', () => {
  let createdTodoId;

  test.beforeEach(async ({ todoController, todoBuilder }) => {
    const todoData = todoBuilder
      .withTitle('Original TODO')
      .withDescription('Original desc')
      .build();
    const result = await todoController.createTodo(todoData);
    createdTodoId = result.data.id;
  });

  test('PUT /todos/:id - полное обновление TODO @smoke', async ({ todoController }) => {
    const updatedData = {
      title: 'Updated Title',
      doneStatus: true,
      description: 'Updated description',
    };

    const result = await todoController.updateTodo(createdTodoId, updatedData);

    expect(result.status).toBe(200);
    expect(result.data.id).toBe(createdTodoId);
    todoController.validateTodoCreated(result.data, updatedData);
  });

  test('PUT /todos/:id - обновление только обязательных полей @minimal', async ({
    todoController,
  }) => {
    const updatedData = {
      title: 'New Title Only',
      doneStatus: true,
    };

    const result = await todoController.updateTodo(createdTodoId, updatedData);

    expect(result.status).toBe(200);
    expect(result.data.title).toBe(updatedData.title);
    expect(result.data.doneStatus).toBe(updatedData.doneStatus);
    expect(result.data.description).toBe('');
  });

  test('PUT /todos/:id - обновление несуществующего TODO @negative', async ({ todoController }) => {
    const result = await todoController.updateTodo(99999, {
      title: 'Updated',
      doneStatus: true,
    });

    expect(result.status).toBe(400);
    todoController.validateErrorResponse(result.data);
    expect(result.data.errorMessages[0]).toContain(
      'Cannot create todo with PUT due to Auto fields id',
    );
  });

  test('PUT /todos/:id - обновление без обязательного поля title @negative', async ({
    todoController,
  }) => {
    const result = await todoController.updateTodo(createdTodoId, { doneStatus: true });

    expect(result.status).toBe(400);
    todoController.validateErrorResponse(result.data);
    expect(result.data.errorMessages).toContain('title : field is mandatory');
  });

  test('PUT /todos/:id - изменение статуса выполнения @status', async ({
    todoController,
    todoBuilder,
  }) => {
    const todoData = todoBuilder.withTitle('Test').incomplete().build();
    const createResult = await todoController.createTodo(todoData);

    const updateResult = await todoController.updateTodo(createResult.data.id, {
      title: 'Test',
      doneStatus: true,
    });

    expect(updateResult.status).toBe(200);
    expect(updateResult.data.doneStatus).toBe(true);
  });
});
