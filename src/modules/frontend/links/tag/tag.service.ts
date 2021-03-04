import {Injectable} from '@nestjs/common';
import {Connection, getConnection} from 'typeorm';
import {TagModel, GetLinkListModal} from './tag.model';

@Injectable()
export class TagService {

	public connection: Connection;

	constructor() {
		this.connection = getConnection();
	}

	// 更新文章数据

	public addLink(params) {
		return new TagModel(this.connection).addLink(params);
	}

	public verifyTagIsExist(uid: string, tag: string) {
		return new TagModel(this.connection).verifyTagIsExist(uid, tag);
	}

	public addMultipleTag(params: object[]) {
		return new TagModel(this.connection).addMultipleTag(params);
	}

	public removeMultipleTagForLink(linkId: number, uid: string) {
		return new TagModel(this.connection).removeMultipleTagForLink(linkId, uid);
	}

	public addMultipleTagForLink(params: object[]) {
		return new TagModel(this.connection).addMultipleTagForLink(params)
	}

}
