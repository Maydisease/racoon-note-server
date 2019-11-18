import {_NoteArticle}                 from '../../../../entities/note.article.entity';
import {_NoteCategory}                from '../../../../entities/note.category.entity';
import {_User}                        from '../../../../entities/user.entity';
import {Connection, Like, In, Binary} from 'typeorm';

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
    verifyCategoryExist(cid: number, uid: string) {
        return this.connection
                   .getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where('id = :cid', {cid})
                   .andWhere('uid = :uid', {uid})
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

        const updateBody: any = {
            uid       : params.uid,
            updateTime: params.updateTime,
        };

        if (params.title) {
            updateBody.title = params.title;
        }

        if (params.markdown_content) {
            updateBody.markdown_content = params.markdown_content;
        }

        if (params.markdown_content) {
            updateBody.html_content = params.html_content;
        }

        if (params.description) {
            updateBody.description = params.description;
        }

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(updateBody)
                   .where('id = :id', {id})
                   .execute();
    }

    // 更新文章分享面板上的参数
    public updateArticleShareConf(id: number, params: any) {

        const updateBody: any = {
            uid       : params.uid,
            updateTime: params.updateTime
        };

        if (params.on_share === 0 || params.on_share === 1) {
            updateBody.on_share = params.on_share;
        }

        if (params.use_share_code === 0 || params.use_share_code === 1) {
            updateBody.use_share_code = params.use_share_code;
        }

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(updateBody)
                   .where('id = :id', {id})
                   .execute();
    }

    // 跟新文章分享面板上的ShareCode
    public updateArticleShareCode(id: number, params: any) {
        const updateBody: any = {
            share_code: params.share_code,
            updateTime: params.updateTime
        };

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(updateBody)
                   .where('id = :id', {id})
                   .execute();
    }

    // 设置文章的禁用状态
    public setArticleDisableState(id: number, uid: string, disable: number, updateTime: number) {
        const updateBody: any = {
            disable,
            updateTime,
        };

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(updateBody)
                   .where('id = :id', {id})
                   .andWhere('uid = :uid', {uid})
                   .execute();
    }

    // 设置文章的锁定状态(分享)
    public setArticleLockState(id: number, uid: string, lock: number, updateTime: number) {
        const updateBody: any = {
            lock,
            updateTime,
        };

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(updateBody)
                   .where('id = :id', {id})
                   .andWhere('uid = :uid', {uid})
                   .execute();
    }

    // 获取文章分类信息
    public getUserCategoryData(uid: string) {
        return this.connection.getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where('uid = :uid', {uid})
                   .orderBy('id', 'DESC')
                   .getMany();
    }

    // 获取搜索数据
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

    // 获取垃圾箱的文章列表
    public getTrashArticleData(uid: string, disable: number) {
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

    // 获取垃圾箱的文章详情
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

    // 彻底粉碎指定文章
    public removeTrashArticle(id: number, uid: string) {
        return this.connection.createQueryBuilder()
                   .delete()
                   .from(this.tableNoteArticle)
                   .where('id = :id', {id})
                   .andWhere('uid = :uid', {uid})
                   .execute();
    }

    // 获取tmp分类的分类id
    public getTmpCategoryId(uid: string) {
        return this.connection.getRepository(this.tableNoteCategory)
                   .findOne(
                       {
                           select: ['id'],
                           where : [{uid, is_super: 1, fn_code: 'tmp'}]
                       }
                   );
    }

    // 重置垃圾箱中找不到分类的文章到tmp分类下
    public resetTrashArticleToTmpCategory(id: number, uid: string, cid: number, updateTime: number) {
        const updateBody: any = {
            cid       : cid,
            updateTime: updateTime,
            disable   : 0
        };

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(updateBody)
                   .where('id = :id', {id})
                   .andWhere('uid = :uid', {uid})
                   .execute();
    }

    // 快捷搜索 -> 搜索标题
    public getQuickSearchDataList(keys: string, sonCategoryIds: number[]) {
        return this.connection.getRepository(this.tableNoteArticle).find(
            {
                select: ['id', 'cid', 'title', 'description', 'lock', 'on_share', 'use_share_code', 'share_code', 'updateTime'],
                where : [{cid: In(sonCategoryIds), disable: 0, title: Like(`%${keys}%`)}],
                order : {
                    id: "DESC"
                }
            }
        )
    }

    // 移动文章到指定分类下
    public moveArticleToCategory(aid: number, cid: number, uid: string, updateTime: number) {
        const updateBody: any = {
            cid,
            updateTime
        };

        return this.connection
                   .createQueryBuilder()
                   .update(this.tableNoteArticle)
                   .set(updateBody)
                   .where('id = :aid', {aid})
                   .andWhere('uid = :uid', {uid})
                   .execute();
    }
}
