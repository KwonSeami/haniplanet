import {string, array, object} from 'yup';
import {VALIDATE_REGEX} from '../../../../src/constants/validates';

const {VALIDATE_PHONE_WITH_HYPHEN: [phoneRegex]} = VALIDATE_REGEX;

const hospitalRegisterSchema = object().shape({
  name: string().required('상호명을 입력해주세요!'),
  tags: array().required('대표 키워드를 입력해주세요!'),
  telephone: string()
    .required('전화번호를 입력해주세요!')
    .matches(phoneRegex, '형식에 맞는 전화번호를 입력해주세요!'),
  address: string().required('주소를 입력해주세요!'),
  link: string().url('형식에 맞는 URL을 입력해주세요!'),
  mainImg: object().shape({
    id: string().required('대표 이미지를 등록해주세요!'),
    image: string().required('대표 이미지를 등록해주세요!'),
  }),
  subject_text: string().required('진료 과목을 입력해주세요!'),
  expertise: string().required('전문분야를 입력해주세요!'),
  body: string().required('한의원 소개를 입력해주세요!'),
  reservation_text: string().required('예약 가능 여부 및 방법을 입력해주세요!'),
  subject_list: array().required('진료분야를 선택해주세요!'),
  self_introduce: string().required('인사말을 입력해주세요!'),
});

const validateHospitalRegister = (hospitalForm: any) => hospitalRegisterSchema.validate(hospitalForm);

export default validateHospitalRegister;