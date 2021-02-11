interface IJoinPath {
  id: number;
  text: string;
}

export interface IUser {
  id: HashId;
  name?: string;
  nick_name?: string;
  email?: string;
  image?: string;
  auth_id?: string;
  user_type: TUserType;
  is_admin?: boolean;
  point?: number;
  phone?: string;
  address?: IAddress;
  changed_at?: string;
  new_count?: number;
  note_count?: number;
  password_updated_at?: string;
  password_warned_at?: string;
  hospital?: number;
  reqStatus?: number; // 휴면계정인 경우 410 이 전달되기 때문에 그부분 저장을 위한 필드
  // TODO: 이력서 폼 작성 부분이 머지되면, 해당 타입 정의가 이뤄져야 합니다.
  job_info?: any;
  is_proxy_join?: boolean;
  is_regular?: boolean;
  status?: 'active' | 'rest' | 'inactive';
}

interface IMemberProfile extends IUser {
  is_edu_open: boolean;
  is_brief_open: boolean;
  is_office: boolean;
  is_info_recv: boolean;
  is_license_open: boolean;
  is_skill_open: boolean;
  is_sms_recv: boolean;
  is_thesis_open: boolean;
  is_tool_open: boolean;
  is_job_available: boolean;
  is_hospital_owner: boolean;
}

type Id = number;
type HashId = string;

type TUserType = 'doctor' | 'student' | '';

export type TUserExposeType = 'nick' | 'real' | 'anon';
