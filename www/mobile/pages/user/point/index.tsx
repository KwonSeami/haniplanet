import * as React from 'react';
import Link from 'next/link';
import cn from 'classnames';
import styled from 'styled-components';
import findIndex from 'lodash/findIndex';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import OGMetaHead from '../../../components/OGMetaHead';
import Loading from '../../../components/common/Loading';
import Tabs, {useTabs} from '../../../components/UI/tab/Tabs';
import PointHistoryTab from '../../../components/user/point/tabs/PointHistoryTab';
import PointChargeTab from '../../../components/user/point/tabs/PointChargeTab';
import PointRefundTab from '../../../components/user/point/tabs/PointRefundTab';
import loginRequired from '../../../hocs/loginRequired';
import {staticUrl} from '../../../src/constants/env';
import {numberWithCommas} from '../../../src/lib/numbers';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {RootState} from '../../../src/reducers';
import {$POINT_BLUE, $BORDER_COLOR, $FONT_COLOR} from '../../../styles/variables.types';

const PointInfoDiv = styled.div`
  padding: 19px 0 34px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR};

  @media screen and (max-width: 680px) {
    padding: 19px 19px 34px;
  }

  & > div {
    position: relative;
    max-width: 680px;
    margin: auto;

    h2 {
      line-height: 1.2;
      ${fontStyleMixin({
        size: 28,
        weight: '300'
      })}
  
      span {
        padding-right: 4px;
        ${fontStyleMixin({
          size: 33,
          weight: '300',
          color: $POINT_BLUE,
          family: 'Montserrat'
        })}
  
        img {
          width: 25px;
          display: inline-block;
          vertical-align: middle;
          margin: -5px 2px 0 0;
        }
      }
    }
  
    p {
      margin-top: 2px;
      ${fontStyleMixin({
        size: 15,
        weight: '300',
        color: '#999',
      })}
      
      span {
        display: inline-block;
        vertical-align: middle;
        margin-top: -3px;
        padding: 0;
        ${fontStyleMixin({
          size: 18,
          weight: '300',
          color: '#999',
          family: 'Montserrat'
        })}
        
        img {
          width: 15px;
          height: 15px;
          display: inline-block;
          vertical-align: middle;
          margin: -2px 2px 0 4px; 
        }
      }
    }
  
    a {
      position: absolute;
      right: 0;
      bottom: -22px;
      font-size: 12px;
      text-decoration: underline;
  
      @media screen and (max-width: 680px) {
        right: 18px;
      }
  
      img {
        display: inline-block;
        vertical-align: middle;
        margin-top: -3px;
        width: 12px;
      }
    }
  }
`;

const PointListDiv = styled.div`
  margin: auto;
  box-sizing: border-box;

  .profile-tab {
    max-width: 680px;
    margin: auto;
    padding: 10px 0;
    position: relative;

    @media screen and (max-width: 680px) {
      padding: 10px 15px;
    }

    li {
      display: inline-block;
      vertical-align: middle;
      padding-right: 15px;

      a {
        ${fontStyleMixin({
          size: 16,
          weight: '300',
          color: '#999'
        })}
      }

      &.on a {
        text-decoration: underline;
        text-decoration-color: ${$POINT_BLUE};
        ${fontStyleMixin({
          weight: 'bold',
          color: $FONT_COLOR
        })}
      }
    }
  }
`;

const POINT_TAB = [
  {value: 'history', label: '별 내역 보기'},
  {value: 'charge', label: '별 충전하기'},
  {value: 'refund', label: '별 환급하기'},
];

const PointList = React.memo(()=> {
  // State
  const [isLoadChild, setIsLoadChild] = React.useState(false);

  // Redux
  const me = useSelector(
    ({system: {session: {id}}, orm}: RootState) =>
      pickUserSelector(id)(orm) || {} as any
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
    <>
      <OGMetaHead title="나의 별 내역" />
      <PointInfoDiv>
        <div>
          <h2>
            {name}님의 별은<br />
            <span>
              <img
                src={staticUrl("/static/images/icon/icon-point-large.png")}
                alt="나의 포인트"
              />
              {numberWithCommas(point)}
            </span>
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
      </PointInfoDiv>
      {isLoadChild ? (
        <PointListDiv>
          <ul className="profile-tab clearfix">
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
          </ul>
          <Tabs currentTab={currentTab + 1}>
            <PointHistoryTab />
            <PointChargeTab />
            <PointRefundTab point={point} />
          </Tabs>
        </PointListDiv>
      ) : (
        <Loading />
      )}
    </>
  );
});

PointList.displayName = 'PointList';
export default loginRequired(PointList);
