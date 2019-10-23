import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class _NoteCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column({type: 'varchar', length: 30, default: ''})
    fn_code: string;

    @Column({type: 'varchar', length: 13})
    uid: string;

    @Column({type: 'int', precision: 11})
    parent: number;

    @Column({type: 'int', precision: 11})
    count: string;

    @Column({type: 'varchar', precision: 11})
    iconText: string;

    @Column({type: 'varchar', precision: 13})
    iconColor: string;

    @Column({type: 'int', default: 0})
    is_super: number;

    @Column({type: 'bigint', precision: 13})
    updateTime: number;

    @Column({type: 'bigint', precision: 13})
    inputTime: number;
}
