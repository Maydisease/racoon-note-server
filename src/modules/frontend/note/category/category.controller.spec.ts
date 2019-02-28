import {Test}               from '@nestjs/testing';
import {AppModule}          from '../../../../app.module';
import {CategoryController} from './category.controller';
import {CategoryService}    from './category.service';
import {EchoService}        from '../../../../common/service/echo.service';
import {ToolsService}       from '../../../../common/service/tools.service';

describe('CategoryController', () => {

    let categoryController: CategoryController;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports    : [AppModule],
            controllers: [CategoryController],
            providers  : [
                {provide: 'toolsService', useClass: ToolsService},
                {provide: 'categoryService', useClass: CategoryService},
                {provide: 'echoService', useClass: EchoService}
            ],
        }).compile();

        categoryController = module.get(CategoryController);
    });

    describe('getCategoryData', () => {

        it(`获取分类数据`, async () => {
            const response: any = await categoryController.getCategoryData({uid: 5});
            expect(response.messageCode).toBe(2000)
        });

    });

    describe('addCategoryData', () => {

        const name1 = undefined;

        it(`添加分类 - name字段不存在 name: ${name1}`, async () => {

            const timestamp = new Date().getTime();

            const body = {
                name  : name1,
                uid   : 5,
                parent: 0,
                count : 0
            };

            const response: any = await categoryController.addCategoryData(body, {});
            expect(response.messageCode).toBe(1100)
        });

        const name2 = 'nodejs && typescript && typescript && typescript';

        it(`添加分类 - 太长 name: ${name2}`, async () => {

            const timestamp = new Date().getTime();

            const body = {
                name  : name2,
                uid   : 5,
                parent: 0,
                count : 0
            };

            const response: any = await categoryController.addCategoryData(body, {});
            expect(response.messageCode).toBe(1100)
        });

        let randomCategoryName = 'tandongs' + Math.ceil(Math.random() * 10) + Math.ceil(Math.random() * 10) + Math.ceil(Math.random() * 10);

        it(`添加分类 - 成功 name: ${randomCategoryName}`, async () => {

            const body = {
                name  : randomCategoryName,
                uid   : 5,
                parent: 0,
                count : 0
            };

            const response: any = await categoryController.addCategoryData(body, {});
            expect(response.messageCode).toBe(2000)
        });

        it(`添加分类 - 重复 name: ${randomCategoryName}`, async () => {

            const timestamp = new Date().getTime();

            const body = {
                name  : randomCategoryName,
                uid   : 5,
                parent: 0,
                count : 0
            };

            const response: any = await categoryController.addCategoryData(body, {});
            expect(response.messageCode).toBe(1103)
        });

    });

    describe('renameCategory', () => {
        const newName1 = undefined;
        it(`修改分类名 - newName不存在 newName: ${newName1}`, async () => {

            const body = {
                id     : 123,
                newName: newName1,
                uid    : 5
            };

            const response: any = await categoryController.renameCategory(body, {});
            expect(response.messageCode).toBe(1100)
        });

        const newName2 = 'nue koooooooooooooooooooooooooooo';
        it(`修改分类名 - newName太长 newName: ${newName2}`, async () => {

            const body = {
                id     : 123,
                newName: newName2,
                uid    : 5
            };

            const response: any = await categoryController.renameCategory(body, {});
            expect(response.messageCode).toBe(1100)
        });

        const id1 = 123333;
        it(`修改分类名 - 被修改的分类不存在 id: ${id1}`, async () => {

            const body = {
                id     : id1,
                newName: 'newNameisOk',
                uid    : 5
            };

            const response: any = await categoryController.renameCategory(body, {});
            expect(response.messageCode).toBe(1104)
        });
    });

    describe('removeCategory', () => {
        const id1 = 'stringTypeId';
        it(`删除分类 - id的类型不受支持 id: ${id1}`, async () => {

            const body = {
                id     : id1,
                newName: 'newNameisOk',
                uid    : 5
            };

            const response: any = await categoryController.removeCategory(body, {});
            expect(response.messageCode).toBe(1105)
        });
    });

});