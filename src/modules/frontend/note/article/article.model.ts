import {_NoteArticle}     from '../../../../entities/note.article.entity';
import {_NoteCategory}    from '../../../../entities/note.category.entity';
import {_User}            from '../../../../entities/user.entity';
import {Connection, Like} from 'typeorm';

interface ArticleUpdateParams {
    title?: string;
    uid?: string;
    cid?: number;
    markdown_content?: string;
    html_content?: string;
    description?: string;
    updateTime?: string;
}

interface ArticleShareConfUpdateParams {
    id?: number;
    uid?: string;
    on_share?: number;
    use_share_code?: number;
    updateTime: number;
}

interface ArticleShareCodeUpdateParams {
    id?: number;
    uid?: string;
    share_code: string;
    updateTime: number;
}

interface ArticleDisableStateParams {
    disable: number;
    updateTime: number;
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

    // 获取文章详情
    getArticleData(id: number, uid: string) {
        return this.connection.getRepository(this.tableNoteArticle).findOne(
            {
                where: [{id, uid}]
            }
        );
    }

    // 获取文章列表
    getArticleList(cid: number, uid: string, disable: number) {
        return this.connection.getRepository(this.tableNoteArticle).find(
            {
                select: ['id', 'cid', 'title', 'description', 'lock', 'on_share', 'use_share_code', 'share_code', 'updateTime'],
                where : [{cid, uid, disable}],
                order : {
                    id: "DESC"
                }
            }
        );
    }

    // 验证问政是否存在
    verifyArticleExist(id: number, uid: string) {
        return this.connection
                   .getRepository(this.tableNoteArticle)
                   .createQueryBuilder()
                   .where('id = :id', {id})
                   .andWhere('uid = :uid', {uid})
                   .getCount();
    }

    // 查询_NoteCategory表，是否存在当前用户对应的分类
    verifyCategoryExist(cid: number) {
        return this.connection
                   .getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where('id = :cid', {cid})
                   .getCount();
    }

    // 查询_User表，是否存在当前用户
    verifyUserExist(uid: string) {
        return this.connection
                   .getRepository(this.tableUser)
                   .createQueryBuilder()
                   .where('userId = :uid', {uid})
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
            updateTime: params.updateTime,
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

        if (params.description) {
            setBody.description = params.description;
        }

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(setBody)
                   .where('id = :id', {id})
                   .execute();
    }

    public updateArticleShareConf(id: number, params: any) {

        const setBody: any = {
            uid       : params.uid,
            updateTime: params.updateTime
        };

        if (params.on_share === 0 || params.on_share === 1) {
            setBody.on_share = params.on_share;
        }

        if (params.use_share_code === 0 || params.use_share_code === 1) {
            setBody.use_share_code = params.use_share_code;
        }

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(setBody)
                   .where('id = :id', {id})
                   .execute();
    }

    public updateArticleShareCode(id: number, params: any) {
        const setBody: any = {
            share_code: params.share_code,
            updateTime: params.updateTime
        };

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(setBody)
                   .where('id = :id', {id})
                   .execute();
    }


    public setArticleDisableState(id: number, uid: string, disable: number, updateTime: number) {
        const setBody: any = {
            disable,
            updateTime,
        };

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(setBody)
                   .where('id = :id', {id})
                   .andWhere('uid = :uid', {uid})
                   .execute();
    }

    public setArticleLockState(id: number, uid: string, lock: number, updateTime: number) {
        const setBody: any = {
            lock,
            updateTime,
        };

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(setBody)
                   .where('id = :id', {id})
                   .andWhere('uid = :uid', {uid})
                   .execute();
    }

    public getCategoryData(uid: string) {
        return this.connection.getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where('uid = :uid', {uid})
                   .orderBy('id', 'DESC')
                   .getMany();
    }

    public getSearchData(uid, keys, type, disable, lock) {

        const where = {
            uid,
            disable,
            lock,
        };

        where[type] = Like(`%${keys}%`);

        const order = {};
        order[type] = 'DESC';

        return this.connection.getRepository(this.tableNoteArticle).find({where, order});
    }

    public getTrashArticleData(uid: string, disable: number) {
        console.log(uid, disable);
        return this.connection.getRepository(this.tableNoteArticle)
                   .find(
                       {
                           select: ['id', 'title'],
                           where : [{uid, disable}],
                           order : {
                               updateTime: "DESC"
                           }
                       }
                   );
    }

    public getTrashArticleDetail(id: number, uid: string) {
        return this.connection.getRepository(this.tableNoteArticle)
                   .findOne(
                       {
                           select: ['id', 'title', 'description', 'updateTime', 'cid'],
                           where : [{uid, id}],
                           order : {
                               id: "DESC"
                           }
                       }
                   );
    }

    public removeTrashArticle(id: number, uid: string) {
        return this.connection.createQueryBuilder()
                   .delete()
                   .from(this.tableNoteArticle)
                   .where('id = :id', {id})
                   .andWhere('uid = :uid', {uid})
                   .execute();
    }

    public getTmpCategoryId(uid: string) {
        return this.connection.getRepository(this.tableNoteCategory)
                   .findOne(
                       {
                           select: ['id'],
                           where : [{uid, is_super: 1, fn_code: 'tmp'}]
                       }
                   );
    }

    public resetTrashArticleToTmpCategory(id: number, uid: string, cid: number, updateTime: number) {
        const setBody: any = {
            cid       : cid,
            updateTime: updateTime,
            disable   : 0
        };

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(setBody)
                   .where('id = :id', {id})
                   .andWhere('uid = :uid', {uid})
                   .execute();
    }
}
