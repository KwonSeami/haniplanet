import * as React from 'react';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import {useSelector} from 'react-redux';
import MyMoaSliderMobile from './MyMoaSlider/MyMoaSliderMobile';
import {StyledButtonGroup, NoContent, P} from './styleCompMobile';
import {pickUserSelector} from '../../../../../src/reducers/orm/user/selector';
import BandApi from '../../../../../src/apis/BandApi';
import {staticUrl} from '../../../../../src/constants/env';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';

type TabType = 'status' | 'member_status';

const MyMoaListMobile = React.memo(
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
      myBandApi.myBand({
        band_type: '["moa"]',
        grade: currentTab === 'member_status' ? 'normal' : 'manager',
        [key]: 'active',
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
    }, []);
  
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
        <P>
          함께하는 너와 나, 우리! 모두 모아!<br />
          그룹을 위한 공간, MOA에서 시작하세요
        </P>
        {!isEmpty(myMoaList[currentTab].list) ? (
          <MyMoaSliderMobile myMoaList={myMoaList[currentTab].list} />
        ) : (
          <NoContent>
            <img 
              className="no-content-img"
              src={staticUrl('/static/images/icon/icon-join-null.png')}
              alt="아직 가입한 MOA가 없네요"
            />
            <h2>아직 가입한 MOA가 없네요</h2>
            <p>
              아래의 추천 MOA로 가입해보세요!!
              <img
                src={staticUrl('/static/images/icon/icon-down-more.png')}
                alt="Moa 가입하기"
              />
            </p>
          </NoContent>
        )}
      </div>
    );
  }
);

MyMoaListMobile.displayName = 'MyMoaListMobile';
export default MyMoaListMobile;
