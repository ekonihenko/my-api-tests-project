import { test, expect } from '../fixtures/api-client';

test.describe('TODO API - POST запросы @todos @post', () => {
  test('POST /todos - создание нового TODO @smoke', async ({ todoController, todoBuilder }) => {
    const todoData = todoBuilder.withTitle('New TODO').withDescription('Test desc').build();
    const result = await todoController.createTodo(todoData);

    expect(result.status).toBe(201);
    todoController.validateTodoCreated(result.data, todoData);
  });

  test('POST /todos - создание TODO только с обязательными полями @minimal', async ({
    todoController,
    todoBuilder,
  }) => {
    const minimalTodo = todoBuilder.minimal().build();
    const result = await todoController.createTodo(minimalTodo);

    expect(result.status).toBe(201);
    todoController.validateTodoCreated(result.data, minimalTodo);
  });

  test('POST /todos - создание TODO без обязательного поля title @negative', async ({
    todoController,
  }) => {
    const invalidTodo = { doneStatus: false, description: 'test' };
    const result = await todoController.createTodo(invalidTodo);

    expect(result.status).toBe(400);
    todoController.validateErrorResponse(result.data);

    const hasExpectedError = result.data.errorMessages.some(
      (msg) => msg.includes('title') && msg.includes('mandatory'),
    );
    expect(hasExpectedError).toBeTruthy();
  });

  test('POST /todos - doneStatus не обязательное поле', async ({ todoController, todoBuilder }) => {
    const todoData = todoBuilder.withTitle('Test').build();
    delete todoData.doneStatus;

    const result = await todoController.createTodo(todoData);
    expect(result.status).toBe(201);
  });

  test('POST /todos - создание TODO с пустым title @negative', async ({
    todoController,
    todoBuilder,
  }) => {
    const todoData = todoBuilder.withEmptyTitle().build();
    const result = await todoController.createTodo(todoData);

    expect(result.status).toBe(400);
    todoController.validateErrorResponse(result.data);

    const hasExpectedError = result.data.errorMessages.some(
      (msg) => msg.includes('title') && msg.includes('empty'),
    );
    expect(hasExpectedError).toBeTruthy();
  });

  test('POST /todos - невалидный doneStatus возвращает 400 @negative', async ({
    todoController,
    todoBuilder,
  }) => {
    const todoData = todoBuilder.withTitle('Test').build();
    todoData.doneStatus = 'invalid';

    const result = await todoController.createTodo(todoData);
    expect(result.status).toBe(400);
  });

  test('POST /todos - создание TODO с очень длинным title @boundary', async ({
    todoController,
    todoBuilder,
  }) => {
    const todoData = todoBuilder.withLongTitle(50).build();
    const result = await todoController.createTodo(todoData);

    expect(result.status).toBe(201);
    expect(result.data.title).toBe(todoData.title);
    expect(result.data.title.length).toBe(50);
  });

  test('POST /todos - создание TODO со слишком длинным title @negative @boundary', async ({
    todoController,
    todoBuilder,
  }) => {
    const todoData = todoBuilder.withLongTitle(51).build();
    const result = await todoController.createTodo(todoData);

    expect(result.status).toBe(400);
    todoController.validateErrorResponse(result.data);

    const hasExpectedError = result.data.errorMessages.some(
      (msg) => msg.includes('title') && msg.includes('length'),
    );
    expect(hasExpectedError).toBeTruthy();
  });
});
