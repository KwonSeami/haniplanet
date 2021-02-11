import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import {useRouter} from 'next/router';
import {LocalCache} from 'browser-cache-storage';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import BandApi from '../../apis/BandApi';
import useCallAccessFunc from '../session/useCallAccessFunc';
import {urlWithProtocol} from '../../lib/url';
import {fetchProfileInfo} from '../../reducers/profile';
import {objWithoutFalsyValue} from '../../lib/withoutFalsyValue';
import {IImageItem} from '../../../components/inputs/ImageListUploader';
import {IJobFormState} from '../../../components/profile/hooks/useProfileJobForm';
import {VALIDATE_REGEX} from '../../constants/validates';
import {HashId} from '../../../../../packages/types';

const DEFAULT_MEDICAL_TIME = {
  mon_start_at: '',
  tue_start_at: '',
  wed_start_at: '',
  thu_start_at: '',
  fri_start_at: '',
  sat_start_at: '',
  sun_start_at: '',
  mon_end_at: '',
  tue_end_at: '',
  wed_end_at: '',
  thu_end_at: '',
  fri_end_at: '',
  sat_end_at: '',
  sun_end_at: ''
};

export const DEFAULT_DAY_OF_RECESS = {
  mon: false,
  tue: false,
  wed: false,
  thu: false,
  fri: false,
  sat: false,
  sun: false
};

export interface IHospitalRegisterState {
  name: string;
  telephone: string;
  address: string;
  detail_address: string;
  directions: string;
  can_park: boolean;
  link: string;
  image: Array<IImageItem>;
  category_ids: Array<HashId>;
  tags: ITag[];
  subject_text: string;
  expertise: string;
  body: string;
  no_accept_text: string;
  reservation_text: string;
  etc: string;
  map_location: [number, number];
  medicalTime: typeof DEFAULT_MEDICAL_TIME;
  recessDay: typeof DEFAULT_DAY_OF_RECESS;
}

export type TImageIdsToDelete = HashId[];

export type THospitalTotalState = IHospitalRegisterState & IJobFormState & {
  image_ids_to_delete: TImageIdsToDelete
};

export type THospitalRegisterStatus = 'ADD' | 'EDIT';

export interface IOnBeforeUnload {
  isOnBeforeUnload: boolean;
  replaceUrl: string;
}

const useHospitalRegister = (type: THospitalRegisterStatus) => {
  // Router
  const router = useRouter();
  const {query: {slug}} = router;

  // Redux
  const dispatch = useDispatch();

  const {profile, id} = useSelector(
    ({profile, system: {session: {id}}}) => ({
      profile,
      id
    }),
    shallowEqual
  );

  // API
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  // Regex
  const {
    VALIDATE_PHONE_WITH_HYPHEN: [phoneRegex],
    VALIDATE_HH_MM_TIME: [timeRegex],
    VALIDATE_URL: [urlRegex]
  } = VALIDATE_REGEX;

  const [hospital, setHospital] = React.useState<IHospitalRegisterState>({
    name: '', // 상호명
    telephone: '', // 전화번호
    address: '', // 주소
    detail_address: '', // 상세 주소
    map_location: [] as any, // 지도 x, y 좌표
    directions: '', // 찾아오시는 길
    can_park: true, // 주차 가능 여부
    link: '', // 홈페이지 URL
    image: [], // 대표이미지
    category: [], // 대표분야
    tags: [], // 대표 키워드
    subject_text: '', // 진료과목
    expertise: '', // 진료분야
    body: '', // 한의원 소개
    recessDay: DEFAULT_DAY_OF_RECESS, // 휴진 요일
    medicalTime: DEFAULT_MEDICAL_TIME, // 진료 시간
    no_accept_text: '', // 추가 휴진여부
    reservation_text: '', // 예약안내
    etc: '' // 기타 안내사항
  });

  // State
  const [{isOnBeforeUnload, replaceUrl}, setIsOnBeforeunload] = React.useState<IOnBeforeUnload>({
    isOnBeforeUnload: true,
    replaceUrl: `/band/${slug}`
  });

  // 한의원 수정에서 이미지를 삭제할 때 필요한 State
  const [image_ids_to_delete, setImgIdsToDelete] = React.useState([]);
  // 수정 시 서버에서 받아온 데이터 포맷
  const [responseForm, setResponseForm] = React.useState<THospitalTotalState>({} as THospitalTotalState);

  // 유효성 검사
  const isValidForm = React.useCallback(({state}: {
    state: Partial<THospitalTotalState>,
    responseForm?: Partial<THospitalTotalState>,
    type: THospitalRegisterStatus
  }): [boolean, string | Partial<IHospitalRegisterState>] => {
    const {
      name,
      telephone,
      address,
      detail_address,
      subject_text,
      expertise,
      body,
      recessDay,
      category_ids,
      tag_ids,
      medicalTime,
      reservation_text,
      directions,
      can_park,
      link,
      image,
      no_accept_text,
      map_location,
      etc,
    } = state;

    if (!name) {
      return [false, '상호명을 입력해주세요!'];
    } else if (!telephone) {
      return [false, '전화번호를 입력해주세요!'];
    } else if (!phoneRegex.test(telephone)) {
      return [false, '형식에 맞는 전화번호를 입력해주세요!'];
    } else if (!address) {
      return [false, '주소를 입력해주세요!'];
    } else if (link && !urlRegex.test(link)) {
      return [false, '형식에 맞는 URL을 입력해주세요!'];
    } else if (isEmpty(image)) {
      return [false, '대표 이미지를 등록해주세요!'];
    } else if (!subject_text) {
      return [false, '진료 과목을 입력해주세요!'];
    } else if (!expertise) {
      return [false, '전문분야를 입력해주세요!'];
    } else if (!body) {
      return [false, '한의원 소개를 입력해주세요!'];
    } else if (!reservation_text) {
      return [false, '예약 가능 여부 및 방법을 입력해주세요!'];
    }

    // 진료가 가능한 요일 필터링
    const activeDays = Object.entries(recessDay).filter(day => !day[1]);

    const unregisteredCareTime = [];
    const inappropriateCareTime = [];
    const fasterThanStartCareTime = [];

    activeDays.forEach(day => {
      const _day = day[0];
      const startMedicalTime = medicalTime[`${_day}_start_at`];
      const endMedicalTime = medicalTime[`${_day}_end_at`];

      // 진료 시간을 입력하지 않았을 경우
      unregisteredCareTime.push(!startMedicalTime || !endMedicalTime);

      // 형식에 맞지 않는 진료 시간을 입력 하였을 경우
      inappropriateCareTime.push(!timeRegex.test(startMedicalTime) || !timeRegex.test(endMedicalTime));

      // 종료 진료 시간이 시작 진료 시간보다 빠를 경우
      fasterThanStartCareTime.push(startMedicalTime > endMedicalTime);
    });

    if (unregisteredCareTime.includes(true)) {
      return [false, '진료 시간을 입력해주세요!'];
    }

    if (inappropriateCareTime.includes(true)) {
      return [false, '형식에 맞는 진료 시간을 입력해주세요!'];
    }

    if (fasterThanStartCareTime.includes(true)) {
      return [false, '종료 시간은 시작 시간보다 빠를 수 없습니다.'];
    }

    const sendForm = {
      name,
      telephone,
      map_location,
      address,
      detail_address,
      directions,
      category_ids,
      tag_ids,
      can_park,
      link: link ? urlWithProtocol(link) : '',
      image: image as IImageItem[],
      subject_text,
      expertise,
      body,
      no_accept_text,
      reservation_text,
      etc
    };

    return [true, {
      ...sendForm,
      ...objWithoutFalsyValue(medicalTime)
    }];
  }, []);

  const patchForm = React.useCallback((state: Partial<THospitalTotalState>, initialState: Partial<THospitalTotalState>) => {
    if (isEqual(state, initialState)) {
      return {};
    }

    const form = {};

    for (const key in state) {
      const stateVal = state[key];
      const resVal = initialState[key];

      switch(key) {
        case 'map_location': {
          if (!isEqual(stateVal, resVal)) {
            form[key] = stateVal;
          }
          break;
        }
        case 'image_ids_to_delete': {
          if (!isEmpty(stateVal)) {
            form[key] = stateVal;
          }
          break;
        }
        case 'image': {
          if (!isEqual(stateVal, resVal)) {
            const filteredImage = stateVal.filter(({id}) => !id);
            form[key] = filteredImage;
          }
          break;
        }
        case 'medicalTime': {
          if (!isEqual(stateVal, resVal)) {
            const medicalTimeWithoutNull = objWithoutFalsyValue(stateVal);

            for (const timeKey in medicalTimeWithoutNull) {
              const value = medicalTimeWithoutNull[timeKey];
              form[timeKey] = value;
            }
          }
          break;
        }
        default: {
          if (stateVal !== resVal) {
            form[key] = stateVal;
          }
          break;
        }
      }
    }

    return form;
  }, []);

  const registerHospital = React.useCallback((requestState: Partial<THospitalTotalState>, type: THospitalRegisterStatus) => {
    const {
      image,
      tags,
      name,
      telephone,
      map_location,
      address,
      reservation_text,
      subject_text,
      expertise,
      body,
      etc,
      detail_address,
      subject_list,
      position,
      category_ids,
      directions,
      link,
      medicalTime,
    } = requestState;
    const banners = image.map(({id}, idx) => ({id, order: idx}));
    const tag_ids = tags.map(({id}) => id);

    const form = {
      band_type: 'hospital',
      name,
      telephone: telephone.split("-").join(""),
      coordinates: map_location,
      address,
      reservation_text,
      subject_text,
      expertise,
      body,
      etc,
      detail_address,
      subject_list,
      position,
      category_ids,
      directions,
      link,
      ...medicalTime,
      tag_ids,
      banners,
    };

    (type === 'ADD'
        ? bandApi.create(form)
        : bandApi.partial_update(slug as string, form)
    ).then(({status, data:{result}}) => {
      if (Math.floor((status) / 100) === 2) {
        LocalCache.del(`band_${slug}_v2`);
        alert(`한의원이 성공적으로 ${type === 'ADD' ? '등록' : '수정'}되었습니다.`);
        setIsOnBeforeunload({isOnBeforeUnload: false, replaceUrl:(`/band/${result.slug}`)});
      }
    });
  }, []);

  React.useEffect(() => {
    window.onbeforeunload = () => isOnBeforeUnload || null;
    !isOnBeforeUnload && router.replace(replaceUrl);

    return () => window.onbeforeunload = () => null;
  }, [isOnBeforeUnload]);

  // Dispatch to get profile-edu info.
  React.useEffect(() => {
    if (id) {
      dispatch(fetchProfileInfo(id, 'edu'));
    }
  }, [id]);

  // Check whether user has profile-edu info.
  React.useEffect(() => {
    if (id) {
      const myProfile = profile[id];

      if (!isEmpty(myProfile) && !isEmpty(myProfile.edu)) {
        const hasEdu = !isEmpty(myProfile.edu.ids);

        !hasEdu && (
          alert(`한의원 ${type === 'EDIT' ? '정보 수정' : '신규 등록'}을 위해서는 프로필 내의 학력 항목 입력이 필요합니다.`)
        );
      }
    }
  }, [profile, id]);

  return {
    hospital,
    setHospital,
    isOnBeforeUnload,
    setIsOnBeforeunload,
    isValidForm,
    registerHospital,
    image_ids_to_delete,
    setImgIdsToDelete,
    responseForm
  };
};

export default useHospitalRegister;
