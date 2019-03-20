import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class _User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 13})
    userId: string;

    @Column({type: 'varchar', length: 26})
    username: string;

    @Column({type: 'longtext'})
    password: string;

    @Column({type: 'longtext', nullable: true})
    options?: string;

    @Column({type: 'bigint', precision: 13})
    updateTime: number;

    @Column({type: 'bigint', precision: 13})
    inputTime: number;

    @Column({type: 'bigint', precision: 13, nullable: true})
    lastTime: number;
}