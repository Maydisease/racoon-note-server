import {Column, Entity, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import {_LinkCategory} from './link.category.entity'

@Entity()
export class _Link {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: 'varchar', length: 13})
	uid: string;

	@Column('varchar')
	title: string;

	@Column({type: 'longtext', nullable: true})
	url?: string;

	@Column({type: 'int', precision: 11})
	cid: number;

	@Column({type: 'longtext', nullable: true})
	summary?: string;

	@Column({type: 'bigint', precision: 13})
	updateTime: number;

	@Column({type: 'bigint', precision: 13})
	inputTime: number;
}
