import {_Attached}  from '../../../entities/attached.entity';
import {Connection} from 'typeorm';
// todo
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

export class AttachedModel {

    public tableAttached;

    constructor(private readonly connection: Connection) {
        this.tableAttached  = _Attached;
    }

    // 查询附件
    getAttached(uid: string) {
        console.log(789, uid);
        return this.connection.getRepository(this.tableAttached)
                   .createQueryBuilder()
                   .andWhere("uid = :uid", {uid: uid})
                   .orderBy("id", "DESC")
                   .getMany();
    }

    // 添加附件
    addAttached(params: object): Promise<object> {
        return this.connection
                   .createQueryBuilder()
                   .insert()
                   .into(this.tableAttached)
                   .values([params])
                   .execute();
    }

    // 删除附件
    removeAttached(ids: Array<number>, uid: string): Promise<object> {
        return this.connection.createQueryBuilder()
                   .delete()
                   .from(this.tableAttached)
                   .where("id in(:...id)", {id: ids})
                   .andWhere("uid = :uid", {uid: uid})
                   .execute();
    }
}