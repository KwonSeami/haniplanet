import {
  TUserType,
  TBodyType
} from './story';
import {HashId} from '@hanii/planet-types';
import {IUser, TUserExposeType} from './user';

interface IMoaExtension {
  member_count: number;
  story_count: number;
  new_story_count: number;
  owner: {
    auth_id: string;
    identifier?: string;
  };
}

interface IHospitalExtension {
  telephone: string;
  map_location: [number, number];
  partial: boolean;
  address: string;
}

interface ITimeline {
  id: HashId;
  name: string;
}

type TBandMemberGrade = 'visitor' | 'normal' | 'admin' | 'owner' | 'staff';
type TOpenRange = 'secret' | 'user_all' | 'human';



interface IBand {
  slug: string;
  name: string;
  avatar: string;
  category: {
    id: HashId;
    name: string;
    avatar: string;
    description: string;
  };
  body: string;
  user_types: TUserType;
  joinable_user_types: TUserType;
  body_type: TBodyType;
  band_type: string; // moa, hospital... 확정 시 타입 변경 필요
  open_range: TOpenRange;
  write_range: 'band' | 'user_all' | 'human';
  user_expose_type: TUserExposeType;
  purpose: string;
  extension: IMoaExtension | IHospitalExtension;
  members: any; // null은 멤버가 비공개인 경우임
  banners: string[];
  timelines: ITimeline[];
  band_member_grade: TBandMemberGrade;
  is_in_progress: boolean;
}

interface IMoaMember {
  answer: {
    answers: {
      [id: number]: string;
    };
    questions: {
      [id: number]: string;
    };
  };
  approve_number: number;
  approved_at: string;
  band: number;
  grade: TBandMemberGrade;
  id: HashId;
  nick_name: string;
  nick_name_updated_At: string;
  order: number;
  position: string;
  self_introduce: string;
  subject_text: string;
  created_at: string; // user 내에서 member 내부로 이동됨. 관련 코드 수정 필요
  user: IUser & {
    auth_id: string;
    user_type?: TUserType;
  };
}

interface IMoaApplyMember extends Omit<IMoaMember, 'grade'> {
  grade: Exclude<TBandMemberGrade, 'visitor'>;
  read_at: string;
}

interface IMoaTimeline extends Omit<IMoaExtension, 'owner'>,
  Pick<IBand, 'slug' | 'name' | 'avatar'>,
  Pick<IMoaMember, 'created_at'> {
  member_created_at: string;
  status: string; // 보다 정확한 타입 확인 필요
}

type TIntegratedSearchMoa = Pick<IBand, 'slug'
  | 'name'
  | 'avatar'
  | 'band_member_grade'
  | 'body'
  | 'body_type'
  | 'category'
  | 'is_in_progress'
> & Pick<IMoaExtension, 'member_count'
  | 'story_count'
  | 'new_story_count'
>;

type TIntegratedSearchHospital = Pick<IBand, 'slug'
  | 'name'
  | 'avatar'
  | 'extension'
>;