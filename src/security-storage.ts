import {Constant} from "./constant";
import {enc, lib, AES, mode, pad} from "crypto-js";
import {compressToUTF16, decompressFromUTF16} from "lz-string";

interface MetaData{
    _keyStr:string,
    array: Map<string,string>;
}
export class SecurityStorage {
    private metaData:MetaData|any=null;

    constructor() {
        this.init();
    }

    private init():void{
        let encrypted:string|null =  localStorage.getItem(Constant.keys_name);
        if(encrypted==null){
            this.metaData = {
                _keyStr: this.generateRandomKey(),
                array: new Map<string,string>,
            };
            const encrypted: any = this.encrypt(this.metaData, Constant.base_key);
            if (encrypted) localStorage.setItem(Constant.keys_name, encrypted)
        }
    }

    private _get_meta() {
        const object: any|null = localStorage.getItem(Constant.keys_name);
        if (object==null)
            this.init();

        this.metaData = this.decrypt(object, Constant.base_key);
    }

    public set(key: string, data: any): void {
        this._get_meta();
        const data_key = this.generateRandomKey();
        let keys = this.metaData.array;
        keys.set(key,data_key);

        let encryptedData:string = this.encrypt(data, Constant.base_key);
        localStorage.setItem(key, encryptedData);
    }

    public get(key: string): any | null {
        let data: any = localStorage.getItem(key)
        if (data != null) {
            return this.decrypt(data, Constant.base_key);
        }
        return null;
    }

    public remove(key: string) {
        localStorage.removeItem(key);
    }

    public clean(): void {
        localStorage.clear();
    }

    private encrypt(data: string | any, secretKey: string): string {
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

    private decrypt(encryptedData: string | null, secretKey: string): any {
        if(encryptedData==null) return null;
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