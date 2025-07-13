import { test, expect } from '../fixtures/api-client';

test.describe('TODO API - DELETE запросы @todos @delete', () => {
  test('DELETE /todos/:id - удаление существующего TODO @smoke', async ({
    todoController,
    todoBuilder,
  }) => {
    const todoData = todoBuilder.withTitle('TODO для удаления').build();
    const createResult = await todoController.createTodo(todoData);

    const deleteResult = await todoController.deleteTodo(createResult.data.id);
    todoController.expectStatus(deleteResult.status, [200, 204]);

    const getResult = await todoController.getTodoById(createResult.data.id);
    expect(getResult.status).toBe(404);
  });

  test('DELETE /todos/:id - попытка удалить несуществующий TODO @negative', async ({
    todoController,
  }) => {
    const result = await todoController.deleteTodo(99999);

    expect(result.status).toBe(404);
    todoController.validateErrorResponse(result.data);

    const errorMessage = result.data.errorMessages[0].toLowerCase();
    expect(errorMessage).toMatch(/no such|not found|could not find|entity/i);
  });

  test('DELETE /todos/:id - повторное удаление уже удаленного TODO @negative', async ({
    todoController,
    todoBuilder,
  }) => {
    const todoData = todoBuilder.withTitle('TODO для двойного удаления').build();
    const createResult = await todoController.createTodo(todoData);
    const todoId = createResult.data.id;

    const firstDeleteResult = await todoController.deleteTodo(todoId);
    todoController.expectStatus(firstDeleteResult.status, [200, 204]);

    const secondDeleteResult = await todoController.deleteTodo(todoId);
    expect(secondDeleteResult.status).toBe(404);
    todoController.validateErrorResponse(secondDeleteResult.data);
  });

  test('DELETE /todos/:id - проверка что другие TODO не затронуты @isolation', async ({
    todoController,
    todoBuilder,
  }) => {
    const todo1Data = todoBuilder.withTitle('First TODO').build();
    const todo2Data = todoBuilder.withTitle('Second TODO').build();

    const todo1Result = await todoController.createTodo(todo1Data);
    const todo2Result = await todoController.createTodo(todo2Data);

    expect(todo1Result.status).toBe(201);
    expect(todo2Result.status).toBe(201);

    const todo1Id = todo1Result.data.id;
    const todo2Id = todo2Result.data.id;

    const deleteResult = await todoController.deleteTodo(todo1Id);
    todoController.expectStatus(deleteResult.status, [200, 204]);

    const allTodosResult = await todoController.getAllTodos();
    expect(allTodosResult.status).toBe(200);

    const todoIds = allTodosResult.data.todos.map((t) => t.id);
    expect(todoIds).not.toContain(todo1Id);
    expect(todoIds).toContain(todo2Id);

    const foundTodo2 = allTodosResult.data.todos.find((t) => t.id === todo2Id);
    expect(foundTodo2).toBeDefined();
    expect(foundTodo2.title).toBe('Second TODO');
  });
});
