import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$POINT_BLUE, $TEXT_GRAY, $FONT_COLOR} from '../../styles/variables.types';
import {useRouter} from 'next/router';

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
  link?: {href: string, as?: string};
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

const ShowCurrentTab = React.memo<Props>(
  ({items = [], showStep, currentTab, className}) => {
    const router = useRouter();

    return (
      <Ul className={className}>
        {items.map(({name, index, link}) => {
          const isCurrent = currentTab === index;

          return (
            <Li
              className={cn({
                on: isCurrent,
                pointer: !!link
              })}
              key={name}
              isCurrent={isCurrent}
              onClick={() => {
                const {href = '', as = undefined} = link || {};

                if (!!href) {
                  return router.replace(href, !!as ? as : undefined);
                }
              }}
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
    );
  }
);

ShowCurrentTab.displayName = 'ShowCurrentTab';
export default ShowCurrentTab;
