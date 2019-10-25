import {Injectable}                from '@nestjs/common';
import {ShareModel}                from './share.model';
import {Connection, getConnection} from 'typeorm';

@Injectable()
export class ShareService {

    public secret: string;
    public connection: Connection;

    constructor() {
        this.connection = getConnection();
        this.secret     = 'note';
    }

    // 获取文章数据
    public getArticleData(id: number, uid: string): Promise<object> {
        return new ShareModel(this.connection).getArticleData(id, uid);
    }

    // 获取加密的文章数据
    public getSecretArticleData(id: number, uid: string, share_code: string): Promise<object> {
        return new ShareModel(this.connection).getSecretArticleData(id, uid, share_code);
    }


}
