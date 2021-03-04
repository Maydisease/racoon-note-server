import {Injectable} from '@nestjs/common';
import {Connection, getConnection} from 'typeorm';
import {CategoryModel, GetCategoryListModal} from './category.model';

@Injectable()
export class CategoryService {

	public connection: Connection;
	public categoryModal: CategoryModel;

	constructor() {
		this.connection = getConnection();
		this.categoryModal = new CategoryModel(this.connection);
	}

	// 更新文章数据
	public getCategoryList(uid: string): Promise<GetCategoryListModal> {
		return this.categoryModal.getCategoryList(uid);
	}

	// 通过[分类ID]验证指定分类是否存在.
	public async verifyCategoryIsExist(cid: number, uid: string): Promise<boolean> {
		return await this.categoryModal.verifyCategoryIsExist(cid, uid) >= 1;
	}

	// 通过[分类名]验证指定分类是否存在.
	public async verifyCategoryNameIsExist(cateName: string, uid: string) {
		return await this.categoryModal.verifyCategoryNameIsExist(cateName, uid) >= 1;
	}

	// 添加分类
	public addCategory(params: object) {
		return this.categoryModal.addCategory(params);
	}

	// 删除指定分类.
	public removeCategory(cateId: number, uid: string) {
		return this.categoryModal.removeCategory(cateId, uid);
	}

}
