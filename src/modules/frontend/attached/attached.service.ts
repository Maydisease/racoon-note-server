import {Injectable}                from '@nestjs/common';
import {Connection, getConnection} from 'typeorm';
import {AttachedModel}             from "./attached.model";
// todo
@Injectable()
export class AttachedService {

    public connection: Connection;

    constructor() {
        this.connection = getConnection();
    }

    public getAttached(uid: string): Promise<object> {
        return new AttachedModel(this.connection).getAttached(uid)
    }

    public async addAttached(params: object): Promise<object> {
        return await new AttachedModel(this.connection).addAttached(params)
    }

    public async removeAttached(ids: Array<number>, uid: string) {
        return await new AttachedModel(this.connection).removeAttached(ids, uid)
    }
}