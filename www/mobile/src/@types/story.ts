export type TUserType = ['doctor' | 'student' | 'anonymous'];
export type TBodyType = 'atlas' | 'html' | 'plain' | 'froala';

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
  is_follow: boolean;
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
