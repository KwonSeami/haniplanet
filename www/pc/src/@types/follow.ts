type TFollowType = 'following' | 'follower';

interface IFollowPopupUser {
  avatar: string;
  id: HashId;
  is_follow: boolean;
  name: string;
  last_career: string;
}

interface IFollowUser extends Omit<IFollowPopupUser, 'last_career'> {
  follower_count: number;
  following_count: number;
  hospital_slug: string;
  user_type: TUserType;
}