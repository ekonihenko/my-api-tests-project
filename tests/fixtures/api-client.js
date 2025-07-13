import { test as base } from '@playwright/test';
import { TodoController } from '../controllers/TodoController.js';
import { ChallengesController } from '../controllers/ChallengesController.js';
import { TodoBuilder } from '../builders/TodoBuilder.js';

export const test = base.extend({
  apiContext: async ({ playwright }, use) => {
    let context = await playwright.request.newContext({
      baseURL: 'https://apichallenges.herokuapp.com',
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const challengerResponse = await context.post('/challenger');
    const xChallenger = challengerResponse.headers()['x-challenger'];

    if (xChallenger) {
      await context.dispose();
      context = await playwright.request.newContext({
        baseURL: 'https://apichallenges.herokuapp.com',
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-CHALLENGER': xChallenger,
        },
      });
    }

    await use(context);
    await context.dispose();
  },

  todoController: async ({ apiContext }, use) => {
    const controller = new TodoController(apiContext);
    await use(controller);
  },

  challengesController: async ({ apiContext }, use) => {
    const controller = new ChallengesController(apiContext);
    await use(controller);
  },

  todoBuilder: async ({}, use) => {
    const builder = new TodoBuilder();
    await use(builder);
  },

  todoFixture: async ({}, use) => {
    const todo = TodoBuilder.simple();
    await use(todo);
  },
});

export { expect } from '@playwright/test';
