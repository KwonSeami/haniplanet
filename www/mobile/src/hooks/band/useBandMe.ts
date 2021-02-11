import * as React from 'react';
import {useRouter} from 'next/router';
import {pickBandSelector} from '../../reducers/orm/band/selector';
import {RootState} from '../../reducers';
import {useDispatch, useSelector} from 'react-redux';
import BandApi from '../../apis/BandApi';
import {pickUserSelector} from '../../reducers/orm/user/selector';
import {fetchBandThunk} from '../../reducers/orm/band/thunks';
import useCallAccessFunc from '../session/useCallAccessFunc';
import {isEqual} from 'lodash';
import {updateBand} from '../../reducers/orm/band/bandReducer';

interface State {
  myInfo: any;
  nickname: string;
  isPossibleNickname: boolean;
}

const useBandMe = (slug: string) => {
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const dispatch = useDispatch();
  const router = useRouter();

  const {
    band,
    user: {
      user_type,
      auth_id
    }
  } = useSelector(
    ({system, orm}: RootState) => ({
      band: pickBandSelector(slug)(orm),
      user: pickUserSelector(system.session.id)(orm) || {} as any
    }),
    (prev, curr) => isEqual(prev, curr)
  );

  const [{
    myInfo,
    nickname,
    isPossibleNickname,
  }, setMyInfo] = React.useState<State>({
    myInfo: {
      user: '',
      self_introduce: '',
      answer: {
        answers: {},
        questions: {}
      },
      nick_name_updated_at: ''
    },
    nickname: '',
    isPossibleNickname: null,
  });

  const checkIsDuplicateNickname = React.useCallback(() => {
    const nicknameLeng = nickname.length;

    if (nicknameLeng >= 3 && nicknameLeng <= 10) {
      bandApi.checkNickname(slug, nickname)
        .then(({data: {result}}) => {
          result && setMyInfo(curr => ({
            ...curr,
            isPossibleNickname: !result.is_exist
          }));
        });
    } else {
      alert('3~10자 이내로 입력 가능합니다.');
    }
  }, [slug, nickname]);

  const leaveMoa = React.useCallback(() => {
    confirm(`${band.name}을(를) 탈퇴하시겠습니까?`) && (
      bandApi.leaveMoa(slug, myInfo.id)
        .then(({status}) => {
          if (Math.floor(status / 100) !== 4) {
            dispatch(updateBand(slug, {
              member_count: band.member_count - 1
            }));
  
            alert('탈퇴 처리되었습니다.');
            router.push('/band');
          } else {
            alert('탈퇴가 정상 처리되지 않았습니다!\n다시 시도해주세요.');
          }
        })
        .catch(() => {
          alert('탈퇴가 정상 처리되지 않았습니다!\n다시 시도해주세요.');
        })
    );
  }, [band, slug, myInfo.id]);

  const changeNickname = React.useCallback(() => {
    if (!!isPossibleNickname) {
      bandApi.changeNickname(slug, myInfo.id, nickname)
        .then(({status}) => {
          if (Math.floor(status / 100) !== 4) {
            alert('변경이 완료되었습니다.');
            router.push(`/band/${slug}`);
          }
        });
    } else {
      alert('닉네임 중복 체크를 해주세요.');
    }
  }, [isPossibleNickname, slug, myInfo.id, nickname]);

  const getInitialMyInfo = React.useCallback(() => {
    bandApi.me(slug)
      .then(({data: {result}}) => {
        result && setMyInfo(curr => ({...curr, myInfo: result}));
      });
  }, [slug]);

  React.useEffect(() => {
    dispatch(fetchBandThunk(bandApi, slug));
    getInitialMyInfo();
  }, [slug]);

  return {
    band,
    user_type,
    auth_id,
    leaveMoa,
    checkIsDuplicateNickname,
    changeNickname,
    myInfo,
    setMyInfo,
    nickname,
    isPossibleNickname
  };
};

export default useBandMe;
