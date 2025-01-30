export declare class SecurityStorage {
    private storage;
    constructor({ nameSpace, storage }: {
        nameSpace?: string;
        storage?: Storage;
    });
    set(key: string, data: any): void;
    get(key: string): any | null;
    remove(key: string): void;
    clean(): void;
}
export default SecurityStorage;
