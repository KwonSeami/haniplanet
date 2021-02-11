import * as React from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import {$BORDER_COLOR, $GRAY, $TEXT_GRAY} from '../../../styles/variables.types';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import useBandApplied from '../../../src/hooks/band/useBandApplied';
import {staticUrl} from '../../../src/constants/env';
import {toDateFormat} from '../../../src/lib/date';
import {useRouter} from 'next/router';
import Link from 'next/link';
import loginRequired from '../../../hocs/loginRequired';
import WaypointHeader from '../../../components/layout/header/WaypointHeader';
import MoaHeader from '../../../components/band/MoaHeader';

const Section = styled.section`
  padding-bottom: 130px;
`;

const ApplicationBanner = styled.div`
  height: 280px;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  ${backgroundImgMixin({
    img: staticUrl('/static/images/banner/img-signup.png')
  })}

  h2 {
    padding-top: 150px;
    ${fontStyleMixin({
      size: 28,
      weight: '300'
    })}
  }

  a {
    display: block;
    position: absolute;
    left: 40px;
    top: 125px;
    ${fontStyleMixin({
      size: 15,
      color: $GRAY
    })}
    
    img {
      width: 30px;
      display: inline-block;
      vertical-align: middle;
      margin: -5px 11px 0 0;
    }
  }
`;

const ApplicationTopDiv = styled.div`
  width: 680px;
  margin: auto;
  position: relative;
  padding: 40px 0 17px;
  border-bottom: 1px solid ${$BORDER_COLOR};
`;

const ApplicationH2 = styled.h2`
  ${fontStyleMixin({
    size: 23,
    weight: '300'
  })}
  span {
    display: block;
    ${fontStyleMixin({
      size: 11,
      weight: 'bold'
    })}
  }
`;

const ApplicationImg = styled.div<{avatar: string;}>`
  position: absolute;
  right: 30px;
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
`;

const ApplicationUl = styled.ul`
  width: 680px;
  box-sizing: border-box;
  margin: auto;
  padding: 20px 74px 20px 76px;
  border-bottom: 1px solid ${$BORDER_COLOR};
`;


const TitleSpan = styled.span`
  ${fontStyleMixin({
    size: 11,
    color: $TEXT_GRAY,
    weight: 'bold'
  })}
  padding-bottom: 8px;
  display: block;
`;

const ApplicationP = styled.p`
  ${fontStyleMixin({
    size: 14,
    color: $GRAY
  })}
  min-height: 180px;
  padding: 10px 12px;
  background-color: #f6f7f9;
  box-sizing: border-box;
  border-bottom: 0;
  width: 100%;
`;

const ApplicationLi = styled.li<{isApplicationDate?: boolean;}>`
  padding-bottom: 15px;
  position: relative;

  ${({isApplicationDate}) => isApplicationDate && `
    ${TitleSpan} {
      width: 100px;
      display: inline-block;
      vertical-align: middle;
    }

    .application-date {
      width: calc(100% - 100px);
      border-bottom: 1px solid ${$BORDER_COLOR};
      font-size: 15px;
      display: inline-block;
      vertical-align: middle;
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
    min-height: 56px;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 14,
      color: $GRAY
    })}
  }
`;

const BandAppliedPC = React.memo(() => {
  const router = useRouter();
  const {query: {slug}} = router;

  const {band, appliedInfo} = useBandApplied(slug);

  if (band === undefined || isEmpty(appliedInfo)) {
    return null;
  }

  const {name, avatar} = band;
  const {
    created_at,
    self_introduce,
    answer: {
      answers,
      questions
    }
  } = appliedInfo;

  return (
    <WaypointHeader
      headerComp={
        <MoaHeader
          title="가입 신청 내역"
          linkProps={{href: '/band/', as: `/band/`}}
        >
          {name} 커뮤니티
        </MoaHeader>
      }
    >
      <Section>
        <ApplicationTopDiv>
          <ApplicationH2>
            <span>MOA명</span>
            {name}
          </ApplicationH2>
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
            <p className="application-date">
              {toDateFormat(created_at, 'YYYY.MM.DD')} <span/>&nbsp;
              {toDateFormat(created_at, 'HH:MM')}
            </p>
          </ApplicationLi>
          <ApplicationLi isApplicationDate>
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
      </Section>
    </WaypointHeader>
  );
});

BandAppliedPC.displayName = 'BandAppliedPC';
export default loginRequired(BandAppliedPC);
