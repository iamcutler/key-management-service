import { Request, Response } from 'express';

export default () : any => ({
  hostContext: {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn().mockReturnThis(),
    getResponse: jest.fn().mockReturnThis(),
    jsonResponse: jest.fn(),
  },
  Logger: {
    error: jest.fn()
  },
  response: {
    jsonResponse: jest.fn()
  }
});
