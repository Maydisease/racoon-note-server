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

    public getCategoryData(uid: string): Promise<object> {
        return new CategoryModel(this.connection).getCategoryData(uid);
    }

    public async verifyCategoryParentExist(uid: string, parent: number): Promise<boolean> {
        return await new CategoryModel(this.connection).verifyCategoryParentExist(uid, parent) >= 1
    }

    public async verifyCategoryIdExist(id: number): Promise<boolean> {
        return await new CategoryModel(this.connection).verifyCategoryIdExist(id) >= 1
    }

    public async verifyCategoryExist(name: string, uid: string, parent: number): Promise<boolean> {
        return await new CategoryModel(this.connection).verifyCategoryExist(name, uid, parent) >= 1
    }

    public addCategoryData(params: object): Promise<object> {
        return new CategoryModel(this.connection).addCategoryData(params)
    }

    public renameCategory(id: number, name: string, updatetime: number, uid: string): Promise<object> {
        return new CategoryModel(this.connection).renameCategory(id, name, updatetime, uid);
    }

    public removeCategory(id: number, uid: string): Promise<object> {
        return new CategoryModel(this.connection).removeCategory(id, uid);
    }

    public removeMultipleCategory(id: Array<number>, uid: string): Promise<object> {
        return new CategoryModel(this.connection).removeMultipleCategory(id, uid);
    }

    public async verifyExistSonCategory(id: number): Promise<boolean> {
        return await new CategoryModel(this.connection).verifyExistSonCategory(id) >= 1;
    }

    public async verifyExistArticle(id: number): Promise<boolean> {
        return await new CategoryModel(this.connection).verifyExistArticle(id) >= 1;
    }
}