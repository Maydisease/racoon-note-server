import {_NoteCategory} from '../../../../entities/note.category.entity';
import {_NoteArticle}  from '../../../../entities/note.article.entity';
import {Connection}    from 'typeorm';

export class CategoryModel {

    public tableNoteCategory;
    public tableNoteArticle;

    constructor(private readonly connection: Connection) {
        this.tableNoteCategory = _NoteCategory;
        this.tableNoteArticle  = _NoteArticle;
    }

    // 获取分类数据
    getCategoryData(uid): Promise<object> {
        return this.connection.getRepository(this.tableNoteCategory).find(
            {
                select: ["id", "name", "parent"],
                where : [{uid}]
            }
        );
    }

    // 验证category父级是否存在
    verifyCategoryParentExist(uid: string, parent: number): Promise<number> {
        return this.connection
                   .getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where("uid = :uid", {uid: uid})
                   .andWhere("id = :parent", {parent: parent})
                   .printSql()
                   .getCount();
    }

    // 验证以categoryId为条件的分类是否存在
    verifyCategoryIdExist(id: number): Promise<number> {
        return this.connection
                   .getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where("id = :id", {id: id})
                   .getCount();
    }

    // 验证当前分类是否存在子分类
    verifyExistSonCategory(id): Promise<number> {
        return this.connection
                   .getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where("parent = :id", {id: id})
                   .getCount();
    }

    // 验证当前分类是否存在文章
    verifyExistArticle(id): Promise<number> {
        return this.connection
                   .getRepository(this.tableNoteArticle)
                   .createQueryBuilder()
                   .where("cid = :id", {id: id})
                   .andWhere("disable = :disable", {disable: 0})
                   .getCount();
    }

    // 验证用户是否存在于表中
    verifyCategoryExist(name: string, uid: string, parent: number): Promise<number> {
        return this.connection
                   .getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where("binary name = :name", {name: name})
                   .andWhere("uid = :uid", {uid: uid})
                   .andWhere("parent = :parent", {parent: parent})
                   .printSql()
                   .getCount();
    }

    // 插入数据
    addCategoryData(params: object): Promise<object> {
        return this.connection
                   .createQueryBuilder()
                   .insert()
                   .into(this.tableNoteCategory)
                   .values([params])
                   .printSql()
                   .execute();
    }

    // 更改分类名
    renameCategory(id: number, name: string, updatetime: number, uid: string): Promise<object> {
        return this.connection.createQueryBuilder()
                   .update(this.tableNoteCategory)
                   .set({name: name, updateTime: updatetime})
                   .where("id = :id", {id: id})
                   .andWhere("uid = :uid", {uid: uid})
                   .execute();
    }

    removeCategory(id: number, uid: string): Promise<object> {
        return this.connection.createQueryBuilder()
                   .delete()
                   .from(this.tableNoteCategory)
                   .where("id = :id", {id: id})
                   .andWhere("uid = :uid", {uid: uid})
                   .execute();
    }

    removeMultipleCategory(id: Array<number>, uid: string): Promise<object> {
        return this.connection.createQueryBuilder()
                   .delete()
                   .from(this.tableNoteCategory)
                   .where("id in(:...id)", {id: id})
                   .andWhere("uid = :uid", {uid: uid})
                   .execute();
    }
}