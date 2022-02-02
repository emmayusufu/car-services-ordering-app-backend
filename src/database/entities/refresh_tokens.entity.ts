import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        unique: true,
        nullable: false,
    })
    token: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
