// import {
//   EntitySubscriberInterface,
//   EventSubscriber,
//   // UpdateEvent,
// } from 'typeorm';
// import { Application, ApplicationStatus } from './entity/participant.entity';

// @EventSubscriber()
// export class ApplicationStatusSubscriber
//   implements EntitySubscriberInterface<Application>
// {
//   listenTo() {
//     return Application;
//   }

// async afterUpdate(event: UpdateEvent<Apply>) {
// const apply: Apply = event.entity;

// if (apply.status === ApplyStatus.ACCEPTED) {
// const meetingRepository = event.manager.getRepository('meeting');
// const meeting = await meetingRepository.findOneBy(apply.meetingId);
// relations: ['participants'],})
// if (meeting) {
// meeting.participants.push(apply.userId);
// await meetingRepository.save(meeting);
// }
// }
// }
// }
