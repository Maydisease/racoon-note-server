import {Body, Controller, Inject, Post, Request} from '@nestjs/common';
import {LinkService} from './link.service';
import {ErrorService} from '../../../../common/service/error.service';
import {ToolsService} from '../../../../common/service/tools.service';
import {CategoryService} from '../category/category.service';
import {TagService} from '../tag/tag.service'

interface GetLinkList {
	uid: string;
}

interface AddLinkParams {
	uid: string;
	cid: number;
	summary: string;
	title: string;
	url: string;
	tags: Array<string>;
	updateTime: number;
	inputTime: number;
}

interface UpdateLinkParams {
	linkId: number;
	cid: number;
	uid: string;
	title: string;
	url: string;
	summary: string;
	tags: Array<string>;
	updateTime: number;
}

interface RemoveLinkParams {
	uid: string;
	linkId: number;
}

@Controller('links')
export class LinkController {

	constructor(
		@Inject('toolsService') public toolsService: ToolsService,
		@Inject('echoService') public echoService,
		@Inject('userService') public userService,
		@Inject('errorService') public errorService: ErrorService,
		@Inject('linkService') public linkService: LinkService,
		@Inject('tagService') public tagService: TagService,
		@Inject('categoryService') public categoryService: CategoryService
	) {
	}

	@Post('removeLink')
	public async removeLink(@Body() body, @Request() req) {
		const params: RemoveLinkParams = this.toolsService.filterInvalidParams({
			uid: String(req.userInfo.userId),
			linkId: Number(body.linkId)
		});

		if (!params.linkId) {
			return this.echoService.fail(1034, this.errorService.error.E1034);
		}

		// 移除指定link数据
		const removeLinkResponse = await this.linkService.removeLink(params.linkId, params.uid);
		// 移除link关联标签的数据
		await this.tagService.removeMultipleTagForLink(params.linkId, params.uid);

		// 如果移除指定link数据失败的话.
		if (!(removeLinkResponse && removeLinkResponse.raw && removeLinkResponse.raw.affectedRows > 0)) {
			return this.echoService.fail(1033, this.errorService.error.E1033);
		}

		return this.echoService.success({linkId: body.linkId});

	}

	// 获取文章列表
	@Post('getLinkList')
	async getLinkList(@Body() body, @Request() req) {
		const params: GetLinkList = this.toolsService.filterInvalidParams({
			uid: String(req.userInfo.userId)
		});

		let response = await this.linkService.getLinkList(params.uid);

		if (!(response && response.length > 0)) {
			return this.echoService.success([]);
		}

		return this.echoService.success(response);
	}

	// 获取文章列表
	@Post('addLink')
	async addLink(@Body() body, @Request() req) {

		const linkUpdateTime = new Date().getTime();
		const linkInputTime = new Date().getTime();
		let isExistNewTag = false;

		const params: AddLinkParams = this.toolsService.filterInvalidParams({
			uid: String(req.userInfo.userId),
			cid: Number(body.cid),
			title: String(body.title),
			url: String(body.url),
			summary: String(body.summary),
			tags: body.tags || [],
			updateTime: linkUpdateTime,
			inputTime: linkInputTime
		});

		// 如果当前link分类不存在的话.
		if (!(params.cid && await this.categoryService.verifyCategoryIsExist(params.cid, params.uid))) {
			return this.echoService.fail(1030, this.errorService.error.E1030);
		}

		// 如果当前link标题不存在的话.
		if (!params.title) {
			return this.echoService.fail(1031, this.errorService.error.E1031);
		}

		// 如果当前link url不存在的话
		if (!params.url) {
			return this.echoService.fail(1032, this.errorService.error.E1032);
		}

		// 添加链接数据至链接表
		const addLinkResponse = await this.linkService.addLink(params);

		// 如果link数据写入失败的话.
		if (!(addLinkResponse && addLinkResponse.raw && addLinkResponse.raw.insertId)) {
			return this.echoService.fail(1000, this.errorService.error.E1000);
		}

		const linkId = addLinkResponse.raw.insertId;
		const tagNotExistList = [];
		let existTagResponseList = [];

		// 如果存在标签的话
		if (params.tags && params.tags.length > 0) {

			const readyToAddTagList = [];
			const verifyTagIsExistPromiseAllList = [];

			params.tags.map((item) => verifyTagIsExistPromiseAllList.push(this.tagService.verifyTagIsExist(params.uid, item)));
			existTagResponseList = await Promise.all(verifyTagIsExistPromiseAllList);

			// 已存在的tag列表
			existTagResponseList.map((item, index) => {
				const name = params.tags[index];
				if (item && item.id) {
					!readyToAddTagList.includes(item.id) && readyToAddTagList.push({
						uid: params.uid,
						tagId: item.id,
						linkId: linkId,
						updateTime: new Date().getTime(),
						inputTime: new Date().getTime()
					});
				} else {
					tagNotExistList.push({
						name,
						uid: params.uid,
						updateTime: new Date().getTime(),
						inputTime: new Date().getTime()
					});
				}
			});

			if (tagNotExistList && tagNotExistList.length > 0) {

				console.log('tagNotExistList::', tagNotExistList);

				// 添加多个标签.
				const insertTagResponseMap = await this.tagService.addMultipleTag(tagNotExistList);

				if (
					insertTagResponseMap &&
					insertTagResponseMap.generatedMaps &&
					insertTagResponseMap.generatedMaps.length === tagNotExistList.length
				) {

					// 获取插入后的标签的id组成准备插入link关联tag的数据.
					tagNotExistList.map((item) => !readyToAddTagList.includes(item.id) && readyToAddTagList.push({
						uid: params.uid,
						tagId: item.id,
						linkId: linkId,
						updateTime: new Date().getTime(),
						inputTime: new Date().getTime()
					}));
					isExistNewTag = true;
				}

			}

			console.log('readyToAddTagList:', readyToAddTagList);

			// 移除所有之前的link关联tag的数据.
			await this.tagService.removeMultipleTagForLink(linkId, params.uid);
			// 重新创建的link关联tag的关系.
			await this.tagService.addMultipleTagForLink(readyToAddTagList);
		}

		const echoBody = {
			id: params.cid,
			isExistNewTag: isExistNewTag,
			links: [
				{
					cid: params.cid,
					id: addLinkResponse.raw.insertId,
					updateTime: linkUpdateTime,
					inputTime: linkInputTime,
					summary: params.summary,
					title: params.title,
					uid: params.uid,
					url: params.url,
					tags: [...existTagResponseList, ...tagNotExistList]
				}
			]
		}

		return this.echoService.success(echoBody);
	}

	@Post('updateLink')
	async updateLink(@Body() body, @Request() req) {
		const linkUpdateTime = new Date().getTime();
		let isExistNewTag = false;

		console.log('body::', body);

		const params: UpdateLinkParams = this.toolsService.filterInvalidParams({
			linkId: Number(body.linkId),
			cid: Number(body.cid),
			uid: String(req.userInfo.userId),
			title: String(body.title),
			url: String(body.url),
			summary: String(body.summary),
			tags: body.tags || [],
			updateTime: linkUpdateTime
		});

		console.log('params:', params);

		// 缺少linkId参数
		if (!params.linkId) {
			return this.echoService.fail(1034, this.errorService.error.E1034);
		}

		// 如果当前link标题不存在的话.
		if (!params.title) {
			return this.echoService.fail(1031, this.errorService.error.E1031);
		}

		// 如果当前link url不存在的话
		if (!params.url) {
			return this.echoService.fail(1032, this.errorService.error.E1032);
		}

		// 不存在的link
		if (!await this.linkService.verifyLinkExist(params.linkId, params.uid)) {
			return this.echoService.fail(1040, this.errorService.error.E1040);
		}

		const updateLinkResponse = await this.linkService.updateLink(params.linkId, params.title, params.url, params.summary, params.updateTime, params.uid);

		// 判断数据是否正常更新了link
		if (!(updateLinkResponse && updateLinkResponse.raw.changedRows > 0)) {
			return this.echoService.fail(1000, this.errorService.error.E1000);
		}

		const tagNotExistList = [];
		let existTagResponseList = [];


		// 编辑时，如果删除了所有标签的话，那么就清理当前文章的所有标签绑定关系
		if (!(params.tags && params.tags.length > 0)) {
			const linkExistLinkForTag = await this.linkService.verifyLinkForTagIsExist(params.linkId, params.uid);
			linkExistLinkForTag && await this.tagService.removeMultipleTagForLink(params.linkId, params.uid);
		}

		// 如果存在标签的话
		if (params.tags && params.tags.length > 0) {

			const readyToAddTagList = [];
			const verifyTagIsExistPromiseAllList = [];

			params.tags.map((item) => verifyTagIsExistPromiseAllList.push(this.tagService.verifyTagIsExist(params.uid, item)));
			existTagResponseList = await Promise.all(verifyTagIsExistPromiseAllList);

			// 已存在的tag列表
			existTagResponseList.map((item, index) => {
				const name = params.tags[index];
				if (item && item.id) {
					!readyToAddTagList.includes(item.id) && readyToAddTagList.push({
						uid: params.uid,
						tagId: item.id,
						linkId: params.linkId,
						updateTime: new Date().getTime(),
						inputTime: new Date().getTime()
					});
				} else {
					tagNotExistList.push({
						name,
						uid: params.uid,
						updateTime: new Date().getTime(),
						inputTime: new Date().getTime()
					});
				}
			});

			if (tagNotExistList && tagNotExistList.length > 0) {

				console.log(666011111, tagNotExistList);

				// 添加多个标签.
				const insertTagResponseMap = await this.tagService.addMultipleTag(tagNotExistList);

				if (
					insertTagResponseMap &&
					insertTagResponseMap.generatedMaps &&
					insertTagResponseMap.generatedMaps.length === tagNotExistList.length
				) {

					// 获取插入后的标签的id组成准备插入link关联tag的数据.
					tagNotExistList.map((item) => !readyToAddTagList.includes(item.id) && readyToAddTagList.push({
						uid: params.uid,
						tagId: item.id,
						linkId: params.linkId,
						updateTime: new Date().getTime(),
						inputTime: new Date().getTime()
					}));

					isExistNewTag = true;
				}

			}

			console.log('readyToAddTagList:', params.linkId, params.uid, readyToAddTagList);

			// 移除所有之前的link关联tag的数据.
			await this.tagService.removeMultipleTagForLink(params.linkId, params.uid);
			// 重新创建的link关联tag的关系.
			await this.tagService.addMultipleTagForLink(readyToAddTagList);
		}

		const echoBody = {
			id: params.cid,
			isExistNewTag: isExistNewTag,
			links: [
				{
					cid: params.cid,
					id: params.linkId,
					updateTime: linkUpdateTime,
					summary: params.summary,
					title: params.title,
					uid: params.uid,
					url: params.url,
					tags: [...existTagResponseList, ...tagNotExistList]
				}
			]
		}

		return this.echoService.success(echoBody);

	}

	@Post('getAllTag')
	async getAllTag(@Body() body, @Request() req) {
		const params: GetLinkList = this.toolsService.filterInvalidParams({
			uid: String(req.userInfo.userId)
		});

		let response = await this.tagService.getAllTag(params.uid);

		if (!(response && response.length > 0)) {
			return this.echoService.success([]);
		}

		return this.echoService.success(response);
	}

}
