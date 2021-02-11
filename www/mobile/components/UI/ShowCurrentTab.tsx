import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$POINT_BLUE, $TEXT_GRAY, $FONT_COLOR} from '../../styles/variables.types';

const Ul = styled.ul`
  border-left: 1px solid  ${$TEXT_GRAY};
`;

const Li = styled.li<CurrentProps>`
  position: relative;
  padding: 15px 0 0 13px;

  &:first-child {
    padding-top: 0;
    margin-top: 0;
  }

  ${({isCurrent}) => isCurrent && `
    border-left: 1px solid ${$POINT_BLUE};
    margin: 15px 0 0 -1px;
    padding-top: 0;
  `}
`;

const StepText = styled.span`
  display: block;
  letter-spacing: 0.5px;
  padding-bottom: 2px;
  ${fontStyleMixin({
    size: 10,
    weight: 'bold',
    color: $POINT_BLUE
  })};
`;

const TabItemText = styled.p<CurrentProps>`
  ${fontStyleMixin({
    size: 15,
    weight: '300',
    color: $TEXT_GRAY
  })};
  ${({isCurrent}) => isCurrent && `
    ${fontStyleMixin({
      size: 19,
      color: $FONT_COLOR
    })};  
    text-decoration: underline;
  `}
`;

export type TabIndex = string | number;

export interface ITabItem {
  name: string;
  index: TabIndex;
}

interface Props {
  items: ITabItem[];
  currentTab: TabIndex;
  showStep?: boolean;
  className?: string;
}

interface CurrentProps {
  isCurrent?: boolean;
}

//TODO: 혹시 탭 계산이될까요? 마지막 탭에서 위 탭들이 달라져야할거같은데
//스타일로는 할 수 없는거같아요 :) props가 필요할거같은데.. 
// 스탭이3번일때 위에있는 메뉴들 스타일이 수정되어야합니다 ㅎㅎ 
const ShowCurrentTab = React.memo<Props>(
  ({items = [], showStep, currentTab, className}) => (
    <Ul className={className}>
      {items.map(({name, index}) => {
        const isCurrent = currentTab === index;

        return (
          <Li
            className={cn({on: isCurrent})}
            key={name}
            isCurrent={isCurrent}
          >
            {showStep && isCurrent && (
              <StepText>
                STEP.{index}
              </StepText>
            )}
            <TabItemText isCurrent={isCurrent}>
              {name}
            </TabItemText>
          </Li>
        );
      })}
    </Ul>
  )
);

ShowCurrentTab.displayName = 'ShowCurrentTab';
export default ShowCurrentTab;