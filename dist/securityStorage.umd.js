(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('crypto-js'), require('lz-string')) :
    typeof define === 'function' && define.amd ? define(['exports', 'crypto-js', 'lz-string'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SecurityStorage = {}, global.CryptoJS, global.LZString));
})(this, (function (exports, cryptoJs, lzString) { 'use strict';

    const Constant = {
        keys_name: "_security_storage_meta_data",
        base_key: "ABCDEFGHIJKLMNOPQRSTUVWXYZ#abcdefghijklmnopqrstuvwxyz@0123456789",
        iv: "8f3e5abe9f0406905fd09f8e8d5b30d8",
    };

    class SecurityStorage {
        constructor(secretKey = null) {
            this.metaStore = null;
            this.encryptionKey = secretKey !== null && secretKey !== void 0 ? secretKey : Constant.base_key;
            this.init();
        }
        init() {
            let encrypted = localStorage.getItem(Constant.keys_name);
            if (encrypted == null) {
                console.log("IS NULL");
                this.metaStore = {
                    _keyStr: this.generateRandomKey(),
                    array: {},
                };
                this.encryptMetaData(this.metaStore);
            }
            else {
                if (this.metaStore == null) {
                    this.metaStore = this.decrypt(encrypted, this.encryptionKey);
                }
            }
        }
        encryptMetaData(data) {
            console.log("META", data);
            const encrypted = this.encrypt(data, this.encryptionKey);
            localStorage.setItem(Constant.keys_name, encrypted);
        }
        setItem(key, data) {
            var _a;
            if (this.hasInvalidString(key, data)) {
                console.error("Opération impossible !");
                return;
            }
            if (this.metaStore == null)
                this.init();
            const newKey = this.generateRandomKey();
            const encrypted = this.encrypt(data, newKey);
            // @ts-ignore
            (_a = this.metaStore) === null || _a === void 0 ? void 0 : _a.array[key] = newKey;
            localStorage.setItem(key, encrypted);
            this.encryptMetaData(this.metaStore);
        }
        getItem(key) {
            var _a;
            if (this.hasInvalidString(key)) {
                console.error("Opération impossible !");
                return null;
            }
            if (this.metaStore == null)
                this.init();
            const encrypted = localStorage.getItem(key);
            if (encrypted == null)
                return null;
            const encryptKey = (_a = this.metaStore) === null || _a === void 0 ? void 0 : _a.array[key];
            if (!encryptKey)
                return null;
            return this.decrypt(encrypted, encryptKey);
        }
        removeItem(key) {
            var _a;
            if (this.hasInvalidString(key)) {
                console.error("Opération impossible !");
                return;
            }
            if (this.metaStore == null)
                this.init();
            localStorage.removeItem(key);
            (_a = this.metaStore) === null || _a === void 0 ? true : delete _a.array[key];
            this.encryptMetaData(this.metaStore);
        }
        clear() {
            localStorage.clear();
            this.init();
        }
        encrypt(data, secretKey) {
            try {
                const encryptedData = cryptoJs.AES.encrypt(JSON.stringify(data), secretKey, {
                    iv: cryptoJs.enc.Hex.parse(Constant.iv),
                    keySize: 256 / 32,
                    mode: cryptoJs.mode.CBC,
                    padding: cryptoJs.pad.Pkcs7,
                }).toString();
                return lzString.compressToUTF16(encryptedData);
            }
            catch (error) {
                console.error("Encryption error:", error);
                throw error;
            }
        }
        decrypt(encryptedData, secretKey) {
            try {
                const decompressedData = lzString.decompressFromUTF16(encryptedData);
                if (!decompressedData)
                    throw new Error("Decompression failed");
                const originalData = cryptoJs.AES.decrypt(decompressedData, secretKey, {
                    iv: cryptoJs.enc.Hex.parse(Constant.iv),
                    keySize: 256 / 32,
                    mode: cryptoJs.mode.CBC,
                    padding: cryptoJs.pad.Pkcs7,
                }).toString(cryptoJs.enc.Utf8);
                if (!originalData)
                    throw new Error("Decryption failed");
                return JSON.parse(originalData);
            }
            catch (error) {
                console.error("Decryption error:", error);
                throw error;
            }
        }
        generateRandomKey(length = 100) {
            const randomBytes = cryptoJs.lib.WordArray.random(length / 2);
            return cryptoJs.enc.Hex.stringify(randomBytes);
        }
        hasInvalidString(...strings) {
            if (strings === null || strings === undefined) {
                return true;
            }
            for (const string of strings) {
                if (string === null || string === undefined || string === '') {
                    return true;
                }
            }
            return false;
        }
    }

    exports.SecurityStorage = SecurityStorage;

}));
//# sourceMappingURL=securityStorage.umd.js.map
