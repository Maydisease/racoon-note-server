import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class _LinkTagLink {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: 'varchar', length: 13})
	uid: string;

	@Column({type: 'int', precision: 11})
	linkId: number;

	@Column({type: 'int', precision: 11})
	tagId: number;

	@Column({type: 'bigint', precision: 13})
	updateTime: number;

	@Column({type: 'bigint', precision: 13})
	inputTime: number;
}
