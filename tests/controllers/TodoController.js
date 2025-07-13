import { BaseController } from './BaseController.js';
import { expect } from '@playwright/test';

export class TodoController extends BaseController {
  constructor(apiContext) {
    super(apiContext);
    this.endpoint = '/todos';
  }

  async getAllTodos() {
    return await this.makeRequest('get', this.endpoint);
  }

  async getTodoById(id) {
    return await this.makeRequest('get', `${this.endpoint}/${id}`);
  }

  async getTodosByStatus(doneStatus) {
    return await this.makeRequest('get', `${this.endpoint}?doneStatus=${doneStatus}`);
  }

  async getHeadTodos() {
    return await this.makeRequest('head', this.endpoint);
  }

  async createTodo(todoData) {
    return await this.makeRequest('post', this.endpoint, { data: todoData });
  }

  async updateTodo(id, todoData) {
    return await this.makeRequest('put', `${this.endpoint}/${id}`, { data: todoData });
  }

  async patchTodo(id, todoData) {
    return await this.makeRequest('patch', `${this.endpoint}/${id}`, { data: todoData });
  }

  async deleteTodo(id) {
    return await this.makeRequest('delete', `${this.endpoint}/${id}`);
  }

  validateTodoStructure(todo) {
    this.expectProperty(todo, 'id');
    this.expectProperty(todo, 'title');
    this.expectProperty(todo, 'doneStatus');
    expect(typeof todo.doneStatus).toBe('boolean');
  }

  validateTodosArray(todos) {
    expect(Array.isArray(todos)).toBeTruthy();
    if (todos.length > 0) {
      this.validateTodoStructure(todos[0]);
    }
  }

  validateErrorResponse(data) {
    this.expectProperty(data, 'errorMessages');
    expect(Array.isArray(data.errorMessages)).toBeTruthy();
    expect(data.errorMessages.length).toBeGreaterThan(0);
  }

  validateTodoCreated(todo, expectedData) {
    expect(typeof todo.id).toBe('number');
    expect(todo.title).toBe(expectedData.title);
    expect(todo.doneStatus).toBe(expectedData.doneStatus);
    expect(todo.description).toBe(expectedData.description || '');
  }
}
