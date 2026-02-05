export type SessionContextType = {
    authenticateUser: () => void;
    isConnected: boolean;
    getAuthToken: () => Promise<void>;
};
