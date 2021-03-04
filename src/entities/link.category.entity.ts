import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class _LinkCategory {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar')
	name: string;

	@Column({type: 'varchar', length: 13})
	uid: string;

	@Column({type: 'bigint', precision: 13})
	updateTime: number;

	@Column({type: 'bigint', precision: 13})
	inputTime: number;
}
