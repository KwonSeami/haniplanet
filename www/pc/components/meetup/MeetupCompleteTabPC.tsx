import * as React from 'react';
import styled from 'styled-components';
import {useRouter} from 'next/router';
import {shallowEqual, useSelector} from 'react-redux';
import BasicButtonGroup from '../inputs/ButtonGroup/BasicButtonGroup';
import {staticUrl} from '../../src/constants/env';
import {Div, SeminarBanner} from './pcStyledComp';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {pickUserSelector} from "../../src/reducers/orm/user/selector";
import {$POINT_BLUE, $FONT_COLOR, $GRAY, $WHITE} from '../../styles/variables.types';

const CompleteTopDiv = styled.div`
  position: relative;
  padding-top: 12px;
  text-align: center;

  img {
    width: 70px;
    height: 70px;
  }

  h3 {
    padding: 8px 0 3px;
    ${fontStyleMixin({
      size: 22,
      weight: '300',
      color: $FONT_COLOR,
    })};
  }

  p {
    font-size: 15px;
    line-height: 1.6;
    ${fontStyleMixin({
      size: 14,
      color: $GRAY,
    })};
  }
`;

const CompleteTextDiv = styled.div`
  width: 591px;
  margin: 37px auto 50px;
  border-left: 4px solid #ecedef;
  padding-left: 10px;
  box-sizing: border-box;

  p {
    position: relative;
    margin-left: 15px;
    line-height: 21px;
    ${fontStyleMixin({
      size: 12,
      color: '#999',
    })};

    &::before {
      content: '※';
      display: block;
      position: absolute;
      left: -15px;
    }

    em {
      font-style: normal;
      color: ${$POINT_BLUE};
    }
  }
`;

const StyledBasicButtonGroup = styled(BasicButtonGroup)`
  padding-top: 0;
  
  button {
    width: 160px;
    
    &.left-button {
      color: ${$WHITE};
      background-color: ${$POINT_BLUE};
      border-color: ${$POINT_BLUE};
    }
    
    &.right-button {
      color: ${$POINT_BLUE};
      background-color: ${$WHITE};
    }
  }
`;

interface Props {
  className?: string;
}

const MeetupCompleteTabPC = React.memo<Props>(({className}) => {
  const router = useRouter();
  const {id} = useSelector(
    ({orm, system: {session: {id}}}) => pickUserSelector(id)(orm) || {} as any,
    shallowEqual,
  );

  return (
    <>
      <SeminarBanner>
        <h2>세미나/모임모집 개설완료</h2>
      </SeminarBanner>
      <Div className={className}>
        <CompleteTopDiv>
          <img
            src={staticUrl('/static/images/icon/icon-seminar-complete.png')}
            alt="세미나 개설이 완료되었습니다"
          />
          <h3><span>세미나 개설이 완료</span>되었습니다!</h3>
          <p>세미나 개설이 정상적으로 완료 되었습니다.</p>
        </CompleteTopDiv>
        <CompleteTextDiv>
          <p>세미나 수정 및 삭제는 해당 세미나 상세페이지에서 가능합니다.</p>
          <p>
            세미나에 대한 참여자 내역은 "세미나 - 나의 세미나/모임 - 세미나/모임 개설내역" 목록에서
            <br/>
            해당 세미나를 클릭하시면 참여자 목록을 확인하실 수 있습니다.
          </p>
          <p>
            세미나 개설 관련 문의는
            <em> 한의플래닛 고객센터 : customer@balky.kr 및 02-6941-4860</em>
            으로 문의주시기 바랍니다.
          </p>
        </CompleteTextDiv>
        <StyledBasicButtonGroup
          leftButton={{
            children: '세미나 메인으로',
            type: 'button',
            onClick: () => router.replace('/meetup'),
          }}
          rightButton={{
            children: '나의 개설내역으로',
            type: 'button',
            onClick: () => router.replace('/user/[id]/meetup?page_type=created', `/user/${id}/meetup?page_type=created`),
          }}
        />
      </Div>
    </>
  );
});

MeetupCompleteTabPC.displayName = 'MeetupCompleteTabPC';
export default MeetupCompleteTabPC;
