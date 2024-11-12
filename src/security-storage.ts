import {Constant} from "./constant";
import {enc, lib} from "crypto-js";

export class SecurityStorage {
    constructor() {}

    getBaseKey(): string{
        return this.generateRandomKey();
    }

    private generateRandomKey(length: number = 60): string {
        const randomBytes = lib.WordArray.random(length / 2);
        return enc.Hex.stringify(randomBytes);
    }
}