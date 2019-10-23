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

    public updateArticleData(id: number, params: object): Promise<object> {
        return new ArticleModel(this.connection).updateArticleData(id, params);
    }

    public updateArticleShareConf(id: number, params: object): Promise<object> {
        return new ArticleModel(this.connection).updateArticleShareConf(id, params);
    }

    public updateArticleShareCode(id: number, params: object): Promise<object> {
        return new ArticleModel(this.connection).updateArticleShareCode(id, params);
    }

    public getArticleList(cid: number, uid: string, disable: number) {
        return new ArticleModel(this.connection).getArticleList(cid, uid, disable);
    }

    public getArticleData(id: number, uid: string) {
        return new ArticleModel(this.connection).getArticleData(id, uid);
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

    public getTrashArticleData(uid: string, disable: number): Promise<object> {
        return new ArticleModel(this.connection).getTrashArticleData(uid, disable);
    }

    public getTrashArticleDetail(id: number, uid: string) {
        return new ArticleModel(this.connection).getTrashArticleDetail(id, uid);
    }

    public removeTrashArticle(id: number, uid: string) {
        return new ArticleModel(this.connection).removeTrashArticle(id, uid);
    }

    public getTmpCategoryId(uid: string) {
        return new ArticleModel(this.connection).getTmpCategoryId(uid);
    }

    public resetTrashArticleToTmpCategory(id: number, uid: string, cid: number, updateTime: number) {
        return new ArticleModel(this.connection).resetTrashArticleToTmpCategory(id, uid, cid, updateTime);
    }
}
