import { request, response } from 'express';
import { jsonResponse } from './jsonresponse.middleware';

describe('Middleware: jsonResponse', () => {
    // given
    const next = jest.fn();

    beforeEach(() => {
        jest.spyOn(response, 'status').mockReturnThis();
        jest.spyOn(response, 'json').mockReturnThis();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should add the jsonResponse handler to the response object', () => {
        // given
        // when
        jsonResponse(request, response, next);
        // then
        expect(response.hasOwnProperty('jsonResponse')).toEqual(true);
    });

    it('should call the next function in the middleware', () => {
        // given
        // when
        jsonResponse(request, response, next);
        // then
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should set the correct default status code of 200', () => {
        // given
        jsonResponse(request, response, next);
        // when
        response.jsonResponse(null);
        // then
        expect(response.status).toHaveBeenCalledWith(200);
    });

    it('should return the expected json payload', () => {
        // given
        const data = [{ id: 1 }];
        jsonResponse(request, response, next);
        // when
        response.jsonResponse(data, [], true, 201);
        // then
        expect(response.json).toHaveBeenCalledWith({
            data,
            errors: [],
            success: true,
            statusCode: 201
        });
    });
});
