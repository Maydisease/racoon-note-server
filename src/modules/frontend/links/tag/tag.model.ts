import {_Link} from '../../../../entities/link.entity';
import {_LinkCategory} from '../../../../entities/link.category.entity';
import {_LinkTag} from '../../../../entities/link.tag.entity';
import {_LinkTagLink} from '../../../../entities/link.tag_link.entity'
import {Connection, Like, In, Not, Binary} from 'typeorm';

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

export class TagModel {

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
	getAllTag(uid: string): Promise<GetLinkListModal | unknown[]> {
		return this.connection.createQueryBuilder(this.tableLinkTag, 'tag')
		           .where('tag.uid = :uid', {uid})
		           .getMany();
	}

	// 获取文章列表
	verifyTagIsExist(uid: string, tag: string) {
		console.log('model:', tag);
		return this.connection
		           .getRepository(this.tableLinkTag)
		           .createQueryBuilder()
		           .where('name = :tag', {tag})
		           .andWhere('uid = :uid', {uid})
		           .getOne();
	}

	addLink(params) {
		return this.connection
		           .createQueryBuilder()
		           .insert()
		           .into(this.tableLink)
		           .values([params])
		           .printSql()
		           .execute();
	}

	addMultipleTag(params) {
		return this.connection
		           .createQueryBuilder()
		           .insert()
		           .into(this.tableLinkTag)
		           .values(params)
		           .execute();
	}

	removeMultipleTagForLink(linkId: number, uid: string) {
		return this.connection.createQueryBuilder()
		           .delete()
		           .from(this.tableLinkTagLink)
		           .where('linkId = :linkId', {linkId})
		           .andWhere('uid = :uid', {uid})
		           .execute();
	}

	addMultipleTagForLink(params) {
		return this.connection
		           .createQueryBuilder()
		           .insert()
		           .into(this.tableLinkTagLink)
		           .values(params)
		           .execute();
	}


}
