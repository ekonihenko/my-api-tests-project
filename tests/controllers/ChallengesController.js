import { BaseController } from './BaseController.js';
import { expect } from '@playwright/test';

export class ChallengesController extends BaseController {
  constructor(apiContext) {
    super(apiContext);
  }

  async getChallenges() {
    return await this.makeRequest('get', '/challenges');
  }

  async createChallenger() {
    return await this.makeRequest('post', '/challenger');
  }

  async getHeartbeat() {
    return await this.makeRequest('get', '/heartbeat');
  }

  validateChallengesResponse(data) {
    this.expectProperty(data, 'challenges');
    expect(Array.isArray(data.challenges)).toBeTruthy();
    expect(data.challenges.length).toBeGreaterThan(0);

    const challenge = data.challenges[0];
    this.expectProperty(challenge, 'name');
    this.expectProperty(challenge, 'description');
  }

  validateChallengerToken(headers) {
    this.expectProperty(headers, 'x-challenger');
    expect(headers['x-challenger']).toBeTruthy();
    expect(headers['x-challenger'].length).toBeGreaterThan(10);
  }
}
