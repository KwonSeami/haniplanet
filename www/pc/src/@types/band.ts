import {TBodyType, TUserType} from './story';
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

interface IOnclassContents {
  title: string; //강의 제목
  order: number; //강의 순서
  media_content_key: string;
  length: number; // 강의 시간 초단위
  is_intro: boolean;
  intro_play_range: number; // 인트로 영상 시작과 끝 시간 프론트에선 사용 X
  progress_rate: number; // 각 영상의 진도율
};

export interface IOnClassStory {
  story: {
    id: HashId;
    title: string; //온라인 강의 이름
    user: { //강의자
      name: string;
      id: HashId;
    }
    content_count: number; // 총 게시글
    receipt_range: string[]; //신청기간
  }
  remaining_days: number; //남은 학습일
  period_range: string[]; // 학습기간
  total_progress_rate: any; // 나의 진도율
};

interface IOnclassContents {
  title: string; //강의 제목
  order: number; //강의 순서
  media_content_key: string;
  length: number; // 강의 시간 초단위
  is_intro: boolean;
  intro_play_range: number; // 인트로 영상 시작과 끝 시간 프론트에선 사용 X
  progress_rate: number; // 각 영상의 진도율
};

export interface IOnClassStory {
  story: {
    id: HashId;
    title: string; //온라인 강의 이름
    user: { //강의자
      name: string;
      id: HashId;
    }
    total_contents_count: number; // 총 게시글
    receipt_range: string[]; //신청기간
  }
  remaining_days: number; //남은 학습일
  period_range: string[]; // 학습기간
  total_progress_rate: any; // 나의 진도율
};

export interface IBand {
  slug: string;
  name: string;
  avatar: string;
  category: {
    id: HashId;
    name: string;
    description: string;
    user_type: number[];
    band_type: number[];
    avatar_on: string;
    avatar_off: string;
  };
  purpose: string;
  body: string;
  user_types: TUserType[];
  joinable_user_types: TUserType[];
  body_type: TBodyType;
  band_type: string; // moa, hospital... 확정 시 타입 변경 필요
  open_range: TOpenRange;
  write_range: 'band' | 'user_all' | 'human';
  user_expose_type: TUserExposeType;
  extension: IMoaExtension | IHospitalExtension | IOnClassStory;
  members: any; // null은 멤버가 비공개인 경우임
  created_at: string;
  members_count: number;
  story_count: number;
  new_story_count: number;
  banners: string[];
  status: string;
  categories: string[];
  tags: string[];
  timelines: ITimeline[];
  band_member_grade: TBandMemberGrade;
  is_in_progress: boolean;
}

export interface IOnClass extends IBand {
  extension: IOnClassStory;
};

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
  extension?: IOnClass; //onClass에서만 사용
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