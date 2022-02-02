import {
    BaseEntity,
    PrimaryGeneratedColumn,
    Column,
    Generated,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class Model extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Generated('uuid')
    @Column({
        unique: true,
        nullable: false,
    })
    uuid: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toJSON() {
        return { ...this, id: undefined };
    }
}
