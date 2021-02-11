import * as React from 'react';
import useLocation from '../../../src/hooks/router/useLocation';
import queryString from 'query-string';

// `useTabs`를 만들어서 `currentTab`을 관리하고, Tabs 컴포넌트에 `props`를 주는 방식으로 `renderProps`를 대체
export const useTabs = (defaultTab = 1) => {
  const [currentTab, setCurrentTab] = React.useState<string | number>(defaultTab);

  // `string`인 경우, 이전 탭을 유추할 수 없어서 `move`로 관리하도록 합니다.
  const prev = React.useCallback(() => {
    setCurrentTab(curr => (
      typeof curr === 'number'
        ? curr > 0 ? curr - 1 : curr
        : curr
    ));
  }, []);

  // `string`인 경우, 다음 탭을 유추할 수 없어서 `move`로 관리하도록 합니다.
  const next = React.useCallback(() => {
    setCurrentTab(curr => (
      typeof curr === 'number'
        ? curr + 1
        : curr
    ));
  }, []);

  const move = React.useCallback((moveTabId) => {
    setCurrentTab(moveTabId);
  }, []);

  return {prev, next, move, currentTab};
};

interface Props {
  children: React.ReactElement[] | React.ReactElement;
  currentTab: number | string;
  propsKey?: string;
}

// `tab`을 `params`에 저장해야 할 때 사용합니다.
export const useTabParams = (paramsKey: string, tabList: string[]) => {
  const {history, location: {search, pathname}} = useLocation();
  const {currentTab, move} = useTabs();
  const parseSearch = queryString.parse(search);
  const tabPrams = parseSearch[paramsKey];

  const isValidTabParams = React.useCallback((tab) => (
    tabList.includes(tab)
  ), [tabList]);

  const replaceTab = React.useCallback((tabValue) => {
    if (isValidTabParams(tabValue)) {
      history.replace(`${pathname}?${paramsKey}=${tabValue}`);
    }
  }, [pathname, paramsKey]);

  // 전달받은 `tabList`와 일치하지 않은 `params`를 갖고 있다면, `replace`시킵니다.
  React.useEffect(() => {
    if (!isValidTabParams(tabPrams)) {
      history.replace(`${pathname}?${paramsKey}=${tabList[0]}`);
    }
  }, [isValidTabParams, tabPrams, pathname]);

  React.useEffect(() => {
    if (isValidTabParams(tabPrams)) {
      move(tabPrams);
    }
  }, [isValidTabParams, tabPrams]);

  return {currentTab, replaceTab};
};

const Tabs = React.memo<Props>((props) => {
  const {children, currentTab, propsKey} = props;

  return (
    <div className="tabs">
      {React.Children
        .toArray(children)
        .filter((item, idx) => {
          if (!!propsKey) {
            const currentTabProps = (item as React.ReactElement).props;
            if (!currentTabProps || !currentTabProps[propsKey]) {
              console.error('`Component`에 `props`가 없거나, `propsKey`가 없습니다.');
              return null;
            }

            return currentTabProps[propsKey] === currentTab;
          }

          return (idx + 1) === currentTab;
        })}
    </div>
  );
});

export default Tabs;
