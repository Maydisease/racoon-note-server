import {_NoteArticle}     from '../../../../entities/note.article.entity';
import {_NoteCategory}    from '../../../../entities/note.category.entity';
import {_User}            from '../../../../entities/user.entity';
import {Connection, Like} from 'typeorm';

interface ArticleUpdateParams {
    title?: string,
    uid?: string,
    cid?: number,
    markdown_content?: string,
    html_content?: string,
    updateTime?: string
}

interface ArticleDisableStateParams {
    disable: number,
    updateTime: number
}

export class ArticleModel {

    public tableNoteArticle;
    public tableNoteCategory;
    public tableUser;

    constructor(private readonly connection: Connection) {
        this.tableNoteArticle  = _NoteArticle;
        this.tableNoteCategory = _NoteCategory;
        this.tableUser         = _User;
    }

    getArticleData(cid: number, uid: string, disable: number) {
        return this.connection.getRepository(this.tableNoteArticle)
                   .createQueryBuilder()
                   .where("cid = :cid", {cid: cid})
                   .andWhere("uid = :uid", {uid: uid})
                   .andWhere("disable = :disable", {disable: disable})
                   .orderBy("id", "DESC")
                   .getMany();
    }

    verifyArticleExist(id: number, uid: string) {
        return this.connection
                   .getRepository(this.tableNoteArticle)
                   .createQueryBuilder()
                   .where("id = :id", {id: id})
                   .andWhere("uid = :uid", {uid: uid})
                   .getCount();
    }

    // 查询_NoteCategory表，是否存在当前用户对应的分类
    verifyCategoryExist(cid: number) {
        return this.connection
                   .getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where("id = :cid", {cid: cid})
                   .getCount();
    }

    // 查询_User表，是否存在当前用户
    verifyUserExist(uid: string) {
        return this.connection
                   .getRepository(this.tableUser)
                   .createQueryBuilder()
                   .where("userId = :uid", {uid: uid})
                   .getCount();
    }

    // 插入文章数据到tableNoteArticle表
    addArticleData(params: object): Promise<object> {
        return this.connection
                   .createQueryBuilder()
                   .insert()
                   .into(this.tableNoteArticle)
                   .values([params])
                   .execute();
    }

    // 更新文章数据到tableNoteArticle表
    updateArticleData(id: number, params: ArticleUpdateParams) {

        const setBody: any = {
            uid       : params.uid,
            updateTime: params.updateTime
        };

        if (params.title) {
            setBody.title = params.title;
        }

        if (params.markdown_content) {
            setBody.markdown_content = params.markdown_content;
        }

        if (params.markdown_content) {
            setBody.html_content = params.html_content;
        }

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(setBody)
                   .where("id = :id", {id: id})
                   .execute();


    }

    public setArticleDisableState(id: number, uid: string, disable: number, updateTime: number) {
        const setBody: any = {
            disable,
            updateTime
        };

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(setBody)
                   .where("id = :id", {id: id})
                   .andWhere("uid = :uid", {uid: uid})
                   .execute();
    }

    public setArticleLockState(id: number, uid: string, lock: number, updateTime: number) {
        const setBody: any = {
            lock,
            updateTime
        };

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(setBody)
                   .where("id = :id", {id: id})
                   .andWhere("uid = :uid", {uid: uid})
                   .execute();
    }

    public getCategoryData(uid: string) {
        return this.connection.getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where("uid = :uid", {uid: uid})
                   .orderBy("id", "DESC")
                   .getMany();
    }

    public getSearchData(uid, keys, type, disable, lock) {

        const where = {
            uid,
            disable,
            lock
        };

        where[type] = Like(`%${keys}%`);

        const order = {};
        order[type] = 'DESC';

        return this.connection.getRepository(this.tableNoteArticle).find({where, order})
    }
}