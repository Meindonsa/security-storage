export declare class SecurityStorage {
    private metaData;
    private cache;
    private batchQueue;
    constructor();
    private init;
    private encryptMetaData;
    set(key: string, data: any): void;
    setBatch(data: {
        [key: string]: any;
    }): void;
    saveBatch(): void;
    get(key: string): any | null;
    remove(key: string): void;
    clean(): void;
    private checkValue;
    private encrypt;
    private decrypt;
    private generateRandomKey;
}
