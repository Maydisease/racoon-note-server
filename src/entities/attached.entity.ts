import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class _Attached {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 13})
    uid: string;

    @Column({type: 'varchar'})
    name: string;

    @Column({type: 'varchar'})
    path: string;

    @Column({type: 'varchar'})
    type?: string;

    @Column({type: 'bigint', precision: 13})
    size: number;

    @Column({type: 'bigint', precision: 13})
    inputTime: number;

    @Column({type: 'bigint', precision: 13})
    updateTime: number;
}