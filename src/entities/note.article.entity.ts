import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class _NoteArticle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    title: string;

    @Column({type: 'varchar', length: 13})
    uid: string;

    @Column({type: 'int', precision: 11})
    cid: number;

    @Column({type: 'longtext', nullable: true})
    markdown_content?: string;

    @Column({type: 'longtext', nullable: true})
    html_content?: string;

    @Column({type: 'longtext', nullable: true})
    description?: string;

    @Column({type: 'int', default: 0})
    lock: number;

    @Column({type: 'int', default: 0})
    disable: number;

    @Column({type: 'bigint', precision: 13})
    updateTime: number;

    @Column({type: 'bigint', precision: 13})
    inputTime: number;
}
