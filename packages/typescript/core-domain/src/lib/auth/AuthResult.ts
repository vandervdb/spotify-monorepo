export type Reason =
    | 'TIMEOUT'
    | 'SESSION_FAILED'
    | 'TOKEN_MISSING'
    | 'UNEXPECTED';

export type Failed = {
    reason: Reason;
    cause: string;
};

export type AuthResult = {
    accessToken?: string;
    failed?: Failed;
};
