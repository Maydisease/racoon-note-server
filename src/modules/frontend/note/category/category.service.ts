import {Injectable}                from '@nestjs/common';
import {CategoryModel}             from './category.model';
import {Connection, getConnection} from 'typeorm';

@Injectable()
export class CategoryService {

    public secret: string;
    public connection: Connection;

    constructor() {
        this.connection = getConnection();
        this.secret     = 'note';
    }

    // 获取分类列表数据
    public getCategoryData(uid: string): Promise<object> {
        return new CategoryModel(this.connection).getCategoryData(uid);
    }

    // 验证指定分类是否有父级分类
    public async verifyCategoryParentExist(uid: string, parent: number): Promise<boolean> {
        return await new CategoryModel(this.connection).verifyCategoryParentExist(uid, parent) >= 1;
    }

    // 验证指定分类是否存在
    public async verifyCategoryIdExist(id: number): Promise<boolean> {
        return await new CategoryModel(this.connection).verifyCategoryIdExist(id) >= 1;
    }

    // 验证用户是否存在于分类表中
    public async verifyCategoryExist(name: string, uid: string, parent: number): Promise<boolean> {
        return await new CategoryModel(this.connection).verifyCategoryExist(name, uid, parent) >= 1;
    }

    // 验证指定分类是否是超级分类
    public async verifyCategoryIsSuper(id: number): Promise<boolean> {
        return await new CategoryModel(this.connection).verifyCategoryIsSuper(id) >= 1;
    }

    // 添加分类数据
    public addCategoryData(params: object): Promise<object> {
        return new CategoryModel(this.connection).addCategoryData(params);
    }

    // 分类改名
    public renameCategory(id: number, name: string, updatetime: number, uid: string): Promise<object> {
        return new CategoryModel(this.connection).renameCategory(id, name, updatetime, uid);
    }

    // 删除分类
    public removeCategory(id: number, uid: string): Promise<object> {
        return new CategoryModel(this.connection).removeCategory(id, uid);
    }

    // 删除多个分类
    public removeMultipleCategory(id: number[], uid: string): Promise<object> {
        return new CategoryModel(this.connection).removeMultipleCategory(id, uid);
    }

    // 验证指定分类是否有子分类
    public async verifyExistSonCategory(id: number): Promise<boolean> {
        return await new CategoryModel(this.connection).verifyExistSonCategory(id) >= 1;
    }

    // 验证文章是否存在
    public async verifyExistArticle(id: number): Promise<boolean> {
        return await new CategoryModel(this.connection).verifyExistArticle(id) >= 1;
    }

    // 更新指定分类的icon
    public updateCategoryIcon(id: number, uid: string, iconText: string, updateTime: number): Promise<object> {
        return new CategoryModel(this.connection).updateCategoryIcon(id, uid, iconText, updateTime);
    }
}
