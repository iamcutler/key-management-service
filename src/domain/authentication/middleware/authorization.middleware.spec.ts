import { Test } from '@nestjs/testing';
import { BAD_REQUEST } from 'http-status';
import { AuthorizationMiddleware } from './authorization.middleware';
import { AuthService } from '../services/auth/auth.service';
import mock from '../../../../test/mock';

const { request, response } = mock();

jest.mock('../services/auth/auth.service');

describe('Middleware: AuthorizationMiddleware', () => {
    // given
    let authService: AuthService;
    let getContentFromAuthToken;
    const token = {
        tenantUuid: '6788674535343456567456'
    };
    const next = jest.fn();

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [],
            providers: [AuthService],
          }).compile();
    
        authService = moduleRef.get<AuthService>(AuthService);

        getContentFromAuthToken = jest.spyOn(AuthService.prototype, 'getContentFromAuthToken');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should call the next function if the token and authentication is successful', async () => {
        // given
        const req = {
            ...request,
            headers: {
                ...request.headers,
                authorization: token // mock token
            }
        };
        getContentFromAuthToken.mockReturnValue(token);
        const authMiddleWare: AuthorizationMiddleware = new AuthorizationMiddleware(authService);
        // when
        await authMiddleWare.use(req, response, next);
        // then
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('should throw an AuthTokenException if a token is not present', async () => {
        // given
        const authMiddleWare: AuthorizationMiddleware = new AuthorizationMiddleware(authService);
        // when
        try {
            await authMiddleWare.use(request, response, next);
        }
        catch (err) {
            // then
            expect(err.getStatus()).toEqual(BAD_REQUEST);
            expect(err.message).toEqual('No authorization token was present');
        }
    });
});
