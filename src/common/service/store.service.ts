import {Injectable} from "@nestjs/common";

type storeKeyType = 'forgetPasswordCode';

interface ForgetPasswordCode {
    'number': {
        username: string
        expireDate: number
    }
}

@Injectable()
class StoreService {

    public storeList = {};

    constructor() {
        this.storeList['forgetPasswordCode'] = {};
    }

    public put(type: storeKeyType, key: string, value: any) {
        this.storeList[type][key] = value;
    }

    public remove(type: storeKeyType, key: string) {
        delete this.storeList[type][key];
    }
}

const storeService = new StoreService();

export {storeService}
