export declare class SecurityStorage {
    constructor();
    set(key: string, data: any): any;
    get(key: string): string | null;
    private encrypt;
    private generateRandomKey;
}
