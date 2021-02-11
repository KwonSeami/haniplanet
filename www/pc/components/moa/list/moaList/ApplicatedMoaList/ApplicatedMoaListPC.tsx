import * as React from 'react';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import {useSelector} from 'react-redux';
import Link from 'next/link';
import BandApi from '../../../../../src/apis/BandApi';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import {pickUserSelector} from '../../../../../src/reducers/orm/user/selector';
import {staticUrl} from '../../../../../src/constants/env';
import {Div, TabLi, NoContentLi} from './styleCompPC';
import {isEmpty} from 'lodash';
import Loading from '../../../../common/Loading';

type TabType = 'status' | 'member_status';

interface ITabItem {
  label?: string;
  value: TabType;
  count?: string;
}

const TAB_ITEM: ITabItem[] = [
  {
    label: '가입신청',
    value: 'member_status',
    count: 'ongoing_member_moa_count',
  },
  {
    label: '개설신청',
    value: 'status',
    count: 'ongoing_moa_count',
  },
];

const ApplicatedMoaListPC = React.memo(() => {
  // Redux
  const me = useSelector(
    ({orm, system: {session: {id}}}) => (pickUserSelector(id)(orm) || {}),
    (prev, curr) => isEqual(prev, curr),
  );

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const [appliedMoaList, save] = React.useState({
    member_status: {
      fetchTime: null,
      list: [],
    },
    status: {
      fetchTime: null,
      list: [],
    },
  });
  const [currentTab, setCurrentTab] = React.useState<TabType>('member_status');
  const [pending, setPending] = React.useState<boolean>(true);

  const getAppliedMoaList = React.useCallback((key: TabType) => {
    if (!bandApi) {
      return <Loading/>;
    }

    setPending(true);
    bandApi.myBand({
      band_type: '["moa"]',
      grade: currentTab === 'member_status'
        ? 'normal'
        : 'manager',
      [key]: 'ongoing',
    })
      .then(({data: {results}}) => {
        if (!!results) {
          setPending(false);
          save(curr => ({
            ...curr,
            [key]: {
              fetchTime: new Date().getTime(),
              list: results,
            },
          }));
        }
      });
  }, [currentTab]);

  React.useEffect(() => {
    if (!appliedMoaList[currentTab].fetchTime) {
      getAppliedMoaList(currentTab);
    }
  }, [appliedMoaList, currentTab, getAppliedMoaList]);
  const curr = appliedMoaList[currentTab].list;

  return (
    <Div>
      <ul className="clearfix">
        {TAB_ITEM.map(({label, value, count}) => (
          <TabLi
            key={value}
            on={currentTab === value}
            onClick={() => setCurrentTab(value)}
          >
            {label}
            <span>{me[count]}</span>
          </TabLi>
        ))}
      </ul>
      <div className="tab-box">
        <ul>
          <li className="tab-content">
            <ul>
              {!isEmpty(curr) ?
                curr.map(
                  ({avatar, name, slug, created_at, member_created_at}) => {
                    const {dateLabel, date} = currentTab === 'member_status'
                      ? {
                        dateLabel: '가입신청',
                        date: member_created_at,
                      }
                      : {
                        dateLabel: '개설신청',
                        date: created_at,
                      };

                    return (
                      <li key={slug}>
                        <Link href={currentTab === 'member_status'
                          ? `/band/${slug}/applied`
                          : `/band/${slug}/opened`
                        }>
                          <a>
                            <div className="moa-list-box">
                              <img
                                src={avatar || staticUrl('/static/images/icon/icon-moa-default.png')}
                                alt="MOA이미지"
                              />
                              <h2>{name}</h2>
                              <p>{dateLabel} {moment(date).format('YY. MM. DD')}</p>
                            </div>
                          </a>
                        </Link>
                      </li>
                    );
                  },
                ) : pending ? (
                  <Loading />
                ) : (
                  <NoContentLi>아직 {currentTab === 'member_status' ? '가입신청' : '개설신청'}한 MOA가<br/>없습니다.</NoContentLi>
                )}
            </ul>
          </li>
        </ul>
      </div>
    </Div>
  );
});

ApplicatedMoaListPC.displayName = 'ApplicatedMoaListPC';
export default ApplicatedMoaListPC;
