import {Injectable}                from '@nestjs/common';
import {Connection, getConnection} from 'typeorm';
import {ArticleModel}              from './article.model';

@Injectable()
export class ArticleService {

    public connection: Connection;

    constructor() {
        this.connection = getConnection();
    }

    // 验证文章是否存在
    public async verifyArticleExist(id: number, uid: string): Promise<boolean> {
        return await new ArticleModel(this.connection).verifyArticleExist(id, uid) >= 1;
    }

    // 验证用户是否存在
    public async verifyUserExist(uid: string): Promise<boolean> {
        return await new ArticleModel(this.connection).verifyUserExist(uid) >= 1;
    }

    // 验证当前分类是否存在
    public async verifyCategoryExist(cid: number, uid: string): Promise<boolean> {
        return await new ArticleModel(this.connection).verifyCategoryExist(cid, uid) >= 1;
    }

    // 添加文章数据
    public addArticleData(params: object): Promise<object> {
        return new ArticleModel(this.connection).addArticleData(params);
    }

    // 更新文章数据
    public updateArticleData(id: number, params: object): Promise<object> {
        return new ArticleModel(this.connection).updateArticleData(id, params);
    }

    // 跟新文章分享配置参数
    public updateArticleShareConf(id: number, params: object): Promise<object> {
        return new ArticleModel(this.connection).updateArticleShareConf(id, params);
    }

    // 跟新文章分享shareCode
    public updateArticleShareCode(id: number, params: object): Promise<object> {
        return new ArticleModel(this.connection).updateArticleShareCode(id, params);
    }

    // 获取文章列表数据
    public getArticleList(cid: number, uid: string, disable: number) {
        return new ArticleModel(this.connection).getArticleList(cid, uid, disable);
    }

    // 获取文章详情数据
    public getArticleData(id: number, uid: string) {
        return new ArticleModel(this.connection).getArticleData(id, uid);
    }

    // 设置文章禁用状态
    public setArticleDisableState(id: number, uid: string, disable: number, updateTime: number) {
        return new ArticleModel(this.connection).setArticleDisableState(id, uid, disable, updateTime);
    }

    // 设置文章锁定状态
    public setArticleLockState(id: number, uid: string, lock: number, updateTime: number) {
        return new ArticleModel(this.connection).setArticleLockState(id, uid, lock, updateTime);
    }

    // 获取分类数据
    public getUserCategoryData(uid: string) {
        return new ArticleModel(this.connection).getUserCategoryData(uid);
    }

    // 获取搜索数据
    public getSearchData(uid: string, keys: string, type: string, disable: number, lock: number) {
        return new ArticleModel(this.connection).getSearchData(uid, keys, type, disable, lock);
    }

    // 获取垃圾箱文章列表数据
    public getTrashArticleData(uid: string, disable: number): Promise<object> {
        return new ArticleModel(this.connection).getTrashArticleData(uid, disable);
    }

    // 获取垃圾箱文章详情
    public getTrashArticleDetail(id: number, uid: string) {
        return new ArticleModel(this.connection).getTrashArticleDetail(id, uid);
    }

    // 粉碎垃圾箱内指定的文章
    public removeTrashArticle(id: number, uid: string) {
        return new ArticleModel(this.connection).removeTrashArticle(id, uid);
    }

    // 将垃圾箱内的无分类指定文章移动到tmp分类下
    public getTmpCategoryId(uid: string) {
        return new ArticleModel(this.connection).getTmpCategoryId(uid);
    }

    // 重置垃圾箱中指定文章到它原本的分类下
    public resetTrashArticleToTmpCategory(id: number, uid: string, cid: number, updateTime: number) {
        return new ArticleModel(this.connection).resetTrashArticleToTmpCategory(id, uid, cid, updateTime);
    }

    // 快捷搜索 -> 搜索标题
    public getQuickSearchDataList(title: string, sonCategoryIds: number[]) {
        return new ArticleModel(this.connection).getQuickSearchDataList(title, sonCategoryIds);
    }

    // 移动文章到指定分类下
    public moveArticleToCategory(aid: number, cid: number, uid: string, updateTime: number): Promise<object> {
        return new ArticleModel(this.connection).moveArticleToCategory(aid, cid, uid, updateTime);
    }
}
