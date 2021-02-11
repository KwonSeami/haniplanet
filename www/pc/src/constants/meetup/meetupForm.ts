import {MEETUP_OPTIONS} from ".";
import v4 from "uuid/v4";

export const defaultFormValues = {
  address: '',
  body_type: 'froala',
  body: '',
  capacity: '',
  category: '교육/강연',
  coordinates: [],
  detail_address: '',
  file_uids: [],
  image_uids: [],
  is_online_meetup: false,
  online_note: '',
  teacher_info: '',
  payment_info: '',
  open_range: 'user_all',
  options: [MEETUP_OPTIONS.send_sms], // 옵션정보 탭의 기본값을 SMS 발송으로 설정
  products: [{
    id: v4(),
    user_types: ['doctor'],
    text: '',
    price: '',
    name: ''
  }],
  progress_range: [null, null],
  questions: [{}, {}],
  receipt_range: [null, null],
  refund_policy: 'normal',
  region: null,
  tags: [],
  time: {
    startHour: '',
    startMinute: '',
    endHour: '',
    endMinute: ''
  },
  title: '',
  user_types: ['doctor']
};

export const localFormStructure = [
  'address',
  'avatar',
  'body_type',
  'body',
  'capacity',
  'category',
  'coordinates',
  'detail_address',
  'is_online_meetup',
  'online_note',
  'options',
  'teacher_info',
  'payment_info',
  'products',
  'progress_range',
  'questions',
  'receipt_range',
  'refund_policy',
  'region',
  'tags',
  'time',
  'title',
  'user_types',
];

export const formTimeTypes = [['startHour', 'startMinute'], ['endHour', 'endMinute']];

// progress_range, receipt_range의 값들에 각각 시작 시/분과 종료 시/분을 추가 & ISO 8601 형식으로 변환하는 함수
export const rangeFormatter = (range, time) =>
  new Date(new Date(range).setHours(parseInt(time[0], 10), parseInt(time[1], 10))).toISOString();