import * as React from 'react';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import {useSelector} from 'react-redux';
import MyMoaSlider from './MyMoaSlider/MyMoaSlider';
import BandApi from '../../../../../src/apis/BandApi';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import {staticUrl} from '../../../../../src/constants/env';
import {pickUserSelector} from '../../../../../src/reducers/orm/user/selector';
import {StyledButtonGroup, NoContent} from './styleCompPC';

type TabType = 'status' | 'member_status';

const MyMoaListPC = React.memo(
  () => {
    // Redux
    const {signed_moa_count, managing_moa_count} = useSelector(
      ({orm, system: {session: {id}}}) => (pickUserSelector(id)(orm) || {}),
      (prev, curr) => isEqual(prev, curr)
    );

    const myBandApi: BandApi = useCallAccessFunc(access => new BandApi(access));
  
    const [myMoaList, save] = React.useState({
      member_status: {
        fetchTime: null,
        list: []
      },
      status: {
        fetchTime: null,
        list: []
      }
    });
    const [currentTab, setCurrentTab] = React.useState<TabType>('member_status');

    const getMyMoaList = React.useCallback((key: TabType) => {
      myBandApi
        .myBand({
          band_type: '["moa"]',
          grade: currentTab === 'member_status'
            ? 'normal'
            : 'manager',
          [key]: 'active'
        })
        .then(({data: {results}}) => {
          !!results && save(curr => ({
            ...curr,
            [key]: {
              fetchTime: new Date().getTime(),
              list: results
            }
          }));
        });
    }, [currentTab]);
  
    React.useEffect(() => {
      if (!myMoaList[currentTab].fetchTime) {
        getMyMoaList(currentTab);
      }
    }, [myMoaList, currentTab, getMyMoaList]);

    return (
      <div>
        <StyledButtonGroup
          on={currentTab}
          leftButton={{
            children:
              <>
                가입 <strong>MOA</strong>
                <span>{signed_moa_count}</span>
              </>,
            onClick: () => setCurrentTab('member_status')
          }}
          rightButton={{
            children:
              <>
                관리 <strong>MOA</strong>
                <span>{managing_moa_count}</span>
              </>,
            onClick: () => setCurrentTab('status')
          }}
        />
        {!isEmpty(myMoaList[currentTab].list) ? (
          <MyMoaSlider myMoaList={myMoaList[currentTab].list} />
        ) : (
          <NoContent>
            <img
              className="no-content-img"
              src={staticUrl('/static/images/icon/icon-join-null.png')}
              alt="MOA가 없네요"
            />
            <h2>
              {currentTab === 'member_status'
                ? '아직 가입한 MOA가 없네요'
                : '관리중인 MOA가 없네요'}
            </h2>
            <p>
              {currentTab === 'member_status'
                ? '아래의 추천 MOA로 가입해보세요!!'
                : 'MOA를 만들어보세요!'}
              <img
                src={staticUrl('/static/images/icon/arrow/icon-down-more.png')}
                alt="Moa 소개 화살표"
              />
            </p>
          </NoContent>
        )}
      </div>
    );
  }
);

MyMoaListPC.displayName = 'MyMoaListPC';
export default MyMoaListPC;
