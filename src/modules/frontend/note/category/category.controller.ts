import {Body, Controller, Inject, Post, Request} from '@nestjs/common';

interface addCategoryDataBody {
    name: string,
    uid: string,
    parent: number,
    count: number,
    updateTime: number,
    inputTime: number
}

interface getCategoryDataBody {
    uid: string
}

interface renameCategoryBody {
    id: number,
    parent: number,
    name: string,
    uid: string,
    updateTime: number
}

interface removeCategoryBody {
    id: number | Array<number>,
    uid: string
}

@Controller('note')
export class CategoryController {

    constructor(
        @Inject('toolsService') public toolsService,
        @Inject('echoService') public echoService,
        @Inject('categoryService') public categoryService
    ) {

    }

    // 获取分类数据
    @Post('getCategoryData')
    async getCategoryData(@Request() req): Promise<object> {

        const params: getCategoryDataBody = this.toolsService.filterInvalidParams({
            uid: req.userInfo.userId
        });

        const response = await this.categoryService.getCategoryData(params.uid);

        return this.echoService.success(response);
    }

    // 添加数据
    @Post('addCategoryData')
    async addCategoryData(@Body() body, @Request() req): Promise<object> {

        // 格式化数据
        const timestamp                   = new Date().getTime();
        const params: addCategoryDataBody = this.toolsService.filterInvalidParams({
            name      : String(body.name),
            uid       : String(req.userInfo.userId),
            parent    : Number(body.parent) || 0,
            count     : 0,
            updateTime: timestamp,
            inputTime : timestamp
        });

        // 分类名长度应该为1-18个字符
        if (!(params.name && params.name.length > 0 && params.name.length <= 18)) {
            return this.echoService.fail(1100, "Category length should be 1-18 characters");
        }

        // parent不存在
        if (params.parent !== 0 && !await this.categoryService.verifyCategoryParentExist(params.uid, params.parent)) {
            return this.echoService.fail(1102, "Invalid parent category");
        }

        // 当前分类已存在
        if (await this.categoryService.verifyCategoryExist(params.name, params.uid, params.parent)) {
            return this.echoService.fail(1103, "Category already exists");
        }

        // 写入数据
        const response = await this.categoryService.addCategoryData(params);

        // 写入数据失败
        if (!(response && response.raw.insertId > 0)) {
            return this.echoService.fail(9001, "Data write failed");
        }

        return this.echoService.success(response);
    }

    // 更改分类名
    @Post('renameCategory')
    public async renameCategory(@Body() body, @Request() req) {

        console.log(body);

        // 格式化数据
        const timestamp                  = new Date().getTime();
        const params: renameCategoryBody = this.toolsService.filterInvalidParams({
            id        : Number(body.id),
            parent    : Number(body.parent),
            uid       : String(req.userInfo.userId),
            name      : String(body.newName),
            updateTime: timestamp
        });

        // 分类名长度应该为1-18个字符
        if (!(params.name && params.name.length > 0 && params.name.length <= 18)) {
            return this.echoService.fail(1100, "Category length should be 1-18 characters");
        }

        // 当前分类已存在
        if (await this.categoryService.verifyCategoryExist(params.name, params.uid, params.parent)) {
            return this.echoService.fail(1103, "Category already exists");
        }

        // 当前分类不存在
        if (!await this.categoryService.verifyCategoryIdExist(params.id)) {
            return this.echoService.fail(1104, "Category does not exist");
        }

        const response = await this.categoryService.renameCategory(params.id, params.name, params.updateTime, params.uid);

        // 写入数据失败
        if (!(response && response.raw.affectedRows > 0)) {
            return this.echoService.fail(9001, "Data write failed");
        }

        return this.echoService.success();
    }

    // 删除数据
    @Post('removeCategory')
    async removeCategory(@Body() body, @Request() req) {

        // 格式化数据
        const params: removeCategoryBody = this.toolsService.filterInvalidParams({
            id : Number(body.id),
            uid: String(req.userInfo.userId)
        });

        if (!(params.id && ((typeof params.id === 'number') || (typeof params.id === 'object' && params.id.length > 0)))) {
            return this.echoService.fail(1105, "Category id is an unsupported type");
        }

        // 当前分类存在子分类，不允许删除
        if (await this.categoryService.verifyExistSonCategory(params.id)) {
            return this.echoService.fail(1106, "Current category has subcategories");
        }

        // 当前分类存在文章，不允许删除
        if (await this.categoryService.verifyExistArticle(params.id)) {
            return this.echoService.fail(1107, "Current category has articles");
        }

        let response;

        if (params.id && typeof params.id === 'number') {
            response = await this.categoryService.removeCategory(params.id, params.uid);
        }

        if (typeof params.id === 'object' && params.id.length > 0) {
            response = await this.categoryService.removeMultipleCategory(params.id, params.uid);
        }

        if (!(response && response.raw.affectedRows > 0)) {
            return this.echoService.fail(9001, "Data write failed");
        }

        return this.echoService.success();
    }

}
