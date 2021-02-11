import * as React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import {heightMixin, fontStyleMixin} from '../../../../../../styles/mixins.styles';
import {$TEXT_GRAY, $FONT_COLOR} from '../../../../../../styles/variables.types';

const Ul = styled.ul`
  li {
    position: relative;
    float: left;
    text-align: center;
    margin-right: 4px;
    ${heightMixin(33)};
    box-sizing: border-box;
    letter-spacing: -1.3px;
    
    padding: 0 16px;
    border-radius: 20px;
    border: 1px solid ${$TEXT_GRAY};
    ${fontStyleMixin({
      size: 13,
      weight: '600',
      color: $TEXT_GRAY
    })};

    &.on {
      color: ${$FONT_COLOR};
      border-color: ${$FONT_COLOR};
    }
  }
`;

export type TabItem = string;

interface Props {
  currentTab: TabItem;
  categoryList: any[];
  onClick: (categoryId: HashId) => void;
}

const MoaCollectTabMobile = React.memo<Props>(
  ({currentTab, categoryList, onClick}) => {
    const checkCurrentTab = React.useCallback(
      (tab: TabItem) => currentTab === tab,
      [currentTab]
    );

    return (
      <Ul className="clearfix">
        {categoryList.map(({name, id}) => {
          const isCurrentTab = checkCurrentTab(id);

          return (
            <li
              key={name}
              className={classNames({on: isCurrentTab})}
              onClick={() => onClick(id)}
            >
              {name}
            </li>
          );
        })}
      </Ul>
    );
  }
);

export default MoaCollectTabMobile;
