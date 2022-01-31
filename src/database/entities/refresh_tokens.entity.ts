import { Column, Entity } from 'typeorm';
import { Model } from './model';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken extends Model {
    @Column({
        unique: false,
        nullable: true,
    })
    hash: string | null;
}
