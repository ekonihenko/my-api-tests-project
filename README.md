# My API Tests Project

Автоматизированные тесты API, построенные с использованием Node.js и современных паттернов тестирования.

## 📋 Содержание

- [Обзор](#обзор)
- [Возможности](#возможности)
- [Требования](#требования)
- [Установка](#установка)
- [Структура проекта](#структура-проекта)
- [Запуск тестов](#запуск-тестов)
- [Архитектура](#архитектура)
- [Примеры использования](#примеры-использования)
- [Конфигурация](#конфигурация)
- [Участие в разработке](#участие-в-разработке)

## 🎯 Обзор

Проект представляет собой комплексный набор автоматизированных тестов для API, использующий современные подходы к тестированию, включая паттерн Builder для создания тестовых данных и контроллеры для организации API вызовов.

## ✨ Возможности

- ✅ Модульная архитектура с контроллерами
- ✅ Паттерн Builder для создания тестовых данных
- ✅ Система фикстур для подготовки данных
- ✅ Переиспользуемые API клиенты
- ✅ Структурированная организация тестов
- ✅ Поддержка различных типов тестирования

## 🔧 Требования

- Node.js 14.0.0 или выше
- npm 6.0.0 или выше

## 🚀 Установка

1. Клонируйте репозиторий:

git clone https://github.com/ekonihenko/my-api-tests-project.git
cd my-api-tests-project
Установите зависимости:

npm install
Настройте переменные окружения:

cp .env.example .env
# Отредактируйте файл .env с вашими настройками

📁 Структура проекта

my-api-tests-project/
├── tests/
│   ├── api.js                    # Основной API клиент
│   ├── builders/                 # Builder паттерны для тестовых данных
│   │   └── TodoBuilder.js        # Builder для Todo объектов
│   ├── controllers/              # API контроллеры
│   │   ├── AuthController.js     # Контроллер аутентификации
│   │   ├── TodoController.js     # Контроллер для Todo API
│   │   └── UserController.js     # Контроллер пользователей
│   ├── fixtures/                 # Тестовые данные и фикстуры
│   │   ├── auth.json            # Данные для аутентификации
│   │   ├── todos.json           # Тестовые Todo данные
│   │   └── users.json           # Тестовые пользователи
│   └── specs/                   # Файлы тестов
│       ├── auth.spec.js
│       ├── todos.spec.js
│       └── users.spec.js
├── config/
│   └── test.config.js           # Конфигурация тестов
├── package.json
├── package-lock.json
└── README.md

🏃‍♂️ Запуск тестов
Запуск всех тестов

npm test
Запуск конкретных тестов
Copy
# Тесты аутентификации
npm run test:auth

# Тесты Todo API
npm run test:todos

# Тесты пользователей
npm run test:users
Запуск с отчетами
Copy
npm run test:report
🏗️ Архитектура
API Клиент (tests/api.js)
Базовый класс для выполнения HTTP запросов с общими методами и настройками.


const api = require('./api');

// Пример использования
const response = await api.get('/todos');
const newTodo = await api.post('/todos', todoData);
Builder Pattern (tests/builders/)
Используется для создания тестовых объектов с гибкой конфигурацией.


const TodoBuilder = require('./builders/TodoBuilder');

// Создание Todo с помощью Builder
const todo = new TodoBuilder()
    .withTitle('Тестовая задача')
    .withCompleted(false)
    .withUserId(1)
    .build();
Контроллеры (tests/controllers/)
Инкапсулируют логику взаимодействия с конкретными API эндпоинтами.


const TodoController = require('./controllers/TodoController');

// Использование контроллера
const todoController = new TodoController();
const todos = await todoController.getAllTodos();
const newTodo = await todoController.createTodo(todoData);
Фикстуры (tests/fixtures/)
Содержат предопределенные тестовые данные для различных сценариев.

💡 Примеры использования
Создание и тестирование Todo

const TodoBuilder = require('../builders/TodoBuilder');
const TodoController = require('../controllers/TodoController');

describe('Todo API Tests', () => {
    let todoController;
    
    beforeEach(() => {
        todoController = new TodoController();
    });
    
    test('Создание новой задачи', async () => {
        // Создание тестовых данных с помощью Builder
        const todoData = new TodoBuilder()
            .withTitle('Новая задача')
            .withCompleted(false)
            .build();
        
        // Создание задачи через контроллер
        const response = await todoController.createTodo(todoData);
        
        expect(response.status).toBe(201);
        expect(response.data.title).toBe(todoData.title);
        expect(response.data.completed).toBe(false);
    });
    
    test('Получение списка задач', async () => {
        const response = await todoController.getAllTodos();
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
    });
});
Использование фикстур

const authFixtures = require('../fixtures/auth.json');
const AuthController = require('../controllers/AuthController');

describe('Authentication Tests', () => {
    test('Успешная аутентификация', async () => {
        const authController = new AuthController();
        const credentials = authFixtures.validUser;
        
        const response = await authController.login(credentials);
        
        expect(response.status).toBe(200);
        expect(response.data.token).toBeDefined();
    });
});
⚙️ Конфигурация
Создайте файл .env в корневой директории:


# API Configuration
BASE_URL=https://jsonplaceholder.typicode.com
API_TIMEOUT=5000

# Test Configuration
TEST_ENVIRONMENT=development
LOG_LEVEL=info

# Authentication
TEST_USERNAME=testuser
TEST_PASSWORD=testpass
Файл конфигурации тестов

// config/test.config.js
module.exports = {
    baseURL: process.env.BASE_URL || 'https://jsonplaceholder.typicode.com',
    timeout: parseInt(process.env.API_TIMEOUT) || 5000,
    retries: 3,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};
📦 Зависимости
Основные зависимости проекта (добавьте в package.json):


{
  "name": "my-api-tests-project",
  "version": "1.0.0",
  "description": "Автоматизированные тесты API",
  "scripts": {
    "test": "jest",
    "test:auth": "jest tests/specs/auth.spec.js",
    "test:todos": "jest tests/specs/todos.spec.js",
    "test:users": "jest tests/specs/users.spec.js",
    "test:report": "jest --coverage",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "axios": "^1.0.0",
    "dotenv": "^16.0.0"
  }
}
🔧 Полезные команды

# Запуск тестов в режиме наблюдения
npm run test:watch

# Запуск тестов с покрытием кода
npm run test:coverage

# Запуск линтера
npm run lint

# Форматирование кода
npm run format
🐛 Отладка
Включение детального логирования
DEBUG=true npm test

Запуск отдельного теста
npx jest tests/specs/todos.spec.js --verbose

🤝 Участие в разработке
Форкните репозиторий
Создайте ветку для новой функции:

git checkout -b feature/new-feature
Внесите изменения и добавьте тесты

Зафиксируйте изменения:
git commit -m "Add new feature"

Отправьте изменения:
git push origin feature/new-feature

Создайте Pull Request

Правила разработки
Используйте ESLint для проверки кода
Покрывайте новый код тестами
Следуйте существующим паттернам архитектуры
Документируйте сложные функции
📊 Отчетность
Проект поддерживает генерацию различных типов отчетов:

HTML отчеты с покрытием кода
JUnit XML для CI/CD интеграции
Детальные логи выполнения тестов
🚀 CI/CD
Пример конфигурации для GitHub Actions:
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
      
    - name: Upload coverage
      uses: codecov/codecov-action@v3
📄 Лицензия
Этот проект лицензирован под MIT License - см. файл LICENSE для деталей.

📞 Поддержка
🐛 Сообщить о баге
💡 Предложить улучшение
📧 Email: ek.onihenko@gmail.com
Автор: ekonihenko

Последнее обновление: 2025
