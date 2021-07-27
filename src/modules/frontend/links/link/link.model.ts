import {_Link} from '../../../../entities/link.entity';
import {_LinkCategory} from '../../../../entities/link.category.entity';
import {_LinkTag} from '../../../../entities/link.tag.entity';
import {_LinkTagLink} from '../../../../entities/link.tag_link.entity'
import {Connection} from 'typeorm';

export type GetLinkListModal = {
	id: number;
	name: string;
	uid: string;
	updateTime: string;
	inputTime: string;
	links: {
		title: string;
		url: string;
		cid: number;
		summary: string;
		tagsIds: string;
		updateTime: string;
		inputTime: string;
	}[]
}[]

interface UpdateLinkBody {
	title: string;
	url: string;
	summary?: string;
	updateTime: number;
}

export class LinkModel {

	public tableUser;
	public tableLink;
	public tableLinkTag;
	public tableLinkTagLink;
	public tableLinkCategory;

	constructor(private readonly connection: Connection) {
		this.tableLink = _Link;
		this.tableLinkCategory = _LinkCategory;
		this.tableLinkTag = _LinkTag;
		this.tableLinkTagLink = _LinkTagLink;
	}

	// 获取文章列表
	getLinkList(uid: string): Promise<GetLinkListModal | unknown[]> {
		return this.connection.createQueryBuilder(this.tableLinkCategory, 'category')
		           .select(['category.id', 'category.name', 'category.updateTime'])
		           .where('category.uid = :uid', {uid})
		           .leftJoinAndMapMany('category.links', this.tableLink, 'link', 'link.cid=category.id')
		           .leftJoinAndMapMany('link.tags', this.tableLinkTagLink, 'tagLink', 'tagLink.linkId=link.id')
		           .leftJoinAndMapMany('link.tags', this.tableLinkTag, 'linkTag', 'linkTag.id=tagLink.tagId')
		           .getMany();
	}

	// 添加link
	addLink(params) {
		return this.connection
		           .createQueryBuilder()
		           .insert()
		           .into(this.tableLink)
		           .values([params])
		           .printSql()
		           .execute();
	}

	// 更新link
	updateLink(linkId: number, title: string, url: string, summary: string, updateTime: number, uid: string) {

		const body: UpdateLinkBody = {
			title,
			url,
			updateTime,
			summary
		}

		return this.connection
		           .createQueryBuilder()
		           .update(this.tableLink)
		           .set(body as any)
		           .where('id = :linkId', {linkId})
		           .andWhere('uid = :uid', {uid})
		           .execute();
	}

	// 移除指定link
	removeLink(linkId: number, uid: string) {
		return this.connection.createQueryBuilder()
		           .delete()
		           .from(this.tableLink)
		           .where('id = :linkId', {linkId})
		           .andWhere('uid = :uid', {uid})
		           .execute();
	}

	verifyCategoryExistLink(cid: number, uid: string) {
		return this.connection
		           .getRepository(this.tableLink)
		           .createQueryBuilder()
		           .where('cid = :cid', {cid})
		           .andWhere('uid = :uid', {uid})
		           .getCount();
	}

	verifyLinkExist(linkId: number, uid: string) {
		return this.connection
		           .getRepository(this.tableLink)
		           .createQueryBuilder()
		           .where('id = :linkId', {linkId})
		           .andWhere('uid = :uid', {uid})
		           .getCount();
	}


	verifyLinkForTagIsExist(linkId: number, uid: string) {
		return this.connection
		           .getRepository(this.tableLinkTagLink)
		           .createQueryBuilder()
		           .where('linkId = :linkId', {linkId})
		           .andWhere('uid = :uid', {uid})
		           .getCount();
	}


}
