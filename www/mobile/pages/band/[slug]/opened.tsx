import * as React from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';
import useBandOpened from '../../../src/hooks/band/useBandOpened';
import ResponsiveLi, {Div, H3} from '../../../components/UI/ResponsiveLi/ResponsiveLi';
import {USER_EXPOSE_TYPE_TO_KOR, USER_TYPE_TO_KOR} from '../../../src/constants/users';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {toDateFormat} from '../../../src/lib/date';
import {useRouter} from 'next/router';
import loginRequired from '../../../hocs/loginRequired';

const Section = styled.section`
  background-color: #f6f7f9;
  padding: 50px 0 100px;

  @media screen and (max-width: 680px) {
    padding: 0;
  }
`;

const ApplyFormUl = styled.ul`
  max-width: 580px;
  margin: auto;
  background-color: ${$WHITE};
  padding-top: 6px;
`;

const StyledResponsiveLi = styled(ResponsiveLi)`
  border-bottom: 1px solid ${$BORDER_COLOR};
  padding: 15px 15px 11px;

  ${H3} {
    position: static;
    letter-spacing: -2px;
    padding-bottom: 18px;
    ${fontStyleMixin({
  size: 18,
  weight: '300'
})}
  }

  ${Div} {
    padding: 1px 0 0;
  }

  @media screen and (max-width: 680px) {
    &:last-child {
      border: 0;
    }
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
  padding: 0 33px 19px 0;
  font-size: 16px;
  color: ${$TEXT_GRAY};

  ${TitleSpan} {
    color: ${$FONT_COLOR};
  }
`;

const SettingP = styled.p`
  font-size: 16px;
  padding-bottom: 19px;

  span {
    padding-left: 7px;
    ${fontStyleMixin({
  size: 11,
  weight: '600',
  color: $TEXT_GRAY
})}
  }
`;

const InfoLi = styled.li`
  position: relative;
  padding-bottom: 24px;

  ${TitleSpan} {
    display: block;
    padding-bottom: 7px;
  }

  p {
    font-size: 15px;
    padding: 5px 0 12px;
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

  ${TitleSpan} {
    padding-bottom: 6px;
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
  }
  
  &.large {
    padding-top: 24px;

    p {
      min-height: 180px;
    }
  }
`;

const JoinQuestionLi = styled.li`
  padding: 25px 0 30px; 

  ${TitleSpan} {
    display: block;
    padding-bottom: 5px;
  }

  li {
    font-size: 14px;
    ${heightMixin(44)};
    box-sizing: border-box;
    border-bottom: 1px solid ${$BORDER_COLOR};
  }
`;


const BandOpenedMobile: React.FC = React.memo(() => {
  const {query: {slug}} = useRouter();
  const {
    band,
    openedInfo,
    question
  } = useBandOpened(slug);

  if (band === undefined || isEmpty(openedInfo) || isEmpty(question)) {
    return null;
  }

  const {
    name,
    purpose,
    body,
    category,
    user_expose_type
  } = band;
  const {
    user,
    created_at
  } = openedInfo;

  const nameByExposeType = USER_EXPOSE_TYPE_TO_KOR[user_expose_type];

  return (
    <Section>
      <ApplyFormUl>
        <StyledResponsiveLi
          title="공개 설정"
        >
          <SettingP>
            {nameByExposeType} MOA
            <span>{nameByExposeType}으로만 활동 하는 커뮤니티입니다.</span>
          </SettingP>
        </StyledResponsiveLi>
        <StyledResponsiveLi
          title="신청자 정보"
        >
          <ul>
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
          </ul>
        </StyledResponsiveLi>
        <StyledResponsiveLi
          title="기본 정보"
        >
          <ul>
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
            <TextareaLi className="large">
              <TitleSpan>소개글</TitleSpan>
              <p>
                {body}
              </p>
            </TextareaLi>
            <JoinQuestionLi>
              <TitleSpan>가입 질문</TitleSpan>
              <ul>
                {Object.values(question[slug]).map(({id, question}, index) => (
                  <li key={id}>
                    {index + 1}. {question}
                  </li>
                ))}
              </ul>
            </JoinQuestionLi>
          </ul>
        </StyledResponsiveLi>
      </ApplyFormUl>
    </Section>
  );
});

BandOpenedMobile.displayName = 'BandOpenedMobile';
export default loginRequired(BandOpenedMobile);
