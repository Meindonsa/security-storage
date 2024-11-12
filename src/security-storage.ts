import {Constant} from "./constant";
import {enc, lib, AES,mode,pad} from "crypto-js";
import {compressToUTF16, decompressFromUTF16 } from "lz-string";

export class SecurityStorage {
    constructor() {}

    set(key: string, data:any): void{
        let encryptedData = this.encrypt(data, Constant.base_key);
        localStorage.setItem(key,encryptedData);
    }

    get(key:string):any |null{
        return localStorage.getItem(key);
    }

    private encrypt(data: any, secretKey: string): string {
        try {
            const encryptedData = AES.encrypt(JSON.stringify(data), secretKey, {
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
            if (!decompressedData) {
                console.error("Decompression failed, data is null or empty");
                throw new Error("Decompression failed");
            }
            const originalData = AES.decrypt(decompressedData, secretKey, {
                keySize: 256 / 32,
                mode: mode.CBC,
                padding: pad.Pkcs7,
            }).toString(enc.Utf8);

            if (!originalData) {
                console.error("Decryption failed, possibly due to incorrect key");
                throw new Error("Decryption failed");
            }
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