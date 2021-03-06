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
                select: ['id', 'name', 'parent', 'iconText', 'is_super'],
                where : [{uid}],
                order : {
                    is_super : "DESC",
                    inputTime: "ASC"
                }
            },
        );
    }

    // 验证category父级是否存在
    verifyCategoryParentExist(uid: string, parent: number): Promise<number> {
        return this.connection
                   .getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where('uid = :uid', {uid})
                   .andWhere('id = :parent', {parent})
                   .printSql()
                   .getCount();
    }

    // 验证以categoryId为条件的分类是否存在
    verifyCategoryIdExist(id: number): Promise<number> {
        return this.connection
                   .getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where('id = :id', {id})
                   .getCount();
    }

    // 验证当前分类是否存在子分类
    verifyExistSonCategory(id): Promise<number> {
        return this.connection
                   .getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where('parent = :id', {id})
                   .getCount();
    }

    // 验证当前分类是否存在文章
    verifyExistArticle(id): Promise<number> {
        return this.connection
                   .getRepository(this.tableNoteArticle)
                   .createQueryBuilder()
                   .where('cid = :id', {id})
                   .andWhere('disable = :disable', {disable: 0})
                   .getCount();
    }

    // 验证用户是否存在于表中
    verifyCategoryExist(name: string, uid: string, parent: number): Promise<number> {
        return this.connection
                   .getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where('binary name = :name', {name})
                   .andWhere('uid = :uid', {uid})
                   .andWhere('parent = :parent', {parent})
                   .printSql()
                   .getCount();
    }

    // 验证当前分类是否是超级分类
    verifyCategoryIsSuper(id: number) {
        return this.connection
                   .getRepository(this.tableNoteCategory)
                   .createQueryBuilder()
                   .where('id = :id', {id})
                   .andWhere('is_super = :is_super', {is_super: 1})
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
    renameCategory(id: number, name: string, updateTime: number, uid: string): Promise<object> {

        const body: any = {name, updateTime};

        return this.connection.createQueryBuilder()
                   .update(this.tableNoteCategory)
                   .set(body)
                   .where('id = :id', {id})
                   .andWhere('uid = :uid', {uid})
                   .execute();
    }

    // 删除指定分类
    removeCategory(id: number, uid: string): Promise<object> {
        return this.connection.createQueryBuilder()
                   .delete()
                   .from(this.tableNoteCategory)
                   .where('id = :id', {id})
                   .andWhere('uid = :uid', {uid})
                   .execute();
    }

    // 删除多个分类
    removeMultipleCategory(id: number[], uid: string): Promise<object> {
        return this.connection.createQueryBuilder()
                   .delete()
                   .from(this.tableNoteCategory)
                   .where('id in(:...id)', {id})
                   .andWhere('uid = :uid', {uid})
                   .execute();
    }

    // 更新指定分类的icon
    updateCategoryIcon(id: number, uid: string, iconText: string, updateTime: number) {
        const body: any = {iconText, updateTime};
        return this.connection.createQueryBuilder()
                   .update(this.tableNoteCategory)
                   .set(body)
                   .where('id = :id', {id})
                   .andWhere('uid = :uid', {uid})
                   .execute();
    }
}
