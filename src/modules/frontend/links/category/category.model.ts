import {Connection} from 'typeorm';
import {_LinkCategory} from '../../../../entities/link.category.entity';

export type GetCategoryListModal = {
	id: number;
	name: string;
	updateTime: string;
}[] | unknown[];

export class CategoryModel {

	public tableUser;
	public tableLinkCategory;

	constructor(private readonly connection: Connection) {
		this.tableLinkCategory = _LinkCategory;
	}

	// 获取文章列表
	public getCategoryList(uid: string): Promise<GetCategoryListModal> {
		return this.connection.getRepository(this.tableLinkCategory).find(
			{
				select: ['id', 'name', 'updateTime'],
				where: [{uid}],
				order: {
					updateTime: 'DESC'
				}
			}
		);
	}

	// 通过[分类ID]验证指定分类是否存在.
	public verifyCategoryIsExist(cid: number, uid: string) {
		return this.connection
		           .getRepository(this.tableLinkCategory)
		           .createQueryBuilder()
		           .where('id = :cid', {cid})
		           .andWhere('uid = :uid', {uid})
		           .getCount();
	}

	// 通过[分类名]验证指定分类是否存在.
	public verifyCategoryNameIsExist(cateName: string, uid: string) {
		return this.connection
		           .getRepository(this.tableLinkCategory)
		           .createQueryBuilder()
		           .where('name = :cateName', {cateName})
		           .andWhere('uid = :uid', {uid})
		           .getCount();
	}


	// 添加指定分类
	public addCategory(params) {
		return this.connection
		           .createQueryBuilder()
		           .insert()
		           .into(this.tableLinkCategory)
		           .values([params])
		           .printSql()
		           .execute();
	}

	// 移除指定分类
	public removeCategory(cateId: number, uid: string) {
		return this.connection
		           .createQueryBuilder()
		           .delete()
		           .from(this.tableLinkCategory)
		           .where('id = :cateId', {cateId})
		           .andWhere('uid = :uid', {uid})
		           .execute();
	}


}
