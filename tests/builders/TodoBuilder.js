export class TodoBuilder {
  constructor() {
    this.reset();
  }

  reset() {
    this.todo = {
      title: 'Default TODO',
      doneStatus: false,
      description: '',
    };
    return this;
  }

  withTitle(title) {
    this.todo.title = title;
    return this;
  }

  withDescription(description) {
    this.todo.description = description;
    return this;
  }

  withStatus(doneStatus) {
    this.todo.doneStatus = doneStatus;
    return this;
  }

  completed() {
    this.todo.doneStatus = true;
    return this;
  }

  incomplete() {
    this.todo.doneStatus = false;
    return this;
  }

  withLongTitle(length = 50) {
    this.todo.title = 'A'.repeat(length);
    return this;
  }

  withEmptyTitle() {
    this.todo.title = '';
    return this;
  }

  minimal() {
    this.todo = {
      title: 'Minimal TODO',
      doneStatus: false,
      description: '',
    };
    return this;
  }

  build() {
    const result = { ...this.todo };
    this.reset();
    return result;
  }

  static simple() {
    return new TodoBuilder().build();
  }

  static completed() {
    return new TodoBuilder().completed().build();
  }

  static withTitle(title) {
    return new TodoBuilder().withTitle(title).build();
  }

  static minimal() {
    return new TodoBuilder().minimal().build();
  }
}
