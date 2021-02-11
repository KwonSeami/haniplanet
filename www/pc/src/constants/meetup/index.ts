import {$TEXT_GRAY, $GRAY} from "../../../styles/variables.types";

export const MENU_LIST = [
  {name: '나의 개설내역', value: 'created'},
  {name: '나의 신청내역', value: 'applied'},
  {name: '세미나/모임 즐겨찾기', value: 'followed'},
  {name: '나의 강의실', value: 'onclass'},
];

export const MEETUP_OPTIONS = {
  training_service: 16,
  send_sms: 17,
  kakaotalk_promotion: 18,
  facebook_promotion: 19,
  mass_message: 20,
  staff_service: 21
};

export const MEETUP_TYPE_LIST = [
  {label: '교육/강연', value: 'lecture'},
  {label: '스터디', value: 'study'},
  {label: '취미/소모임', value: 'club'},
] as const;

export const MEETUP_DEFAULT_IMAGE = type => {
  return `https://hani-public.s3.ap-northeast-2.amazonaws.com/images/static/meetup-${type}.png`
};

export const MEETUP_STATUS_LIST = [
  {label: '전체', value: ''},
  {label: '모집중', value: 'ongoing'},
  {label: '마감임박', value: 'deadline'},
  {label: '오픈예정', value: 'tobe'},
  {label: '마감', value: 'end'},
];

export const LINE_TYPE = [
  {label: '전체', value: ''},
  {label: '오프라인', value: 'offline'},
  {label: '온라인', value: 'online'},
] as const;

export const CATEGORY_TYPE_LIST = [
  {label: '전체', value: ''},
  {label: '교육/강연', value: '교육/강연'},
  {label: '스터디', value: '스터디'},
  {label: '취미/소모임', value: '취미/소모임'},
];

export const APPLIED_STATUS_LIST = {
  end: {
    status: '마감',
    color: $TEXT_GRAY
  },
  tobe: {
    status: '오픈예정',
    color: $GRAY
  },
  deadline: {
    status: '마감임박',
    color: '#f32b43'
  },
  ongoing: {
    status: '모집중',
    color: '#499aff'
  },
  cancel: {
    status: '취소됨',
    color: $TEXT_GRAY
  },
};

export const APPLY_TYPE_LIST = [
  {label: '전체', value: ''},
  {label: '결제완료', value: 'ok'},
  {label: '환불완료', value: 'refund'}
];

export const PAYMENT_STATUS = {
  ongoing: '처리중',
  ok: '결제완료',
  refund: '환불완료',
  partial_refund: '부분환불'
};

export const MY_CLASS_STATUS = [
  {label: '전체', value: ''},
  {label: '수강가능', value: 'available'},
  {label: '수강종료', value: 'unavailable'},
];

export const USER_TYPE_COLOR = {
  doctor: {value: '한의사', color: '#7fc397'},
  student: {value: '한의대생', color: '#9586d0'}
};

export const LEARNING_STATUS = {
  extend: '수강 연장',
  retake: '재수강'
};

export const ONCLASS_MEMBER = {
  owner: '', //강의실소유자
  admin: '강사',
  staff: '', //한의플래닛전용
  normal: '수강생'
};

export const ONCLASS_MEMBER_TYPES = ['owner', 'admin', 'staff', 'normal'];