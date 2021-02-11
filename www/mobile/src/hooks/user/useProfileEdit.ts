import * as React from 'react';
import queryString from 'query-string';
import {PROFILE_TAB} from '../../constants/profile';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../reducers';
import {pickUserSelector} from '../../reducers/orm/user/selector';
import ProfileApi from '../../apis/ProfileApi';
import useCallAccessFunc from '../session/useCallAccessFunc';
import {toDateFormat} from '../../lib/date';
import isEqual from 'lodash/isEqual';
import {VALIDATE_REGEX} from '../../constants/validates';
import UserApi from '../../apis/UserApi';
import {updateUser} from '../../reducers/orm/user/userReducer';
import useLocation from '../router/useLocation';

const useProfileEdit = () => {
  const userApi: UserApi = useCallAccessFunc(access => new UserApi(access));
  const profileApi: ProfileApi = useCallAccessFunc(access => new ProfileApi(access));
  const {history, location} = useLocation();

  const dispatch = useDispatch();

  const {tab} = queryString.parse(location.search);
  const currTab = PROFILE_TAB[tab] || '';

  const {user: me} = useSelector(
    ({system, orm}: RootState) => ({
      user: pickUserSelector(system.session.id)(orm) || {} as any
    }),
    (prev, curr) => isEqual(prev, curr) 
  );

  const [basicInfo, setBasicInfo] = React.useState<IProfileBasicInfo>({
    nick_name: '',
    old_password: '',
    password: '',
    confirm_password: '',
    name: '',
    phone: '',
    birth: '',
    cert_file: '',
    doctor_number: '',
    gender: '',
    jibun_address: '',
    road_address: '',
    zonecode: '',
    address_detail: '',
    email: '',
    imp_uid: '',
    is_email_receive: false,
    is_sms_receive: false
  });

  const [openRange, setOpenRange] = React.useState<IOpenType>({
    edu_open_range: 'secret',
    brief_open_range: 'secret',
    license_open_range: 'secret',
    skill_open_range: 'secret',
    tool_open_range: 'secret',
    thesis_open_range: 'secret',
    is_working: false,
    gender_open_range: 'secret',
    birth_open_range: 'secret',
    phone_open_range: 'secret',
    email_open_range: 'secret',
    nick_name_open_range: 'secret',
    address_open_range: 'secret'
  });

  const getOpenTypes = React.useCallback(() => {
    if (currTab !== 'hospital') {
      profileApi.config()
        .then(({data: {result}}) => {
          !!result && setOpenRange(result);
        });
    }
  }, [currTab]);

  const changeOpenRange = (
    form: {[key: keyof IOpenType]: TProfileOpenRange;}
  ) => {
    profileApi.changeOpenRange(form)
      .then(({status}) => {
        if (Math.floor(status / 100) !== 4) {
          setOpenRange(curr => ({...curr, ...form}));
        }
      });
  };

  const callChangeOpenRange = React.useCallback((key: keyof IOpenType) => range => {
    if (range !== openRange[key]) {
      changeOpenRange({
        [key]: range
      });
    }
  }, [openRange]);

  const deleteProfileAvatar = React.useCallback(() => {
    userApi.deleteProfileAvatar()
      .then(({status, data: {result}}) => {
        if (status === 200) {
          dispatch(updateUser(
            me.id,
            ({...curr}) => ({...curr, avatar: result})
          ));
        }
      });
  }, [me]);

  const patchProfileInfo = React.useCallback((form: Partial<IProfileBasicInfo>, callback?: () => void) => {
    userApi.saveMyInfo(form)
      .then(({data: {result}, status}) => {
        if (status === 200 && !!result) {
          callback && callback();
  
          dispatch(updateUser(
            me.id,
            ({...curr}) => ({...curr, ...result})
          ));
        }
      })
      .catch(({response}) => {
        alert('비밀번호 변경이 정상 처리되지 않았습니다.\n다시 시도해주세요.');
      });
  }, [me]);

  const withdrawService = React.useCallback(() => {
    confirm('한의플래닛 서비스를 탈퇴하시겠습니까?\n탈퇴 시, 모든 정보가 삭제됩니다.') && (
      userApi.withdraw()
        .then(({status}) => {
          if (status === 200) {
            alert('탈퇴 처리가 완료되었습니다.');
            history.push('/logout');
          } else {
            alert('탈퇴 처리에 실패하였습니다.\n다시 시도해주세요.');
          }
        })
        .catch(() => {
          alert('탈퇴 처리에 실패하였습니다.\n다시 시도해주세요.');
        })
    );
  }, []);

  const isValidForm = React.useCallback((me, form: IProfileBasicInfo): [
    boolean,
    (string | Partial<IProfileBasicInfo>)
  ] => {
    const defaultState = {
      old_password: '',
      password: '',
      confirm_password: '',
      imp_uid: '',
      name: me.name,
      phone: me.phone,
      birth: toDateFormat(me.birth, 'YYYYMMDD'),
      doctor_number: me.doctor_number,
      jibun_address: me.jibun_address,
      road_address: me.road_address,
      zonecode: me.zonecode,
      address_detail: me.address_detail,
      email: me.email,
      is_email_receive: me.is_email_receive,
      is_sms_receive: me.is_sms_receive
    };
  
    if (!isEqual(form, defaultState)) {
      let patchForm = {};
  
      const {
        VALIDATE_PASSWORD,
        VALIDATE_BIRTH_WITHOUT_CHARACTER,
        VALIDATE_EMAIL
      } = VALIDATE_REGEX;
  
      const {
        nick_name,
        old_password,
        password,
        confirm_password,
        imp_uid,
        name,
        phone,
        birth,
        doctor_number,
        jibun_address,
        road_address,
        zonecode,
        address_detail,
        email,
        is_email_receive,
        is_sms_receive
      } = form;

      if (!!nick_name) {
        patchForm = {
          ...patchForm,
          nick_name,
        }
      }
  
      if (doctor_number !== defaultState.doctor_number) {
        patchForm = {
          ...patchForm,
          doctor_number
        }
      }

      // 비밀번호 체크
      if (password || old_password || confirm_password) {
        if (!(password && old_password && confirm_password)) {
          return [false, '현재 비밀번호와 비밀번호 변경 값을 입력해주세요.'];
        } else if (!VALIDATE_PASSWORD[0].test(password) || !VALIDATE_PASSWORD[0].test(confirm_password)) {
          return [false, '비밀번호 변경 값과 변경 확인 값의 형식이 올바르지 않습니다.'];
        } else if (password !== confirm_password) {
          return [false, '비밀번호 변경 값과 변경 확인 값이 일치하지 않습니다.'];
        }
  
        patchForm = {
          ...patchForm,
          old_password,
          password
        };
      }
  
      // 휴대폰 번호 체크
      if (phone !== defaultState.phone || name !== defaultState.name) {
        if (!imp_uid) {
          return [false, '휴대폰 인증을 완료해주세요.'];
        }
  
        patchForm = {
          ...patchForm,
          name,
          phone,
          imp_uid
        };
      }
  
      // 생년월일 체크
      if (birth !== defaultState.birth) {
        if (!VALIDATE_BIRTH_WITHOUT_CHARACTER[0].test(birth)) {
          return [false, '입력 양식을 확인해주세요.'];
        }
  
        patchForm = {
          ...patchForm,
          birth: new Date(toDateFormat(birth, 'YYYY-MM-DD')).toISOString()
        };
      }
  
      // 주소 체크
      if (zonecode !== defaultState.zonecode) {
        patchForm = {
          ...patchForm,
          jibun_address,
          road_address,
          zonecode
        };
      }
  
      if (address_detail !== defaultState.address_detail) {
        if (!address_detail) {
          return [false, '상세 주소를 입력해주세요.'];
        }
  
        patchForm = {
          ...patchForm,
          address_detail
        };
      }
  
      // 이메일 체크
      if (email !== defaultState.email) {
        if (!VALIDATE_EMAIL[0].test(email)) {
          return [false, '이메일 형식을 확인해주세요.'];
        }
  
        patchForm = {
          ...patchForm,
          email
        };
      }
  
      // 마케팅 수신 동의 체크
      if (is_email_receive !== defaultState.is_email_receive) {
        patchForm = {
          ...patchForm,
          is_email_receive
        };
      }
  
      if (is_sms_receive !== defaultState.is_sms_receive) {
        patchForm = {
          ...patchForm,
          is_sms_receive
        };
      }
  
      return [true, patchForm];
    }
  
    return [true, {}];
  }, []);

  return {
    currTab,
    me,
    basicInfo,
    setBasicInfo,
    openRange,
    getOpenTypes,
    callChangeOpenRange,
    isValidForm,
    deleteProfileAvatar,
    patchProfileInfo,
    withdrawService
  };
};

export default useProfileEdit;
