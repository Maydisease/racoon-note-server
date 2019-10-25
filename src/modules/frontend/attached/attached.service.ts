import {Injectable}                from '@nestjs/common';
import {Connection, getConnection} from 'typeorm';
import {AttachedModel}             from './attached.model';

@Injectable()
export class AttachedService {

    public connection: Connection;

    constructor() {
        this.connection = getConnection();
    }

    // 获取附件数据列表
    public getAttached(uid: string): Promise<object> {
        return new AttachedModel(this.connection).getAttached(uid);
    }

    // 获取附件类型
    public getAttachedType(id: number): Promise<object> {
        return new AttachedModel(this.connection).getAttachedType(id);
    }

    // 添加附件
    public async addAttached(params: object): Promise<object> {
        return await new AttachedModel(this.connection).addAttached(params);
    }

    // 删除附件
    public async removeAttached(ids: number[], uid: string) {
        return await new AttachedModel(this.connection).removeAttached(ids, uid);
    }
}
