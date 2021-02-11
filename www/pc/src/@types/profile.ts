type TProfileOpenRange = Exclude<TOpenRange, 'human'>;

interface IProfileBasicInfo {
  old_password: string;
  password: string;
  confirm_password: string;
  phone: string;
  birth: string;
  doctor_number: number;
  gender: string;
  jibun_address: string;
  road_address: string;
  zonecode: string;
  address_detail: string;
  email: string;
  imp_uid: string;
  is_email_receive: boolean;
  is_sms_receive: boolean;
  isButton?: boolean;
  isBasic?: boolean;
  backgroundImg?: string;
}

interface IOpenType {
  edu_open_range: TProfileOpenRange;
  brief_open_range: TProfileOpenRange;
  license_open_range: TProfileOpenRange;
  skill_open_range: TProfileOpenRange;
  tool_open_range: TProfileOpenRange;
  thesis_open_range: TProfileOpenRange;
  is_working: boolean;
  gender_open_range: TProfileOpenRange;
  birth_open_range: TProfileOpenRange;
  phone_open_range: TProfileOpenRange;
  email_open_range: TProfileOpenRange;
  nick_name_open_range: TProfileOpenRange;
  address_open_range: TProfileOpenRange;
}

interface IProfileOpenOption {
  label: string;
  value: TProfileOpenRange;
}

type TEduDegreeType = 'bachelor' | 'master' | 'doctor'; // 각 학사, 석사, 박사
type TEduProgressStatus = 'attending' // 재학중
  | 'on_leave' // 휴학중 
  | 'completion' // 수료
  | 'transfer' // 편입
  | 'drop_out' // 중퇴
  | 'drop_off' // 자퇴
  | 'expected_to_graduate' // 졸업예정
  | 'graduated'; // 졸업

interface IProfileEdu {
  id: HashId;
  admission_at: string;
  degree_type: TEduDegreeType;
  graduate_at: string;
  major_name: string;
  progress_status: TEduProgressStatus;
  school_name: string;
}

interface IProfileBrief {
  id: HashId;
  start_at: string;
  end_at: string;
  title: string;
}

interface IProfileThesis {
  id: HashId;
  title: string;
}

interface IProfileLicense {
  id: HashId;
  acquisition_at: string;
  is_specialist: boolean;
  name: string;
  organization: string;
}

type TLevel = 'high' | 'medium' | 'low';

interface IProfileSkill {
  id: HashId;
  level: TLevel;
  skill_subset: string;
  description: string;
}

interface IProfileTool {
  id: HashId;
  tool: string; // /profile/tool/ 호출 시의 pk
  level: TLevel;
}

type TPosition = '대표원장' | '진료원장';

type TSubject = '체형교정'
  | '약침'
  | '스포츠손상'
  | '디스크'
  | '추나'
  | '미용/다이어트'
  | '비만'
  | '건강증진'
  | '피부과'
  | '통증과'
  | '여성질환'
  | '남성질환'
  | '소아과'
  | '내과'
  | '재활과'
  | '침구과';

type TProfileFormParams = IProfileEdu
  | IProfileBrief
  | IProfileThesis
  | IProfileLicense
  | IProfileSkill
  | IProfileTool;

type TProfileFormParamsExceptId<T extends TProfileFormParams> = Omit<T, 'id'>;

type TProfileFormName = 'edu'
  | 'brief'
  | 'thesis'
  | 'license'
  | 'skill'
  | 'tool';

interface IProfileCommonProps {
  selectValue?: TProfileOpenRange;
  selectOption?: IProfileOpenOption[];
  setShowAddTab?: (data: boolean) => void;
  onSelectClick?: (range: TProfileOpenRange) => void;
  id: HashId;
  isMe?: boolean;
  showType?: 'detail' | 'simple';
  subTitle?: string | React.ReactNode;
  className?: string;
}

interface IProfileFormCommonProps<T> {
  onAddForm?: (form: T, callback: () => void) => void;
  onDeleteForm?: (formId: HashId) => void;
  onEditForm?: (formId: HashId, form: T, callback?: () => void) => void;
  onCreateForm?: () => void;
  onFilterUnSavedForm?: (formId: HashId) => void;
  type: 'ADD' | 'EDIT';
  isAddBtnVisible?: boolean;
  controllable?: boolean;
}
