import {Constant} from "./constant";
import {enc, lib, AES,mode,pad} from "crypto-js";
import {compressToUTF16, decompressFromUTF16 } from "lz-string";

export class SecurityStorage {
    constructor() {}

    set(key: string, data:any): any{
        return this.encrypt(data, Constant.base_key);
        //localStorage.setItem(key,encryptedData);
    }

    get(key:string){
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

    private generateRandomKey(length: number = 60): string {
        const randomBytes = lib.WordArray.random(length / 2);
        return enc.Hex.stringify(randomBytes);
    }
}