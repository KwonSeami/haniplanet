import * as React from 'react';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import {useSelector} from 'react-redux';
import Link from 'next/link';
import BandApi from '../../../../../src/apis/BandApi';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import {staticUrl} from '../../../../../src/constants/env';
import {pickUserSelector} from '../../../../../src/reducers/orm/user/selector';
import {Div, TabTitle} from './styleCompMobile';

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
  }
];

const AppliedMoaListMobile = React.memo(() => {
  // Redux
  const me = useSelector(
    ({orm, system: {session: {id}}}) => (pickUserSelector(id)(orm) || {}),
    (prev, curr) => isEqual(prev, curr)
  );

  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));
  const [appliedMoaList, save] = React.useState({
    member_status: {
      fetchTime: null,
      list: []
    },
    status: {
      fetchTime: null,
      list: []
    }
  });

  // 모바일만 가지고 있는 로직
  const [isOpenTab, setIsOpenTab] = React.useState({
    member_status: false,
    status: false
  });

  const getApplicatedMoaList = (key: TabType) => {
    if (!bandApi) { return null; }

    bandApi.myBand({
      band_type: '["moa"]',
      grade: key === 'member_status'
        ? 'normal'
        : 'manager',
      [key]: 'ongoing'
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
  };

  React.useEffect(() => {
    const isOpenTabKeys = Object.keys(isOpenTab) as TabType[];

    for (const item of isOpenTabKeys) {
      if (isOpenTab[item] && !appliedMoaList[item].fetchTime) {
        getApplicatedMoaList(item);
      }
    }
  }, [isOpenTab, appliedMoaList]);

  return (
    <Div>
      <ul className="clearfix">
        {TAB_ITEM.map(({label, value, count}) => (
          <li key={value}>
            <TabTitle
              on={isOpenTab[value]}
              onClick={() => {
                setIsOpenTab(curr => ({
                  ...curr,
                  [value]: !curr[value]
                }));
              }}
            >
              {label}
              <span>{me[count]}</span>
              <img
                src={staticUrl('/static/images/icon/arrow/icon-mini-shortcuts.png')}
                alt="리스트 펼치기"
              />
            </TabTitle>
            {isOpenTab[value] && (
              <div className="tab-box">
                <ul>
                  {appliedMoaList[value].list.map(
                    ({avatar, name, slug, created_at, member_created_at}) => {
                      const {dateLabel, date} = value === 'member_status'
                        ? {
                          dateLabel: '가입신청',
                          date: member_created_at
                        }
                        : {
                          dateLabel: '개설신청',
                          date: created_at
                        };
  
                      return (
                        <li key={slug}>
                          <Link href={value === 'member_status'
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
                    }
                  )}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Div>
  );
});

AppliedMoaListMobile.displayName = 'AppliedMoaListMobile';
export default AppliedMoaListMobile;
