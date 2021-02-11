import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import loginRequired from '../../../hocs/loginRequired';
import Loading from '../../../components/common/Loading';
import NoContent from '../../../components/NoContent/NoContent';
import WaypointHeader from '../../../components/layout/header/WaypointHeader';
import ResponsiveLi, {Div, H3} from '../../../components/UI/ResponsiveLi/ResponsiveLi';
import useBandOpened from '../../../src/hooks/band/useBandOpened';
import {toDateFormat} from '../../../src/lib/date';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {USER_EXPOSE_TYPE_TO_KOR, USER_TYPE_TO_KOR} from '../../../src/constants/users';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY} from '../../../styles/variables.types';
import MoaHeader from '../../../components/band/MoaHeader';
import {useDispatch} from 'react-redux';
import {setLayout, clearLayout} from '../../../src/reducers/system/style/styleReducer';

const ApplyFormUl = styled.ul`
  width: 680px;
  margin: 40px auto 100px;
  border-bottom: 1px solid ${$BORDER_COLOR};
  padding: 0 222.5px;
`;

const StyledResponsiveLi = styled(ResponsiveLi)`
  border-top: 1px solid ${$BORDER_COLOR};
  padding-bottom: 0;

  ${H3} {
    top: 16px;
    letter-spacing: -2px;
    ${fontStyleMixin({
      size: 19,
      weight: '300'
    })}
  }

  ${Div} {
    padding: 16px 0 30px 148px;
  }
`;

const TitleSpan = styled.span`
  ${fontStyleMixin({
    size: 11,
    weight: 'bold',
    color: $TEXT_GRAY
  })}
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  margin-top: -3px;
`;

const ApplicantLi = styled.li`
  display: inline-block;
  vertical-align: middle;
  padding: 3px 50px 0 0;
  font-size: 15px;
`;

const SettingP = styled.p`
  font-size: 15px;
  padding: 5px 0 12px;

  span {
    padding-left: 7px;
    ${fontStyleMixin({
      size: 11,
      weight: '600',
      color: $TEXT_GRAY
    })}
  }
`;

const InfoTitle = styled.h2`
  ${fontStyleMixin({
    size: 11,
    weight: '600',
    color: $TEXT_GRAY
  })}
  display: inline-block;
  vertical-align: middle;
  width: 100px;
  padding-bottom: 7px;
`;

const ApplicantUl = styled.ul`
  display: inline-block;
  vertical-align: middle;
  width: calc(100% - 100px);
  padding: 0 0 14px;
`;

const Infoul = styled.ul`
  margin-top: -9px;
`;

const InfoLi = styled.li`
  position: relative;
  padding: 0 0 10px 100px

  ${TitleSpan} {
    position: absolute;
    left: 0;
    top: 18px;
  }

  p {
    ${heightMixin(44)}
    font-size: 15px;
    border-bottom: 1px solid ${$BORDER_COLOR};

    .line {
      width: 1px;
      height: 10px;
      margin: 0 5px;
      display: inline-block;
      vertical-align: middle;
      background-color: ${$BORDER_COLOR};
    }

    strong {
      ${fontStyleMixin({
        weight: 'normal',
        color: $POINT_BLUE
      })}
    }
  }  
`;

const TextareaLi = styled.li`
  padding-top: 15px;

  ${TitleSpan} {
    padding-bottom: 8px;
  }

  p {
    min-height: 80px;
    box-sizing: border-box;
    background-color: #f6f7f9;
    padding: 8px 12px;
    ${fontStyleMixin({
      size: 14,
      color: $GRAY
    })}

    &.large {
      min-height: 180px;
    }
  }
`;

const JoinQuestionLi = styled.li`
  position: relative;
  padding: 10px 0 0 83px;

  ${TitleSpan} {
    position: absolute;
    left: 0;
    top: 25px;
  }

  li {
    list-style: decimal;
    font-size: 14px;
    ${heightMixin(44)};
    box-sizing: border-box;
    border-bottom: 1px solid ${$BORDER_COLOR};
  }
`;

const BandOpenedPC = React.memo(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const {query: {slug}} = router;

  React.useEffect(() => {
    dispatch(setLayout({
      background: 'transparent',
      fakeHeight: false,
      position: 'absolute'
    }));

    return () => {
      dispatch(clearLayout());
    }
  }, []);

  const {
    band,
    pending,
    openedInfo,
    question
  } = useBandOpened(slug);

  if (pending) {
    return <Loading />;
  }

  if (band === undefined || isEmpty(openedInfo) || isEmpty(question)) {
    return (
      <NoContent>
        MOA를 찾을 수 없습니다
      </NoContent>
    );
  }

  const {
    name,
    purpose,
    body,
    avatar,
    category,
    user_expose_type
  } = band;
  const {user, created_at} = openedInfo;

  const nameByExposeType = USER_EXPOSE_TYPE_TO_KOR[user_expose_type];

  return (
    <WaypointHeader
      headerComp={
        <MoaHeader
          avatar={avatar}
          title="개설 신청 내역"
          linkProps={{href: '/band'}}
        >
          MOA
        </MoaHeader>
      }
    >
      <ApplyFormUl>
        <StyledResponsiveLi title="공개 설정">
          <SettingP>
            {nameByExposeType} MOA
            <span>{nameByExposeType}으로만 활동 하는 커뮤니티입니다.</span>
          </SettingP>
        </StyledResponsiveLi>
        <StyledResponsiveLi
          title="신청자 정보"
        >
          <InfoTitle>신청자 정보</InfoTitle>
          <ApplicantUl>
            <ApplicantLi>
              <TitleSpan>ID</TitleSpan> {user.auth_id}
            </ApplicantLi>
            <ApplicantLi>
              <TitleSpan>{nameByExposeType}</TitleSpan>&nbsp;
              {user.name || user.nick_name}
            </ApplicantLi>
            <ApplicantLi>
              <TitleSpan>구분</TitleSpan> {USER_TYPE_TO_KOR[user.user_type]}
            </ApplicantLi>
          </ApplicantUl>
        </StyledResponsiveLi>
        <StyledResponsiveLi title="기본 정보">
          <Infoul>
            <InfoLi>
              <TitleSpan>가입신청일</TitleSpan>
              <p>
                {toDateFormat(created_at, 'YYYY.MM.DD')}&nbsp;
                <span className="line"/>&nbsp;
                {toDateFormat(created_at, 'HH:MM')}
              </p>
            </InfoLi>
            <InfoLi>
              <TitleSpan>카테고리 선택</TitleSpan>
              <p>{category.name}</p>
            </InfoLi>
            <InfoLi>
              <TitleSpan>커뮤니티 명</TitleSpan>
              <p>{name}</p>
            </InfoLi>
            <InfoLi>
              <TitleSpan>커뮤니티 주소</TitleSpan>
              <p>https://www.haniplanet.com/band/<strong>{slug}</strong></p>
            </InfoLi>
            <TextareaLi>
              <TitleSpan>개설목적</TitleSpan>
              <p>
                {purpose}
              </p>
            </TextareaLi>
            <TextareaLi>
              <TitleSpan>소개글</TitleSpan>
              <p className="large">
                {body}
              </p>
            </TextareaLi>
            <JoinQuestionLi>
              <TitleSpan>가입 질문</TitleSpan>
              <ul>
                {Object.values(question[slug]).map(({id, question}) => (
                  <li key={id}>
                    {question}
                  </li>
                ))}
              </ul>
            </JoinQuestionLi>
          </Infoul>
        </StyledResponsiveLi>
      </ApplyFormUl>
    </WaypointHeader>
  );
});

BandOpenedPC.displayName = 'BandOpenedPC';
export default loginRequired(BandOpenedPC);
