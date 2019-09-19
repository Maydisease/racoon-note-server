import {_NoteArticle} from '../../../entities/note.article.entity';
import {Connection}   from 'typeorm';

export class ShareModel {

    public tableNoteArticle;

    constructor(private readonly connection: Connection) {
        this.tableNoteArticle = _NoteArticle;
    }

    // 获取分类数据
    getArticleData(id: number, uid: string): Promise<any> {
        return this.connection.getRepository(this.tableNoteArticle).findOne(
            {
                select: ['id', 'title', 'html_content', 'on_share', 'use_share_code', 'updateTime'],
                where : [{id, uid, disable: 0, on_share: 1, lock: 0}]
            },
        );
    }

    // 获取分类数据
    getSecretArticleData(id: number, uid: string, share_code): Promise<any> {
        return this.connection.getRepository(this.tableNoteArticle).findOne(
            {
                select: ['id', 'title', 'html_content', 'on_share', 'use_share_code', 'updateTime'],
                where : [{id, uid, disable: 0, on_share: 1, share_code, lock: 0}]
            },
        );
    }
}
