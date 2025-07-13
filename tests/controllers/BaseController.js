export class BaseController {
  constructor(apiContext) {
    this.apiContext = apiContext;
  }

  async makeRequest(method, endpoint, options = {}) {
    const response = await this.apiContext[method](endpoint, options);
    return {
      status: response.status(),
      headers: response.headers(),
      data: await this.getResponseData(response),
      response,
    };
  }

  async getResponseData(response) {
    try {
      return await response.json();
    } catch {
      return await response.text();
    }
  }

  expectStatus(actualStatus, expectedStatus) {
    if (Array.isArray(expectedStatus)) {
      expect(expectedStatus).toContain(actualStatus);
    } else {
      expect(actualStatus).toBe(expectedStatus);
    }
  }

  expectProperty(object, property, value = undefined) {
    expect(object).toHaveProperty(property);
    if (value !== undefined) {
      expect(object[property]).toBe(value);
    }
  }
}
