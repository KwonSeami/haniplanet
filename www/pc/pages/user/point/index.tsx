import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import findIndex from 'lodash/findIndex';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import Tabs, {useTabs} from '../../../components/UI/tab/Tabs';
import TabUl from '../../../components/user/TabUl';
import OGMetaHead from '../../../components/OGMetaHead';
import Loading from '../../../components/common/Loading';
import WaypointHeader from '../../../components/layout/header/WaypointHeader';
import PointRefundTab from '../../../components/user/point/tabs/PointRefundTab';
import PointHistoryTab from '../../../components/user/point/tabs/PointHistoryTab';
import PointChargeTab from '../../../components/user/point/tabs/PointChargeTab';
import UserPointListArea from '../../../components/user/point/style/UserPointListArea';
import UserPointBannerArea from '../../../components/user/point/style/UserPointBannerArea';
import loginRequired from '../../../hocs/loginRequired';
import {RootState} from '../../../src/reducers';
import {staticUrl} from '../../../src/constants/env';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {numberWithCommas} from '../../../src/lib/numbers';

const POINT_TAB = [
  {value: 'history', label: '별 내역 보기'},
  {value: 'charge', label: '별 충전하기'},
  {value: 'refund', label: '별 환급하기'},
];

const PointList = React.memo(()=> {
  // State
  const [isLoadChild, setIsLoadChild] = React.useState(false);

  // Redux
  const {id, me} = useSelector(
    ({system: {session: {id}}, orm}: RootState) => ({
      id,
      me: pickUserSelector(id)(orm) || {} as any,
    })
  );
  const {name, point, withdrawal_ongoing_points} = me || {} as any;

  // Hooks
  const {currentTab, move} = useTabs();
  const {query: {tab}} = useRouter();

  React.useEffect(() => {
    setIsLoadChild(false);
    move(findIndex(POINT_TAB, {value: tab as string}));
    setIsLoadChild(true);
  }, [tab]);

  return (
    <WaypointHeader
      headerComp={
        <UserPointBannerArea>
          <OGMetaHead title="나의 별 내역" />
          {id && (
            <Link
              href="/user/[id]"
              as={`/user/${id}`}
            >
              <a>
                <img
                  src={staticUrl('/static/images/icon/arrow/icon-big-shortcuts.png')}
                  alt="MY PAGE"
                />
                MY PAGE
              </a>
            </Link>
          )}
          <div>
            <h2>
              {name}님의 별은
              <strong>
                <img
                  src={staticUrl("/static/images/icon/icon-point-large.png")}
                  alt="나의 포인트"
                />
                {numberWithCommas(point)}
              </strong>
              입니다.
            </h2>
            <p>
              환급 예정 별
              <span>
                <img
                  src={staticUrl("/static/images/icon/icon-point-star.png")}
                  alt="환급 예정 별"
                />
                {numberWithCommas(withdrawal_ongoing_points)}
              </span>
            </p>
            <Link
              href={{
                pathname: '/terms',
                query: {tab: 'paidPayment'},
              }}
            >
              <a>
                별 이용 정책
                <img
                  src={staticUrl("/static/images/icon/arrow/icon-mini-shortcuts2.png")}
                  alt="별 이용 정책"
                />
              </a>
            </Link>
          </div>
        </UserPointBannerArea>
      }
    >
      {isLoadChild ? (
        <UserPointListArea>
          <div>
            <TabUl>
              {POINT_TAB.map(({value, label}, idx) => (
                <li
                  key={`point-list-${value}`}
                  className={cn({on: currentTab === idx})}
                >
                  <Link
                    href={{
                      pathname: '/user/point',
                      query: {tab: value},
                    }}
                    replace
                    shallow
                  >
                    <a>{label}</a>
                  </Link>
                </li>
              ))}
            </TabUl>
            <Tabs currentTab={currentTab + 1}>
              <PointHistoryTab />
              <PointChargeTab />
              <PointRefundTab point={point} />
            </Tabs>
          </div>
        </UserPointListArea>
      ) : (
        <Loading />
      )}
    </WaypointHeader>
  );
});

PointList.displayName = 'PointList';
export default loginRequired(PointList);
