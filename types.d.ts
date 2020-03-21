declare namespace Express {
    export interface Response {
        jsonResponse(data: any, errors?: string[], success?: boolean, status?: number) : this;
    }
}
