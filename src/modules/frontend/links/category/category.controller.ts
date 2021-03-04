import {Body, Controller, Inject, Post, Request} from '@nestjs/common';
import {ToolsService} from '../../../../common/service/tools.service';
import {ErrorService} from '../../../../common/service/error.service'
import {LinkService} from '../link/link.service';
import {CategoryService} from './category.service';

@Controller('links')
export class CategoryController {

	constructor(
		@Inject('toolsService') public toolsService: ToolsService,
		@Inject('echoService') public echoService,
		@Inject('userService') public userService,
		@Inject('errorService') public errorService: ErrorService,
		@Inject('categoryService') public categoryService: CategoryService,
		@Inject('linkService') public linkService: LinkService
	) {
	}

	// 获取分类列表
	@Post('getCategoryList')
	async getArticleList(@Body() body, @Request() req) {
		const params = this.toolsService.filterInvalidParams({
			uid: String(req.userInfo.userId)
		});

		return this.echoService.success();
	}

	@Post('addCategory')
	async addCategory(@Body() body, @Request() req) {

		const addCategoryUpdateTime = new Date().getTime();
		const addCategoryInputTime = new Date().getTime();

		const params = this.toolsService.filterInvalidParams({
			name: body.name,
			uid: String(req.userInfo.userId),
			updateTime: addCategoryUpdateTime,
			inputTime: addCategoryInputTime
		});

		// 缺少分类名.
		if (!params.name) {
			return this.echoService.fail(1035, this.errorService.error.E1035);
		}

		// 当前分类在库中已存在.
		if (await this.categoryService.verifyCategoryNameIsExist(params.name, params.uid)) {
			return this.echoService.fail(1036, this.errorService.error.E1036);
		}

		let addCategoryResponse = await this.categoryService.addCategory(params);

		// 新增数据失败
		if (!(addCategoryResponse && addCategoryResponse.raw && addCategoryResponse.raw.insertId)) {
			return this.echoService.fail(1000, this.errorService.error.E1000);
		}

		return this.echoService.success({name: params.name, id: addCategoryResponse.raw.insertId, updateTime: addCategoryUpdateTime, links: []});
	}

	@Post('removeCategory')
	async removeCategory(@Body() body, @Request() req) {
		const params = this.toolsService.filterInvalidParams({
			cid: body.cid,
			uid: String(req.userInfo.userId)
		});

		// 缺少分类ID.
		if (!params.cid) {
			return this.echoService.fail(1037, this.errorService.error.E1037);
		}

		// 如果当前分类不存在的话.
		if (!await this.categoryService.verifyCategoryIsExist(params.cid, params.uid)) {
			return this.echoService.fail(1038, this.errorService.error.E1038);
		}

		// 如果当前分类还存在link的话.
		if (await this.linkService.verifyCategoryExistLink(params.cid, params.uid)) {
			return this.echoService.fail(1039, this.errorService.error.E1039);
		}

		// 删除分类.
		const removeCategoryResponse = await this.categoryService.removeCategory(params.cid, params.uid);

		// 是否删除分类成功.
		if (!(removeCategoryResponse && removeCategoryResponse.raw.affectedRows > 0)) {
			return this.echoService.fail(1000, this.errorService.error.E1000);
		}

		return this.echoService.success({cid: params.cid});
	}

}
