export declare class SecurityStorage {
    constructor();
    private init;
    set(key: string, data: any): void;
    get(key: string): any | null;
    remove(key: string): void;
    clean(): void;
    private encrypt;
    private decrypt;
    private generateRandomKey;
}
