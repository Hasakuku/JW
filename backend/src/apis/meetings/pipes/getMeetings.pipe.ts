import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { GetMeetingsDto } from '../dto/get-meeting.dto';

// @Injectable()
export class GetMeetingsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const getMeetingsDto = new GetMeetingsDto();
    getMeetingsDto.keyword = value.keyword || getMeetingsDto.keyword;
    getMeetingsDto.categories =
      Array.isArray(value.categories) && value.categories.length !== 0
        ? value.categories.map((id) => parseInt(id))
        : getMeetingsDto.categories;
    getMeetingsDto.member_min =
      parseInt(value.member_min) || getMeetingsDto.member_min;
    getMeetingsDto.member_max =
      parseInt(value.member_max) || getMeetingsDto.member_max;
    getMeetingsDto.date_start = value.date_start
      ? new Date(value.date_start)
      : getMeetingsDto.date_start;
    getMeetingsDto.date_end = value.date_end
      ? new Date(value.date_end)
      : getMeetingsDto.date_end;
    getMeetingsDto.location = value.location || getMeetingsDto.location;
    getMeetingsDto.sort = value.sort || getMeetingsDto.sort;
    getMeetingsDto.perPage = parseInt(value.perPage) || getMeetingsDto.perPage;
    getMeetingsDto.cursorId =
      parseInt(value.cursorId) || getMeetingsDto.cursorId;
    getMeetingsDto.cursorValue =
      value.cursorValue || getMeetingsDto.cursorValue;

    return getMeetingsDto;
  }
}
