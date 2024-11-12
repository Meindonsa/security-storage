import {Constant} from "./constant";

export class SecurityStorage {
    constructor() {}

    getBaseKey(){
        return Constant.base_key;
    }
}