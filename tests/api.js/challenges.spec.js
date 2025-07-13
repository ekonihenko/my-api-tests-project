import { test, expect } from '../fixtures/api-client';

test.describe('API Challenges Tests @challenges', () => {
  test('GET /challenges - получение списка всех challenges @smoke @get', async ({
    challengesController,
  }) => {
    const result = await challengesController.getChallenges();

    expect(result.status).toBe(200);
    challengesController.validateChallengesResponse(result.data);
  });

  test('POST /challenger - создание нового challenger токена @smoke @post', async ({
    challengesController,
  }) => {
    const result = await challengesController.createChallenger();

    challengesController.expectStatus(result.status, [200, 201]);
    challengesController.validateChallengerToken(result.headers);
  });

  test('GET /heartbeat - проверка доступности API @smoke @get', async ({
    challengesController,
  }) => {
    const result = await challengesController.getHeartbeat();

    expect(result.status).toBe(204);
    expect(result.data).toBe('');
  });
});
