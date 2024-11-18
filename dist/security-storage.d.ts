export declare class SecurityStorage {
    private metaData;
    constructor();
    private init;
    private _get_meta;
    private encryptMetaData;
    set(key: string, data: any): void;
    get(key: string): any | null;
    remove(key: string): void;
    clean(): void;
    private encrypt;
    private decrypt;
    private generateRandomKey;
}
