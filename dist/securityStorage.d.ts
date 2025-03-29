export declare class SecurityStorage {
    private encryptionKey;
    private metaStore;
    constructor(secretKey?: string | null);
    private init;
    private encryptMetaData;
    setItem(key: string, data: any): void;
    getItem(key: string): any | null;
    removeItem(key: string): void;
    clear(): void;
    private encrypt;
    private decrypt;
    private generateRandomKey;
    private hasInvalidString;
}
