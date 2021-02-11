export type TUserType = ['doctor' | 'student' | 'anonymous'];
export type TBodyType = 'atlas' | 'html' | 'plain';
// @정윤재: user 인터페이스 위치 개선 필요
export interface IUser {
  id?: HashId;
  name?: string;
  avatar?: string;
  is_follow?: boolean;
}

export interface IStory {
  id: HashId;
  title: string;
  user: IUser;
  body: string;
  extend_to: string | null;
  body_type: TBodyType;
  user_types: TUserType[];
  reaction_type: TReactionType;
  is_anonymous: boolean;
  is_notice: boolean;
  tags: ITag[];
  is_writer: boolean;
  created_at: string;
  up_count: number;
  down_count: number;
  reply_count: number;
  comment_count: number;
  retrieve_count: number;
  images: Array<{
    id: HashId;
    image: string;
  }>;
}

type TReactionType = 'up'  | 'down';
