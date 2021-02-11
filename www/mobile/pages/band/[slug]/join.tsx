import * as React from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import Input from '../../../components/inputs/Input/InputDynamic';
import Button from '../../../components/inputs/Button/ButtonDynamic';
import ButtonGroup from '../../../components/inputs/ButtonGroup';
import ResponsiveLi from '../../../components/UI/ResponsiveLi/ResponsiveLi';
import MoaJoinBodyArea from '../../../components/moa/[slug]/join/MoaJoinBodyArea';
import MoaJoinTitleArea from '../../../components/moa/[slug]/join/MoaJoinTitleArea';
import loginRequired from '../../../hocs/loginRequired';
import saveValueAtNameReducer from '../../../src/lib/element/saveValueAtNameReducer';
import {staticUrl} from '../../../src/constants/env';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {USER_EXPOSE_TYPE_TO_KOR, USER_TYPE_TO_KOR} from '../../../src/constants/users';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $THIN_GRAY} from '../../../styles/variables.types';
import {shallowEqual, useSelector} from 'react-redux';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import useSaveApiResult from '../../../src/hooks/useSaveApiResult';
import BandApi from '../../../src/apis/BandApi';
import {LocalCache} from 'browser-cache-storage';

const StyledButtonGroup = styled(ButtonGroup)`
  max-width: 680px;
  margin: auto;
  text-align: center;
  padding: 30px 0 100px;

  li {
    padding: 0 5px;
  }

  button {
    width: 128px;
    height: 33px;
    box-sizing: border-box;
    border-radius: 17px;
    border: 1px solid ${$THIN_GRAY};
    ${fontStyleMixin({size: 15, color: '#999'})};

    &.right-button {
      color: ${$POINT_BLUE};
      border-color: ${$POINT_BLUE};
    }
  }
`;

const INITIAL_MOA_JOIN = {
  nick_name: '',
  self_introduce: '',
  answers: {},
  isAlreadyNick: false,
  checkedNickName: false,
};

const moaJoinReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        ...action.value
      };
    case 'FIELD':
      return saveValueAtNameReducer(state, action);
    case 'ANSWER_FIELD':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.id]: action.value
        },
      };
    default:
      return state;
  }
};

const BandJoinMobile = React.memo(() => {
  // State
  const [moaJoin, dispatchMoaJoin] = React.useReducer(moaJoinReducer, INITIAL_MOA_JOIN);
  const {nick_name, isAlreadyNick, checkedNickName, self_introduce, answers} = moaJoin;

  const handleOnChangeMoaJoin = ({target: {name, value}}) => {
    dispatchMoaJoin({type: 'FIELD', name, value});
  };

  // Redux
  const me = useSelector(
    ({system, orm}) => pickUserSelector(system.session.id)(orm),
    shallowEqual,
  );
  const {auth_id, name: userName, user_type} = me || {} as any;

  // Router
  const router = useRouter();
  const {query: {slug}} = router;

  // API
  const bandApi: BandApi = useCallAccessFunc(access => access && new BandApi(access));
  const {resData: moaList = {}} = useSaveApiResult(() => bandApi && bandApi.retrieve(slug as string));
  const {avatar, user_expose_type, name, body} = moaList;
  const {resData: moaQuestions = []} = useSaveApiResult(() => bandApi && bandApi.question(slug as string));

  // Function
  const checkAlreadyNick = React.useCallback(() => {
    if (nick_name.length < 3) {
      alert('닉네임을 3글자 이상으로 입력해주세요');
      return null;
    }

    bandApi && bandApi.noCache(`/band/${slug}/nickname/`, {q: nick_name})
      .then(({status, data: {result}}) => {
        if (Math.floor(status / 100) === 2) {
          if (!!result) {
            dispatchMoaJoin({
              type: 'SET_FIELD',
              value: {
                checkedNickName: nick_name,
                isAlreadyNick: result.is_exist,
              },
            });
          }
        }
      });
  }, [bandApi, nick_name]);

  const checkValidData = React.useCallback<() => [boolean, any]>(() => {
    if (user_expose_type === 'nick') {
      if (!nick_name) {
        return [false, {errMsg: '닉네임을 입력해주세요'}];
      } else if (nick_name.length < 3) {
        return [false, {errMsg: '닉네임을 3글자 이상으로 입력해주세요'}];
      } else if (nick_name !== checkedNickName) {
        return [false, {errMsg: '닉네임 중복 체크를 해주세요'}];
      } else if (isAlreadyNick) {
        return [false, {errMsg: '중복된 닉네임입니다'}];
      }
    }

    if (!self_introduce) {
      return [false, {errMsg: '소개글을 입력해주세요'}];
    } else if (!moaQuestions.every(({id}) => !!answers[id])) {
      return [false, {errMsg: '가입질문을 모두 입력해주세요'}];
    }

    return [true, {nick_name, self_introduce, answers}];
  }, [user_expose_type, nick_name, checkedNickName, isAlreadyNick, self_introduce, moaQuestions, answers]);

  return (
    <MoaJoinBodyArea padding="105px 0 100px">
      <MoaJoinTitleArea avatar={avatar}>
        <div className="moa-avatar">
          <img
            src={staticUrl('/static/images/icon/icon-expert.png')}
            alt="모아 대표이미지"
          />
        </div>
        <h2 className="title">{name}</h2>
        <p className="desc pre-line">{body}</p>
      </MoaJoinTitleArea>
      <p className="moa-type-desc">
        {USER_EXPOSE_TYPE_TO_KOR[user_expose_type]}으로 활동하는 모아입니다.
      </p>
      <ul className="apply-form">
        <ResponsiveLi title="신청자 정보">
          <ul>
            <li className="applicant-list">
              <span className="title">ID</span> {auth_id}
            </li>
            {user_expose_type === 'real' && (
              <li className="applicant-list">
                <span className="title">실명</span> {userName}
              </li>
            )}
            {user_expose_type !== 'anon' && (
              <li className="applicant-list">
                <span className="title">구분</span> {USER_TYPE_TO_KOR[user_type]}
              </li>
            )}
            {user_expose_type === 'nick' && (
              <li className="nick-name-list">
                <span className="title">닉네임</span>
                <Input
                  name="nick_name"
                  value={nick_name}
                  onChange={handleOnChangeMoaJoin}
                  placeholder="3~10자(한글,영문,숫자 가능)"
                  regex="VALIDATE_NUMBER_ENGLISH__KOREAN_REQUIRED"
                  maxLength={10}
                />
                <Button
                  font={{size: '13px', color: $GRAY}}
                  size={{width: '113px', height: '44px'}}
                  border={{radius: '0', color: $BORDER_COLOR, width: '1px'}}
                  onClick={checkAlreadyNick}
                >
                  중복체크
                </Button>
                <span className="message">
                  {checkedNickName === nick_name
                    ? isAlreadyNick
                      ? '이미 사용중인 닉네임입니다.'
                      : '사용 가능한 닉네임입니다.'
                    : !!nick_name && nick_name.length >= 3
                      ? '중복 체크를 해주세요.'
                      : '※ 30일마다 변경 가능'
                  }
                </span>
              </li>
            )}
          </ul>
        </ResponsiveLi>
        <ResponsiveLi title="기본 정보">
          <ul>
            <li>
              <span className="title">소개글</span>
              <textarea
                name="self_introduce"
                value={self_introduce}
                onChange={handleOnChangeMoaJoin}
                placeholder="50~500자 이내로 입력해주세요."
                maxLength={500}
              />
            </li>
            <li>
              <span className="title">가입질문</span>
              <ul>
                {moaQuestions.map(({id, question}, idx) => (
                  <li className="join-question" key={question}>
                    <h3>{1 + idx}. {question}</h3>
                    <textarea
                      value={answers[id]}
                      onChange={({target: {value}}) => {
                        dispatchMoaJoin({type: 'ANSWER_FIELD', id, value});
                      }}
                      placeholder="답변을 50자 이내로 입력해주세요"
                      maxLength={50}
                    />
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </ResponsiveLi>
      </ul>
      <StyledButtonGroup
        leftButton={{
          children: '취소',
          onClick: () => {
            const isCancel = confirm('가입을 취소하시겠습니까?');

            if (isCancel) {
              router.back();
            }
          },
        }}
        rightButton={{
          children: '신청하기',
          onClick: () => {
            if (confirm('가입 신청하시겠습니까? 3일이내 관리자 승인 완료 후, 이용 가능합니다.')) {
              const validData = checkValidData();

              if (validData[0]) {
                !!bandApi && bandApi
                  .join(slug as string, validData[1])
                  .then(({status}) => {
                    if (Math.floor(status / 100) !== 4) {
                      LocalCache.del(`band_${slug}`);
                      router.replace(`/band/${slug}`);
                    }
                  });

                return null;
              } else {
                alert(validData[1].errMsg);
              }
            }
          }
        }}
      />
    </MoaJoinBodyArea>
  );
});

BandJoinMobile.displayName = 'BandJoinMobile';
export default loginRequired(BandJoinMobile);
