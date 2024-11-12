export declare class SecurityStorage {
    constructor();
    set(key: string, data: any): void;
    get(key: string): any | null;
    private encrypt;
    private generateRandomKey;
}
