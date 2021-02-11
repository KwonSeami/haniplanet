import * as React from 'react';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import Link from 'next/link';
import {useSelector, shallowEqual} from 'react-redux';
import OnClassList, {TCurrentTab} from '../OnClassList';
import BandApi from "../../../../src/apis/BandApi";
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import {staticUrl} from '../../../../src/constants/env';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import {RootState} from '../../../../src/reducers';
import {$FONT_COLOR} from '../../../../styles/variables.types';
import Loading from '../../../common/Loading';

const Section = styled.section`
  width: 100%;
  background-color: #f0f2f8;

  .onclass-top-box {
    position: relative;
    z-index: 1;
    max-width: 680px;
    min-height: 330px;
    margin: 0 auto -21px;
    padding-top: 15px;
    box-sizing: border-box;

    &.list-on {
      margin-bottom: 90px;
    }

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      top: 60px;
      left: 0;
      background-color: ${$FONT_COLOR};
    }

    .onclass-guide {
      text-align: right;
      padding-bottom: 14px;
  
      a {
        ${fontStyleMixin({
          size: 12,
          weight: '600'
        })}
      }
  
      img {
        width: 18px;
        display: inline-block;
        vertical-align: middle;
        margin-top: -5px;
        padding-left: 1px;
      }
    }

    > h2 {
      position: relative;
      z-index: 1;
      display: inline-block;
      background-color:  #f0f2f8;
      font-size: 13px;
      padding-right: 6px;

      span {
        padding-right: 5px;
        ${fontStyleMixin({
          size: 30,
          weight: '300'
        })};
        letter-spacing: -2px;
        vertical-align: middle;
        display: inline-block;
        margin-top: -6px;
      }
    }
  }

  @media screen and (max-width: 680px) {
    .onclass-top-box {
      min-height: 313px;

      &.list-on {
        margin-bottom: 120px;
      }

      &::after {
        top: 63px;
        left: auto;
        right: 20px;
        width: 80%;
      }

      .onclass-guide {
        padding: 0 20px 15px;
        margin-right: 2px;
      }

      > h2 {
        padding-left: 20px;
      }

      .button-group {
        padding-left: 20px;
      }
    }
  }
`;

const OnClassTopDiv = () => {
  // State
  const [pending, setPending] = React.useState(true);
  const [currentTab, setCurrentTab] = React.useState<TCurrentTab>('member_status');
  const [myOnClassList, setMyOnClassList] = React.useState({
    status: {fetchTime: null, list: []},
    member_status: {fetchTime: null, list: []},
  });

  // Redux
  const {name, signed_onclass_count, managing_onclass_count} = useSelector(
    ({orm, system: {session: {id}}}: RootState) => pickUserSelector(id)(orm) || {},
    shallowEqual,
  );

  const changeCurrentTabStatus = React.useCallback(() => setCurrentTab('status'), []);
  const changeCurrentTabMemberStatus = React.useCallback(() => setCurrentTab('member_status'), []);

  // API
  const myBandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  React.useEffect(() => {
    const offset = currentTab === 'member_status' ? signed_onclass_count : managing_onclass_count;

    if (!myOnClassList[currentTab].fetchTime) {
      setPending(true);
      myBandApi.myBand({
        [currentTab]: 'active',
        band_type: '["onclass"]',
        grade: currentTab === 'member_status' ? 'normal' : 'manager',
        limit: 0,
        offset
      }).then(({data: {results: list}}) => {
        setPending(false);
        !!list && setMyOnClassList(curr => ({
          ...curr,
          [currentTab]: {
            list,
            fetchTime: new Date().getTime(),
          }
        }));
      });
    }
  }, [currentTab, signed_onclass_count, managing_onclass_count, myOnClassList]);

  return (
    <Section>
      <div
        className={cn(
          'onclass-top-box',
          {'list-on': !isEmpty(myOnClassList[currentTab].list)},
        )}
      >
        <p className="onclass-guide">
          <Link href="/guide">
            <a>
              온라인 강의 이용가이드
              <img
                src={staticUrl('/static/images/icon/icon-help-btn.png')}
                alt="온라인 강의 이용가이드"
              />
            </a>
          </Link>
        </p>
        <h2>
          <span>{name}</span>님의 온라인 강의
        </h2>
        {!pending
          ? (
            <OnClassList
              currentTab={currentTab}
              myOnClassList={myOnClassList}
              changeCurrentTabStatus={changeCurrentTabStatus}
              changeCurrentTabMemberStatus={changeCurrentTabMemberStatus}
            />
          ) : <Loading/>
        }

      </div>
    </Section>
  );
};

export default OnClassTopDiv;
