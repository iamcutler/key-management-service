declare namespace Express {
    export interface Request {
        // current tenant identifer
        tenantId: string;
        // Authentication JWT token
        token: any;
    }

    export interface Response {
        jsonResponse(data: any, errors?: string[], success?: boolean, status?: number) : this;
    }
}
