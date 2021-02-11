import * as React from 'react';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $THIN_GRAY, $WHITE} from '../../../styles/variables.types';
import {MONTH} from '../../../src/constants/times';
import {ADMIN_PERMISSION_GRADE} from '../../../src/constants/band';
import {USER_EXPOSE_TYPE_TO_KOR, USER_TYPE_TO_KOR} from '../../../src/constants/users';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import useBandMe from '../../../src/hooks/band/useBandMe';
import {RouteComponentProps} from 'react-router';
import styled from 'styled-components';
import Button from '../../../components/inputs/Button';
import {useRouter} from 'next/router';
import isEmpty from 'lodash/isEmpty';
import * as cn from 'classnames';
import loginRequired from '../../../hocs/loginRequired';

const Section = styled.section`
  width: 100%;
  background-color: #f6f7f9;
  padding: 105px 0 90px;

  @media screen and (max-width: 680px) {
    padding: 0;
  }
`;

const ApplyFormDiv = styled.div`
  max-width: 580px;
  margin: auto;
  box-sizing: border-box;
  padding: 20px 25px 11px;
  background-color: ${$WHITE};
  border-bottom: 1px solid ${$BORDER_COLOR};

  & > ul > li {
    padding-bottom: 22px;

    h3 {
      ${fontStyleMixin({
  size: 11,
  weight: 'bold'
})}
      padding-bottom: 2px;
      line-height: 1;
    }

    .msg {
      padding: 5px 0 3px;
      ${fontStyleMixin({
  size: 11,
  color: $TEXT_GRAY
})}

      span {
        padding-left: 5px;
        color: ${$POINT_BLUE};

        &.error {
          color: #ea6060;
        }
      }
    }

    .content {
      width: 100%;
      height: 180px;
      margin-top: 8px;
      padding: 8px 12px;
      box-sizing: border-box;
      background-color: #f6f7f9;
      ${fontStyleMixin({
  size: 14,
  color: $GRAY
})}
    }

    .user-info {
      padding-top: 2px;
      
      li {
        display: inline-block;
        vertical-align: middle;
        padding-right: 23px;
        ${fontStyleMixin({
  size: 16,
  color: $TEXT_GRAY
})}

        h3 {
          margin-top: -2px;
          padding-bottom: 0;
          display: inline-block;
          vertical-align: middle;
        }
      }
    } 

    .join-question {

      &:first-child {
        padding: 12px 0 23px;
      }

      h3 {
        ${fontStyleMixin({
  size: 14,
  weight: 'normal'
})}
      }

      .content {
        height: 80px;
      }
    }
  }

  @media screen and (max-width: 680px) {
    padding: 20px 15px 10px;

    & > ul > li {
      padding-bottom: 23px;

      .join-question:first-child {
        padding: 9px 0 24px;
      }
    }
  }
`;

const StyledButton = styled(Button)`
  display: inline-block;
  vertical-align: bottom;
`;

const Input = styled.input`
  display: inline-block !important;
  vertical-align: middle;
  width: calc(100% - 121px);
  margin-right: 8px;
  height: 44px;
  border-bottom: 1px solid ${$BORDER_COLOR} !important;
  ${fontStyleMixin({
  size: 14,
  color: $TEXT_GRAY
})}
`;

const ButtonUl = styled.ul`
  max-width: 580px;
  margin: auto;
  padding: 30px 0 60px;
  background-color: ${$WHITE};
  text-align: center;

  li {
    display: inline-block;
    vertical-align: middle;
    padding: 0 7.5px;
  }
`;

interface Props extends RouteComponentProps {
  user: any; // 임시 타입
  session: ISessionState;
}

const MoaMyInfoMobile: React.FC<Props> = React.memo(() => {
  const router = useRouter();
  const {query: {slug}} = router;

  const {
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
  } = useBandMe(slug);

  if (band === undefined) {
    return null;
  }

  const {
    user_expose_type,
    band_member_grade
  } = band;

  const {
    user,
    self_introduce,
    answer,
    nick_name_updated_at
  } = myInfo;
  const {answers, questions} = answer || {};
  const nicknameUpdatedAt = new Date(nick_name_updated_at).getTime();
  const since = new Date().getTime() - nicknameUpdatedAt;

  return (
    <Section>
      <ApplyFormDiv>
        <ul>
          <li>
            {!isEmpty(user) && (
              <ul className="user-info">
                <li>
                  <h3>ID</h3> {auth_id}
                </li>
                {user_expose_type !== 'anon' && (
                  <li>
                    <h3>{USER_EXPOSE_TYPE_TO_KOR[user_expose_type]}</h3>&nbsp;
                    {user[user_expose_type === 'real'
                      ? 'name'
                      : 'nick_name'
                      ]}
                  </li>
                )}
                <li>
                  <h3>구분</h3> {USER_TYPE_TO_KOR[user_type]}
                </li>
              </ul>
            )}
          </li>
          {user_expose_type === 'nick' && (
            <li>
              <h3>닉네임</h3>
              <Input
                type="text"
                placeholder="3~10자(한글,영문,숫자 가능)"
                maxLength={10}
                value={nickname}
                onChange={({target: {value}}) => {
                  setMyInfo(curr => ({
                    ...curr,
                    nickname: value,
                    isPossibleNickname: null
                  }));
                }}
              />
              <StyledButton
                border={{
                  radius: '0',
                  color: $BORDER_COLOR,
                  width: '1px'
                }}
                size={{
                  width: '113px',
                  height: '44px'
                }}
                font={{
                  size: '13px',
                  color: $GRAY
                }}
                onClick={() => {
                  checkIsDuplicateNickname();
                }}
                disabled={since < MONTH}
              >
                중복체크
              </StyledButton>
              <p className="msg">
                ※ 30일마다 변경 가능
                {(isPossibleNickname !== null) && (
                  isPossibleNickname ? (
                    <span>사용 가능한 닉네임입니다.</span>
                  ) : (
                    <span className="error">이미 사용중인 닉네임입니다.</span>
                  )
                )}
              </p>
            </li>
          )}
          {band_member_grade === 'normal' && (
            <>
              <li>
                <h3>자기소개</h3>
                <p className="content">{self_introduce || ''}</p>
              </li>
              <li>
                <h3>가입질문</h3>
                <ul>
                  {!isEmpty(answers) && Object.keys(answers).map((key, idx) => (
                    <li
                      className="join-question"
                      key={key}
                    >
                      <h3>{idx + 1}. {questions[key]}</h3>
                      <p className="content">{answers[key]}</p>
                    </li>
                  ))}
                </ul>
              </li>
            </>
          )}
        </ul>
      </ApplyFormDiv>
      <ButtonUl>
        {nickname && (
          <li>
            <Button
              size={{
                width: '128px',
                height: '33px'
              }}
              border={{
                radius: '20px',
                width: '1px',
                color: $POINT_BLUE
              }}
              font={{
                size: '15px',
                color: $POINT_BLUE
              }}
              onClick={() => {
                changeNickname();
              }}
            >
              확인
            </Button>
          </li>
        )}
        {!ADMIN_PERMISSION_GRADE .includes(band_member_grade) && (
          <li>
            <Button
              size={{
                width: '128px',
                height: '33px'
              }}
              border={{
                radius: '20px',
                width: '1px',
                color: $THIN_GRAY
              }}
              font={{
                size: '15px',
                color: $THIN_GRAY
              }}
              onClick={() => {
                leaveMoa();
              }}
            >
              탈퇴하기
            </Button>
          </li>
        )}
      </ButtonUl>
    </Section>
  );
});

MoaMyInfoMobile.displayName = 'MoaMyInfoMobile';
export default loginRequired(MoaMyInfoMobile);
