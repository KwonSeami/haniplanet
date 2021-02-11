interface IPost extends TimeStamp, HasLikeModel {
  title: string;
  member?: IUser;
  id: Id;
  is_notice: boolean;
  is_active: boolean;
  is_blind?: boolean;
  reply_count: number;
  board: Id;
  prev_post?: {
    id: Id;
    title: string;
  };
  next_post?: {
    id: Id;
    title: string;
  };
  files?: IFile[];
  is_write_admin?: boolean;
  origin_id?: Id;
  contents: string;
  tags: ITag[];
  comment_count: number;
  view_count: number;
  gone_type?: 'blind' | 'deleted';
  is_report?: boolean;
}

export interface IUser {
  avatar: string;
  id: HashId;
  is_follow: boolean;
  is_writer: boolean;
  name: string;
  user_type: string;
}

export interface IParameter {
  page?: string;
  tag_id?: string
}