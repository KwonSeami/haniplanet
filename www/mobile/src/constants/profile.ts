export const PROFILE_OPEN_OPTIONS: IProfileOpenOption[] = [
  {
    label: '전체공개',
    value: 'user_all'
  },
  {
    label: '나만보기',
    value: 'secret'
  }
];

export const PROFILE_TAB = {
  additional: 'additional',
  hospital: 'hospital'
};

// Profile - Skill, Tool
export const LEVEL = [
  {label: '상', value: 'high'},
  {label: '중', value: 'medium'},
  {label: '하', value: 'low'}
];

export const LEVEL_TO_KOR = {
  high: '상',
  medium: '중',
  low: '하'
};

// Profile - Edu
export const EDU_DEGREE_TYPE = [
  {label: '학사', value: 'bachelor'},
  {label: '석사', value: 'master'},
  {label: '박사', value: 'doctor'}
];

export const DEGREE_TYPE_TO_KOR = {
  bachelor: '학사',
  master: '석사',
  doctor: '박사'
};

export const EDU_PROGRESS_STATUS = [
  {label: '재학중', value: 'attending'},
  {label: '휴학중', value: 'on_leave'},
  {label: '수료', value: 'completion'},
  {label: '편입', value: 'transfer'},
  {label: '중퇴', value: 'drop_out'},
  {label: '자퇴', value: 'drop_off'},
  {label: '졸업예정', value: 'expected_to_graduate'},
  {label: '졸업', value: 'graduated'}
];

export const PROGRESS_STATUS_TO_KOR = {
  attending: '재학중',
  on_leave: '휴학중',
  completion: '수료',
  transfer: '편입',
  drop_out: '중퇴',
  drop_off: '자퇴',
  expected_to_graduate: '졸업예정',
  graduated: '졸업'
};

export const POSITION_TYPES: Array<{
  label: TPosition,
  value: TPosition
}> = [
  {label: '대표원장', value: '대표원장'},
  {label: '진료원장', value: '진료원장'}
];

export const SUBJECT_TYPES: Array<{
  label: TSubject,
  value: TSubject
}> = [
  {label: '체형교정', value: '체형교정'},
  {label: '약침', value: '약침'},
  {label: '스포츠손상', value: '스포츠손상'},
  {label: '디스크', value: '디스크'},
  {label: '추나', value: '추나'},
  {label: '미용/다이어트', value: '미용/다이어트'},
  {label: '비만', value: '비만'},
  {label: '건강증진', value: '건강증진'},
  {label: '피부과', value: '피부과'},
  {label: '통증과', value: '통증과'},
  {label: '여성질환', value: '여성질환'},
  {label: '남성질환', value: '남성질환'},
  {label: '소아과', value: '소아과'},
  {label: '내과', value: '내과'},
  {label: '재활과', value: '재활과'},
  {label: '침구과', value: '침구과'}
];
