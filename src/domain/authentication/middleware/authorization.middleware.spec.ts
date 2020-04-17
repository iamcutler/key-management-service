import { Test } from '@nestjs/testing';
import { BAD_REQUEST } from 'http-status';
import { AuthorizationMiddleware } from './authorization.middleware';
import { AuthService } from '../services/auth/auth.service';
import mock from '../../../../test/mock';
import { ConfigService } from '@nestjs/config';

const { request, response } = mock();

jest.mock('../services/auth/auth.service');

describe('Middleware: AuthorizationMiddleware', () => {
    // given
    let authService: AuthService;
    let getContentFromAuthToken, authenticateByToken;
    const token = {
        tenantUuid: '6788674535343456567456'
    };
    const next = jest.fn();

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('CR Authentication disabled', () => {
        // given
        const configService: ConfigService = new ConfigService();

        beforeEach(async () => {
            await Test.createTestingModule({
                controllers: [],
                providers: [],
                imports: []
              }).compile();
        });

        it('should call the next function if the token and authentication is successful', async () => {
            // given
            const req = {
                ...request,
                headers: {
                    ...request.headers,
                    authorization: token.tenantUuid // mock token
                }
            };
            const authMiddleWare: AuthorizationMiddleware = new AuthorizationMiddleware(authService, configService);
            // when
            await authMiddleWare.use(req, response, next);
            // then
            expect(next).toHaveBeenCalledTimes(1);
        });

        it('should throw an AuthTokenException if a token is not present', async () => {
            // given
            const authMiddleWare: AuthorizationMiddleware = new AuthorizationMiddleware(authService, configService);
            // when
            try {
                await authMiddleWare.use(request, response, next);
            }
            catch (err) {
                // then
                expect(err.getStatus()).toEqual(BAD_REQUEST);
                expect(err.message).toEqual('No authorization token or tenant was present');
            }
        });
    });

    describe('CR Authentication enabled', () => {
        // given
        const configService = new ConfigService({
            ENABLE_CR_AUTHENTICATION: 'true'
        });

        beforeEach(async () => {
            const moduleRef = await Test.createTestingModule({
                controllers: [],
                providers: [AuthService],
                imports: []
              }).compile();

            authService = moduleRef.get<AuthService>(AuthService);

            getContentFromAuthToken = jest.spyOn(AuthService.prototype, 'getContentFromAuthToken');
            authenticateByToken = jest.spyOn(AuthService.prototype, 'authenticateByToken');
        });

        it('should call the auth service to get the content from the auth token', async () => {
            // given
            const req = {
                ...request,
                headers: {
                    ...request.headers,
                    authorization: token // mock token
                }
            };
            getContentFromAuthToken.mockReturnValue(token);
            authenticateByToken.mockResolvedValue();
            const authMiddleWare: AuthorizationMiddleware = new AuthorizationMiddleware(authService, configService);
            // when
            await authMiddleWare.use(req, response, next);
            // then
            expect(getContentFromAuthToken).toHaveBeenCalledTimes(1);
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
            const authMiddleWare: AuthorizationMiddleware = new AuthorizationMiddleware(authService, configService);
            // when
            await authMiddleWare.use(req, response, next);
            // then
            expect(next).toHaveBeenCalledTimes(1);
        });
    });
});
