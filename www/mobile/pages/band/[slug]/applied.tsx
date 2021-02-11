import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import {$BORDER_COLOR, $GRAY, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import useBandApplied from '../../../src/hooks/band/useBandApplied';
import {staticUrl} from '../../../src/constants/env';
import {toDateFormat} from '../../../src/lib/date';
import loginRequired from '../../../hocs/loginRequired';
import {useRouter} from 'next/router';

const Section = styled.section`
  width: 100%;
  height: 100%;
  background-color: #f6f7f9;
  padding: 105px 0 100px;

  & > div {
    max-width: 680px;
    margin: auto;
    background-color: ${$WHITE};
  }

  @media screen and (max-width: 680px) {
    padding: 0;
    height: auto;

    & > div {
      padding-bottom: 86px;
    }
  }
`;

const ApplicationTopDiv = styled.div`
  position: relative;
  padding: 40px 20px 17px;
  border-bottom: 1px solid ${$BORDER_COLOR};

  h2 {
    ${fontStyleMixin({
  size: 24,
  weight: '300'
})}

    span {
      padding-bottom: 3px;
      display: block;
      ${fontStyleMixin({
  size: 11,
  weight: 'bold'
})}
    }
  }

  @media screen and (max-width: 680px) {
    padding: 19px 95px 28px 18px;
  }
`;

const ApplicationImg = styled.div<{avatar: string;}>`
  position: absolute;
  right: 50px;
  bottom: 14px;
  ${({avatar}) => backgroundImgMixin({
  img: avatar || staticUrl('/static/images/icon/icon-default-moa-img.png')
})}
  width: 40px;
  height: 40px;
  border-radius: 50%;

  img {
    position: absolute;
    right: -30px;
    bottom: 0px;
    width: 40px;
  }

  @media screen and (max-width: 680px) {
    bottom: auto;
    top: 18px;
    right: 46px;

    img {
      right: -32px;
    }
  }
`;

const ApplicationUl = styled.ul`
  box-sizing: border-box;
  margin: auto;
  padding: 20px 74px 20px 76px;

  @media screen and (max-width: 680px) {
    padding: 20px 15px;
  }
`;


const TitleSpan = styled.span`
  ${fontStyleMixin({
  size: 11,
  color: $TEXT_GRAY,
  weight: 'bold'
})}
  padding-bottom: 11px;
  display: block;
`;

const ApplicationP = styled.p`
  ${fontStyleMixin({
  size: 14,
  color: $GRAY
})}
  min-height: 180px;
  box-sizing: border-box;
  padding: 10px 12px;
  background-color: #f6f7f9;
  word-wrap: break-word;
`;

const ApplicationLi = styled.li<{isApplicationDate?: boolean;}>`
  padding-bottom: 15px;
  position: relative;

  ${({isApplicationDate}) => isApplicationDate && `
    p {
      border-bottom: 1px solid ${$BORDER_COLOR};
      font-size: 16px;
      padding-bottom: 12px;

      span {
        width: 1px;
        height: 10px;
        margin: 0 5px;
        display: inline-block;
        vertical-align: middle;
        background-color: ${$BORDER_COLOR};
      }
    }
  `}

  @media screen and (max-width: 680px) {
    padding-bottom: 20px;
  }
`;

const JoinQuestionLi = styled.li`
  padding-bottom: 15px;

  h3 {
    font-size: 14px;
    padding-bottom: 13px;
  }

  p {
    background-color: #f6f7f9;
    padding: 8px 12px;
    min-height: 80px;
    box-sizing: border-box;
    word-wrap: break-word;
    ${fontStyleMixin({
  size: 14,
  color: $GRAY
})}
  }

  @media screen and (max-width: 680px) {
    h3 {
      font-size: 15px;
    }
    
    p {
      min-height: 64px;
      padding: 8px 10px;
    }
  }
`;

interface Props extends RouteComponentProps {
}

const BandAppliedMobile: React.FC<Props> = React.memo(() => {
  const router = useRouter();
  const {query: {slug}} = router;
  const {
    band,
    appliedInfo
  } = useBandApplied(slug);

  if (band === undefined || isEmpty(appliedInfo)) {
    return null;
  }

  const {
    name,
    avatar
  } = band;
  const {
    created_at,
    self_introduce,
    answer: {
      answers,
      questions
    }
  } = appliedInfo;

  return (
    <Section>
      <div>
        <ApplicationTopDiv>
          <h2>
            <span>MOA명</span>
            {name}
          </h2>
          <ApplicationImg avatar={avatar}>
            <img
              src={staticUrl('/static/images/icon/icon-expert.png')}
              alt="모아 대표 이미지"
            />
          </ApplicationImg>
        </ApplicationTopDiv>
        <ApplicationUl>
          <ApplicationLi isApplicationDate>
            <TitleSpan>가입신청일</TitleSpan>
            <p>
              {toDateFormat(created_at, 'YYYY.MM.DD')} <span />&nbsp;
              {toDateFormat(created_at, 'HH:MM')}
            </p>
          </ApplicationLi>
          <ApplicationLi>
            <TitleSpan>자기소개</TitleSpan>
            <ApplicationP>
              {self_introduce}
            </ApplicationP>
          </ApplicationLi>
          <ApplicationLi>
            <TitleSpan>가입 질문</TitleSpan>
            <ul>
              {Object.keys(questions).map((key, index) => (
                <JoinQuestionLi key={key}>
                  <h3>{index + 1}. {questions[key]}</h3>
                  <p>{answers[key]}</p>
                </JoinQuestionLi>
              ))}
            </ul>
          </ApplicationLi>
        </ApplicationUl>
      </div>
    </Section>
  );
});

BandAppliedMobile.displayName = 'BandAppliedMobile';
export default loginRequired(BandAppliedMobile);
