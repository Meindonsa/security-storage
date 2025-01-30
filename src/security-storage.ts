import { Constant } from "./constant";
import { enc, lib, AES, mode, pad } from "crypto-js";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";

interface MetaData {
    _keyStr: string;
    array: Map<string, string>;
}

export class SecurityStorage {
    private metaData: MetaData | null = null;
    private cache: Map<string, any> = new Map<string, any>();
    private batchQueue: Map<string, any> = new Map<string, any>();

    constructor() {
        this.init();
    }

    private init(): void {
        let encrypted: string | null = localStorage.getItem(Constant.keys_name);
        if (encrypted == null) {
            this.metaData = {
                _keyStr: this.generateRandomKey(),
                array: new Map<string, string>(),
            };
            this.encryptMetaData(this.metaData);
        } else {
            this.metaData = this.decrypt(encrypted, Constant.base_key) as MetaData;
        }
    }

    private encryptMetaData(data: MetaData): void {
        const encrypted: string = this.encrypt(data, Constant.base_key);
        if (encrypted) localStorage.setItem(Constant.keys_name, encrypted);
    }

    public set(key: string, data: any): void {
        if (this.checkValue(key, "key") || this.checkValue(data, "data")) return;

        this.batchQueue.set(key, data); // Add to batch queue
        if (!this.metaData) this.init();  // Ensure metaData is initialized
        this.metaData?.array.set(key, '');  // Placeholder for key, actual encryption will occur on save
    }

    public setBatch(data: { [key: string]: any }): void {
        Object.entries(data).forEach(([key, value]) => {
            this.set(key, value); // Utilise la méthode set pour ajouter à la file d'attente
        });
    }

    public saveBatch(): void {
        if (this.batchQueue.size > 0) {
            this.batchQueue.forEach((data, key) => {
                if (this.metaData) {
                    const data_key = this.generateRandomKey();
                    this.metaData.array.set(key, data_key);
                    let encryptedData: string = this.encrypt(data, data_key);
                    localStorage.setItem(key, encryptedData);
                }
            });
            if (this.metaData) this.encryptMetaData(this.metaData);
            this.batchQueue.clear();
        }
    }

    public get(key: string): any | null {
        if (this.checkValue(key, "key")) return null;

        // Check cache first
        if (this.cache.has(key)) return this.cache.get(key);

        if (!this.metaData) this.init();  // Ensure metaData is initialized
        let data: string | null = localStorage.getItem(key);
        if (data == null) return null;

        const data_key: string | undefined = this.metaData?.array.get(key);
        if (!data_key) return null;

        const decryptedData = this.decrypt(data, data_key);
        this.cache.set(key, decryptedData); // Cache the result
        return decryptedData;
    }

    public remove(key: string): void {
        if (this.checkValue(key, "key")) return;

        if (!this.metaData) this.init();  // Ensure metaData is initialized
        this.metaData?.array.delete(key);
        this.cache.delete(key);
        this.batchQueue.delete(key);
        if(this.metaData){
            this.encryptMetaData(this.metaData);
            localStorage.removeItem(key);
        }
    }

    public clean(): void {
        if (!this.metaData) this.init();  // Ensure metaData is initialized
        this.metaData?.array.clear();
        this.cache.clear();
        this.batchQueue.clear();
        if(this.metaData)
            this.encryptMetaData(this.metaData);
        localStorage.clear();
    }

    private checkValue(value: string, key: string): boolean {
        if (value == null || value.trim() === "") {
            console.error(`${key} cannot be null`);
            return true;
        }
        return false;
    }

    private encrypt(data: any, secretKey: string): string {
        try {
            const encryptedData = AES.encrypt(JSON.stringify(data), secretKey, {
                iv: enc.Hex.parse(Constant.iv),
                keySize: 256 / 32,
                mode: mode.CBC,
                padding: pad.Pkcs7,
            }).toString();
            return compressToUTF16(encryptedData);
        } catch (error) {
            console.error("Encryption error:", error);
            throw error;
        }
    }

    private decrypt(encryptedData: string, secretKey: string): any {
        try {
            const decompressedData = decompressFromUTF16(encryptedData);
            if (!decompressedData) throw new Error("Decompression failed");
            const originalData = AES.decrypt(decompressedData, secretKey, {
                iv: enc.Hex.parse(Constant.iv),
                keySize: 256 / 32,
                mode: mode.CBC,
                padding: pad.Pkcs7,
            }).toString(enc.Utf8);
            if (!originalData) throw new Error("Decryption failed");
            return JSON.parse(originalData);
        } catch (error) {
            console.error("Decryption error:", error);
            throw error;
        }
    }

    private generateRandomKey(length: number = 60): string {
        const randomBytes = lib.WordArray.random(length / 2);
        return enc.Hex.stringify(randomBytes);
    }
}