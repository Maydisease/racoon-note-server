import {Injectable}                from '@nestjs/common';
import {Connection, getConnection} from 'typeorm';
import {ArticleModel}              from './article.model';

@Injectable()
export class ArticleService {

    public connection: Connection;

    constructor() {
        this.connection = getConnection();
    }

    public async verifyArticleExist(id: number, uid: string): Promise<boolean> {
        return await new ArticleModel(this.connection).verifyArticleExist(id, uid) >= 1;
    }

    public async verifyUserExist(uid: string): Promise<boolean> {
        return await new ArticleModel(this.connection).verifyUserExist(uid) >= 1;
    }

    public async verifyCategoryExist(cid: number): Promise<boolean> {
        return await new ArticleModel(this.connection).verifyCategoryExist(cid) >= 1;
    }

    public addArticleData(params: object): Promise<object> {
        return new ArticleModel(this.connection).addArticleData(params);
    }

    public updateArticleData(id: number, params: object) {
        return new ArticleModel(this.connection).updateArticleData(id, params);
    }

    public getArticleData(cid: number, uid: string, disable: number) {
        return new ArticleModel(this.connection).getArticleData(cid, uid, disable);
    }

    public setArticleDisableState(id: number, uid: string, disable: number, updateTime: number) {
        return new ArticleModel(this.connection).setArticleDisableState(id, uid, disable, updateTime);
    }

    public setArticleLockState(id: number, uid: string, lock: number, updateTime: number) {
        return new ArticleModel(this.connection).setArticleLockState(id, uid, lock, updateTime);
    }

    public getCategoryData(uid: string) {
        return new ArticleModel(this.connection).getCategoryData(uid);
    }

    public getSearchData(uid: string, keys: string, type: string, disable: number, lock: number) {
        return new ArticleModel(this.connection).getSearchData(uid, keys, type, disable, lock);
    }
}
