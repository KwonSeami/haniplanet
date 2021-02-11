import * as React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $WHITE} from '../../../../styles/variables.types';
import {staticUrl} from '../../../../src/constants/env';
import ButtonGroup from '../../../../components/inputs/ButtonGroup';
import {useRouter} from "next/router";
import {ICurrentCompoentProps} from "../../../../pages/signup";

interface Props extends ICurrentCompoentProps {
  className?: string;
}

const Section = styled.section`
  div {
    position: relative;
    height: 365px;
    padding: 143px 0 0 325px;
    box-sizing: border-box;
    border-top: 1px solid ${$BORDER_COLOR};
    border-bottom: 1px solid ${$BORDER_COLOR};
    
    img {
      width: 227px;
      position: absolute;
      left: 57px;
      top: 60px;
    }

    h2 {
      ${fontStyleMixin({
        size: 27,
        weight: '300'
      })}
    }

    p {
      padding: 6px 0 0 2px;
      ${fontStyleMixin({
        size: 14,
        color: $GRAY
      })}

      span {
        display: block;
      }
    }
  }
`;

export const CompleteButtonGroup = styled(ButtonGroup)`
  text-align: right;
  padding-top: 40px;

  li {
    padding-left: 15px;
  }

  button {
    width: 154px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid ${$POINT_BLUE};
    color: ${$POINT_BLUE};
  }

  .left-button {
    background-color: ${$POINT_BLUE};
    color: ${$WHITE};
  }
`;

const CompletePC: React.FC<Props> = React.memo(({className}) => {
  const router=useRouter();
  return (
    <Section className={className}>
      <div>
        <img 
          src={staticUrl('/static/images/banner/img-complete.png')}
          alt="가입이 완료 되었습니다"
        />
        <h2>가입이 완료 되었습니다.</h2>
        <p>한의플래닛에 가입해주셔서<span>감사합니다.</span></p>
      </div>
      <CompleteButtonGroup
        leftButton={{
          children: '로그인하기',
          onClick: () => router.replace('/login')
        }}
        rightButton={{
          children: '메인으로 이동',
          onClick: () => router.replace('/')
        }}
      />
    </Section>
  )
});

export default CompletePC;
