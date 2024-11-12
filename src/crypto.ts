import {lib, enc} from 'crypto-js'
export class Crypto{

    public generateRandomKey(length: number = 60): string {
        const randomBytes = lib.WordArray.random(length / 2);
        return enc.Hex.stringify(randomBytes);
    }
}