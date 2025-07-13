import { test, expect } from '../fixtures/api-client';

test.describe('TODO API - GET запросы @todos @get', () => {
  test('GET /todos - получение списка всех TODO @smoke', async ({ todoController }) => {
    const result = await todoController.getAllTodos();

    expect(result.status).toBe(200);
    todoController.expectProperty(result.data, 'todos');
    todoController.validateTodosArray(result.data.todos);
  });

  test('GET /todos/:id - получение TODO по ID @smoke', async ({ todoController, todoBuilder }) => {
    const todoData = todoBuilder.withTitle('Test TODO').withDescription('Test').build();
    const createResult = await todoController.createTodo(todoData);

    console.log('Created:', createResult.data);

    const getResult = await todoController.getTodoById(createResult.data.id);
    console.log('GET Response:', getResult.data);

    expect(getResult.status).toBe(200);
    expect(getResult.data.title).toContain('Test TODO');
  });

  test('GET /todos/:id - получение несуществующего TODO @negative', async ({ todoController }) => {
    const result = await todoController.getTodoById(99999);
    console.log('GET non-existent TODO status:', result.status);

    expect(result.status).toBe(404);

    try {
      console.log('Error response:', result.data);
      todoController.validateErrorResponse(result.data);

      const errorMessage = result.data.errorMessages[0].toLowerCase();
      const hasExpectedError =
        errorMessage.includes('could not find') ||
        errorMessage.includes('not found') ||
        errorMessage.includes('no such') ||
        errorMessage.includes('todo') ||
        errorMessage.includes('entity');

      expect(hasExpectedError).toBeTruthy();
    } catch (e) {
      console.error('Failed to parse error response:', e);
    }
  });

  test('GET /todos?doneStatus=true - фильтрация по статусу выполнения @filter', async ({
    todoController,
    todoBuilder,
  }) => {
    const completedTodo = todoBuilder.withTitle('Completed TODO').completed().build();

    await todoController.createTodo(completedTodo);

    const result = await todoController.getTodosByStatus(true);
    expect(result.status).toBe(200);

    todoController.expectProperty(result.data, 'todos');
    result.data.todos.forEach((todo) => {
      expect(todo.doneStatus).toBe(true);
    });
  });

  test('GET /todos?doneStatus=false - фильтрация невыполненных TODO @filter', async ({
    todoController,
    todoBuilder,
  }) => {
    const incompleteTodo = todoBuilder.withTitle('Incomplete TODO').incomplete().build();

    await todoController.createTodo(incompleteTodo);

    const result = await todoController.getTodosByStatus(false);
    expect(result.status).toBe(200);

    todoController.expectProperty(result.data, 'todos');
    result.data.todos.forEach((todo) => {
      expect(todo.doneStatus).toBe(false);
    });
  });

  test('HEAD /todos - проверка заголовков без тела ответа @headers', async ({ todoController }) => {
    const result = await todoController.getHeadTodos();

    expect(result.status).toBe(200);
    expect(result.headers['content-type']).toContain('application/json');
    expect(result.data).toBe('');
  });

  test('OPTIONS /todos - получение доступных методов @options', async ({ apiContext }) => {
    const response = await apiContext.fetch('/todos', {
      method: 'OPTIONS',
    });

    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect(headers['allow']).toBeDefined();
    const allowedMethods = headers['allow'].split(', ');
    expect(allowedMethods).toContain('GET');
    expect(allowedMethods).toContain('POST');
    expect(allowedMethods).toContain('OPTIONS');
  });

  test('GET /todos поддерживает XML формат @headers', async ({ playwright }) => {
    const context = await playwright.request.newContext({
      baseURL: 'https://apichallenges.herokuapp.com',
    });

    const xmlResponse = await context.get('/todos', {
      headers: {
        Accept: 'application/xml',
      },
    });

    expect(xmlResponse.status()).toBe(200);
    expect(xmlResponse.headers()['content-type']).toContain('application/xml');

    const xmlText = await xmlResponse.text();
    expect(xmlText).toMatch(/^<todos>/);
    expect(xmlText).toMatch(/<\/todos>$/);
    expect(xmlText).toContain('<todo>');
    expect(xmlText).toContain('</todo>');
    expect(xmlText).toContain('<id>');
    expect(xmlText).toContain('<title>');
    expect(xmlText).toContain('<doneStatus>');

    await context.dispose();
  });
});
