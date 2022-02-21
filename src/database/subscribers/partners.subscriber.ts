import { Partner } from 'src/database/entities/partners.entity';
import { EntitySubscriberInterface, EventSubscriber, LoadEvent } from 'typeorm';
import { redisClient } from '../../utils/redis_client';

@EventSubscriber()
export class PartnersDatabaseSubscriber
    implements EntitySubscriberInterface<Partner>
{
    async afterLoad(entity: Partner, event?: LoadEvent<Partner>): Promise<any> {
        const cachedPartners = await redisClient.get('partners');
        console.log('=========================', cachedPartners);
    }
}
