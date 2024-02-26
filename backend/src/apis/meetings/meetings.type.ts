import { Category } from '../categories/entity/categories.entity';
import { User } from '../users/entities/user.entity';

export type MeetingDetailResponse = {
  meetingId: number;
  title: string;
  categories: Category[];
  image: string;
  description: string;
  location: string;
  meeting_date: Date;
  member_limit: number;
  created_at: Date;
  host: User;
  participants_number: number;
  isLiked: boolean;
};

export type MeetingListResponse = {
  meetingId: number;
  title: string;
  categories: Category[];
  image: string;
  description: string;
  location: string;
  meeting_date: Date;
  member_limit: number;
  created_at: Date;
  host: any;
  participants_number: number;
  isLiked: boolean;
  isActivated: boolean;
};
