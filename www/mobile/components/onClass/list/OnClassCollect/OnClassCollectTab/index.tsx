import * as React from 'react';
import cn from 'classnames';
import {Ul} from './style';

export type TabItem = string;

interface Props {
  currentTab: TabItem;
  categoryList: any[];
  onClick: (categoryId: HashId) => void;
}

const OnClassCollectTab = React.memo<Props>(
  ({currentTab, categoryList, onClick}) => {
    const checkCurrentTab = React.useCallback(
      (tab: TabItem) => currentTab === tab,
      [currentTab]
    );

    return (
      <Ul className="clearfix">
        {categoryList.map(({id, name, avatar_on, avatar_off}) => {
          const isCurrentTab = checkCurrentTab(id);

          return (
            <li
              key={name}
              className={cn({on: isCurrentTab})}
              onClick={() => onClick(id)}
            >
              <img
                className={cn({on: isCurrentTab})}
                src={isCurrentTab ? avatar_on : avatar_off}
                alt={name}
              />
              {name}
            </li>
          );
        })}
      </Ul>
    );
  }
);

export default OnClassCollectTab;
