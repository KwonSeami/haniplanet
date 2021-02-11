import React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE} from '../../../../styles/variables.types';
import {staticUrl} from '../../../../src/constants/env';
import {useRouter} from "next/router";
import {ICurrentCompoentProps} from '../../../../pages/signup';
import Button from '../../../inputs/Button';
import cn from 'classnames';

interface Props extends ICurrentCompoentProps {
  className?: string;
}

const Section = styled.section`
  > div {
    position: relative;
    height: 365px;
    padding: 89px 0 0 319px;
    box-sizing: border-box;
    border-top: 1px solid ${$BORDER_COLOR};
    border-bottom: 1px solid ${$BORDER_COLOR};
    
    > img {
      width: 227px;
      position: absolute;
      left: 52px;
      top: 66px;
    }

    h2 {
      ${fontStyleMixin({
        size: 27,
        weight: '300'
      })}
    }

    > p {
      padding-top: 6px;
      ${fontStyleMixin({
        size: 14,
        color: $GRAY
      })}

      span {
        display: block;
      }
    }

    div {
      padding-top: 18px;

      h3 {
        ${fontStyleMixin({
          size: 12,
          weight: '600',
          color: $POINT_BLUE
        })};
      }

      ul {
        line-height: 21px;
        padding-top: 6px;

        li {
          ${fontStyleMixin({
            size: 12,
            color: $GRAY
          })};

          img {
            width: 15px;
            margin-right: 4px;
            vertical-align: middle;
          }
        }
      }
    }
  }
`;

export const CompleteButton = styled(Button)`
  float: right;
  margin-top: 40px;
`;

const CompletePC = React.memo<Props>(({className}) => {
  const router = useRouter();

  return (
    <Section className={cn('clearfix', className)}>
      <div>
        <img 
          src={staticUrl('/static/images/graphic/img-complete.png')}
          alt="가입이 완료 되었습니다"
        />
        <h2>닥톡 가입이 완료 되었습니다.</h2>
        <p>
          가입 기준 일로부터 영업일 최대 2일 이내로<br/>
          개인 CMS 안내가 진행됩니다. 조금만 기다려주세요!
        </p>
        <div>
          <h3>닥톡-NAVER 지식iN 서비스 안내</h3>
          <ul>
            <li>
              <img
                src={staticUrl('/static/images/icon/icon-kakaotalk.png')}
                alt="카카오톡"
              />
              '닥톡한의사' 검색 후 채팅
            </li>
            <li>
              <img
                src={staticUrl('/static/images/icon/icon-phone-blue.png')}
                alt="전화번호"
              />
              010-5620-6987 장명빈 팀장
            </li>
            <li>
              <img
                src={staticUrl('/static/images/icon/icon-message-blue.png')}
                alt="이메일"
              />
              myongbin@docfriends.com
            </li>
          </ul>
        </div>
      </div>
      <CompleteButton
        size={{
          width: '154px',
          height: '40px'
        }}
        border={{
          width: '1px',
          radius: '20px',
          color: $POINT_BLUE
        }}
        font={{
          size: '15px',
          color: $POINT_BLUE
        }}
        onClick={() => router.replace('/')}
      >
        메인으로 이동
      </CompleteButton>
    </Section>
  )
});

export default CompletePC;
