import {Injectable} from '@nestjs/common';
import {Connection, getConnection} from 'typeorm';
import {LinkModel, GetLinkListModal} from './link.model';

@Injectable()
export class LinkService {

	public connection: Connection;

	constructor() {
		this.connection = getConnection();
	}

	// 更新文章数据
	public getLinkList(uid: string): Promise<GetLinkListModal> {
		return new LinkModel(this.connection).getLinkList(uid) as Promise<GetLinkListModal>;
	}

	public addLink(params) {
		return new LinkModel(this.connection).addLink(params);
	}

	public removeLink(linkId, uid) {
		return new LinkModel(this.connection).removeLink(linkId, uid);
	}

	public async verifyCategoryExistLink(cid: number, uid: string) {
		return await new LinkModel(this.connection).verifyCategoryExistLink(cid, uid) >= 1;
	}

	public async verifyLinkExist(linkId: number, uid: string) {
		return await new LinkModel(this.connection).verifyLinkExist(linkId, uid) >= 1;
	}

	public updateLink(linkId: number, title: string, url: string, summary: string, updateTime: number, uid: string): Promise<any> {
		return new LinkModel(this.connection).updateLink(linkId, title, url, summary, updateTime, uid);
	}

}
