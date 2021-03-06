import {Body, Controller, Inject, Post, Request} from '@nestjs/common';

interface AddCategoryDataBody {
    name: string;
    uid: string;
    parent: number;
    count: number;
    fn_code: string;
    iconText: string;
    iconColor: string;
    updateTime: number;
    inputTime: number;
}

interface GetCategoryDataBody {
    uid: string;
}

interface RenameCategoryBody {
    id: number;
    parent: number;
    name: string;
    uid: string;
    updateTime: number;
}

interface UpdateCategoryIcon {
    id: number;
    iconText: string;
    uid: string;
    updateTime: number;
}

interface RemoveCategoryBody {
    id: number | number[];
    uid: string;
}

@Controller('note')
export class CategoryController {

    constructor(
        @Inject('toolsService') public toolsService,
        @Inject('echoService') public echoService,
        @Inject('categoryService') public categoryService,
        @Inject('errorService') public errorService,
    ) {

    }

    // 获取分类数据
    @Post('getCategoryData')
    async getCategoryData(@Request() req): Promise<object> {

        const params: GetCategoryDataBody = this.toolsService.filterInvalidParams({
            uid: req.userInfo.userId,
        });

        const response = await this.categoryService.getCategoryData(params.uid);

        return this.echoService.success(response);
    }

    // 添加数据
    @Post('addCategoryData')
    async addCategoryData(@Body() body, @Request() req): Promise<object> {

        // 格式化数据
        const timestamp                   = new Date().getTime();
        const params: AddCategoryDataBody = this.toolsService.filterInvalidParams({
            name      : String(body.name),
            uid       : String(req.userInfo.userId),
            parent    : Number(body.parent) || 0,
            count     : 0,
            iconText  : 'folder',
            iconColor : 'default',
            fn_code   : '',
            updateTime: timestamp,
            inputTime : timestamp,
        });

        // 分类名长度应该为1-18个字符
        if (!(params.name && params.name.length > 0 && params.name.length <= 18)) {
            return this.echoService.fail(1008, this.errorService.error.E1008);
        }

        // parent不存在
        if (params.parent !== 0 && !await this.categoryService.verifyCategoryParentExist(params.uid, params.parent)) {
            return this.echoService.fail(1009, this.errorService.error.E1009);
        }

        // 当前分类已存在
        if (await this.categoryService.verifyCategoryExist(params.name, params.uid, params.parent)) {
            return this.echoService.fail(1010, this.errorService.error.E1010);
        }

        // 当前是超级分类
        if (await this.categoryService.verifyCategoryIsSuper(params.parent)) {
            return this.echoService.fail(1027, this.errorService.error.E1027);
        }

        // 写入数据
        const response = await this.categoryService.addCategoryData(params);

        // 写入数据失败
        if (!(response && response.raw.insertId > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        return this.echoService.success(response);
    }

    // 更改分类名
    @Post('renameCategory')
    public async renameCategory(@Body() body, @Request() req) {

        // 格式化数据
        const timestamp                  = new Date().getTime();
        const params: RenameCategoryBody = this.toolsService.filterInvalidParams({
            id        : Number(body.id),
            parent    : Number(body.parent),
            uid       : String(req.userInfo.userId),
            name      : String(body.newName),
            updateTime: timestamp,
        });

        // 分类名长度应该为1-18个字符
        if (!(params.name && params.name.length > 0 && params.name.length <= 18)) {
            return this.echoService.fail(1008, this.errorService.error.E1008);
        }

        // 当前分类已存在
        if (await this.categoryService.verifyCategoryExist(params.name, params.uid, params.parent)) {
            return this.echoService.fail(1010, this.errorService.error.E1010);
        }

        // 当前分类不存在
        if (!await this.categoryService.verifyCategoryIdExist(params.id)) {
            return this.echoService.fail(1011, this.errorService.error.E1011);
        }

        // 当前是超级分类
        if (await this.categoryService.verifyCategoryIsSuper(params.id)) {
            return this.echoService.fail(1025, this.errorService.error.E1025);
        }

        const response = await this.categoryService.renameCategory(params.id, params.name, params.updateTime, params.uid);

        // 写入数据失败
        if (!(response && response.raw.affectedRows > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        return this.echoService.success();
    }

    // 更改分类名
    @Post('updateCategoryIcon')
    public async updateCategoryIcon(@Body() body, @Request() req) {
        // 格式化数据
        const timestamp                  = new Date().getTime();
        const params: UpdateCategoryIcon = this.toolsService.filterInvalidParams({
            id        : Number(body.id),
            uid       : String(req.userInfo.userId),
            iconText  : String(body.iconText),
            updateTime: timestamp,
        });

        // 当前分类不存在
        if (!await this.categoryService.verifyCategoryIdExist(params.id)) {
            return this.echoService.fail(1011, this.errorService.error.E1011);
        }

        // 当前IconText不能为空
        if (!(params.iconText && params.iconText.length > 0)) {
            return this.echoService.fail(1023, this.errorService.error.E1023);
        }

        const response = await this.categoryService.updateCategoryIcon(params.id, params.uid, params.iconText, params.updateTime);

        // 写入数据失败
        if (!(response && response.raw.affectedRows > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        return this.echoService.success();
    }

    // 删除数据
    @Post('removeCategory')
    async removeCategory(@Body() body, @Request() req) {

        // 格式化数据
        const params: RemoveCategoryBody = this.toolsService.filterInvalidParams({
            id : Number(body.id),
            uid: String(req.userInfo.userId),
        });

        if (!(params.id && ((typeof params.id === 'number') || (typeof params.id === 'object' && params.id.length > 0)))) {
            return this.echoService.fail(1012, this.errorService.error.E1012);
        }

        // 当前分类存在子分类，不允许删除
        if (await this.categoryService.verifyExistSonCategory(params.id)) {
            return this.echoService.fail(1013, this.errorService.error.E1013);
        }

        // 当前分类存在文章，不允许删除
        if (await this.categoryService.verifyExistArticle(params.id)) {
            return this.echoService.fail(1014, this.errorService.error.E1014);
        }

        // 当前是超级分类，不允许删除
        if (await this.categoryService.verifyCategoryIsSuper(params.id)) {
            return this.echoService.fail(1026, this.errorService.error.E1026);
        }

        let response;

        if (params.id && typeof params.id === 'number') {
            response = await this.categoryService.removeCategory(params.id, params.uid);
        }

        if (typeof params.id === 'object' && params.id.length > 0) {
            response = await this.categoryService.removeMultipleCategory(params.id, params.uid);
        }

        if (!(response && response.raw.affectedRows > 0)) {
            return this.echoService.fail(1000, this.errorService.error.E1000);
        }

        return this.echoService.success();
    }

}
