import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { Apply, ApplyStatus } from './entity/apply.entity';

@EventSubscriber()
export class ApplicationStatusSubscriber
  implements EntitySubscriberInterface<Apply>
{
  listenTo() {
    return Apply;
  }

  async afterUpdate(event: UpdateEvent<Apply>) {
    const apply: Apply = event.entity;

    if (apply.status === ApplyStatus.ACCEPTED) {
      const meetingRepository = event.manager.getRepository('meeting');
      const meeting = await meetingRepository.findOneBy(apply.meetingId, {
        relations: ['participants'],
      });

      if (meeting) {
        meeting.participants.push(apply.userId);
        await meetingRepository.save(meeting);
      }
    }
  }
}
