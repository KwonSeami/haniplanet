import * as React from 'react';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import Link from 'next/link';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import BandApi from '../../../../src/apis/BandApi';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import {RootState} from "../../../../src/reducers";
import {staticUrl} from '../../../../src/constants/env';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import {StyledButtonGroup, NoContent, ListItem, ListWrapper} from './style';
import {pushPopup} from '../../../../src/reducers/popup';
import OnComingPopup from '../../../layout/popup/OnComingPopup';
import PaginationDynamic from '../../../UI/PaginationDynamic';
import Loading from '../../../common/Loading';

const PAGE_SIZE = 8;
const PAGE_GROUP_SIZE = 10;

type TabType = 'status' | 'member_status';

const OnClassList = () => {

  const dispatch = useDispatch();

  // Redux
  const {signed_onclass_count, managing_onclass_count} = useSelector(
    ({orm, system: {session: {id}}}: RootState) => pickUserSelector(id)(orm) || {},
    shallowEqual,
  );

  const [myOnClassList, save] = React.useState({
    member_status: {
      fetchTime: null,
      list: [],
      totalCount: null,
    },
    status: {
      fetchTime: null,
      list: [],
      totalCount: null,
    }
  });

  const onClassApi: BandApi = useCallAccessFunc(access => new BandApi(access));
  const [currentTab, setCurrentTab] = React.useState<TabType>('member_status');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pending, setPending] = React.useState(true);

  const isManageOnClass = currentTab === 'status';

  React.useEffect(() => {
    const form = {
      band_type: '["onclass"]',
      grade: currentTab === 'member_status'
        ? 'normal'
        : 'manager',
      page: currentPage,
      offset: (currentPage - 1) * PAGE_SIZE,
      limit: PAGE_SIZE
    };

    setPending(true);
    onClassApi.myBand(form)
      .then(({status, data: {results, count}}) => {
        if (status === 200) {
          setPending(false);
          !!results && save(curr => ({
            ...curr,
            [currentTab]: {
              fetchTime: new Date().getTime(),
              totalCount: count,
              list: results,
            }
          }));
        }
      });
  }, [currentTab, currentPage]);

  if (pending) {
    return <Loading/>
  }

  return (
    <div>
      <StyledButtonGroup
        on={currentTab}
        leftButton={{
          children:
            <>
              수강강의
              <span>{signed_onclass_count}</span>
            </>,
          onClick: () => {
            setCurrentTab('member_status');
            setCurrentPage(1)
          }
        }}
        rightButton={{
          children:
            <>
              관리강의
              <span>{managing_onclass_count}</span>
            </>,
          onClick: () => {
            setCurrentTab('status');
            setCurrentPage(1);
          }
        }}
      />
      {!isEmpty(myOnClassList[currentTab].list) ? (
        <ListWrapper>
          <ul>
            {(myOnClassList[currentTab].list || []).map(
              ({slug, name, avatar, story_count, new_story_count, member_count, onclass_info, oncoming_month}) => {
                const {remaining_days, onclass_status, receipt_remaining_days} = onclass_info || {} as any;
                const duration = isManageOnClass ? receipt_remaining_days : remaining_days;

                return (
                  <ListItem avatar={avatar}>
                    <article>
                      <Link
                        href="/onclass/[slug]"
                        as={`/onclass/${slug}`}
                      >
                        <a
                          onClick={e => {
                            if (onclass_status === 'oncoming') {
                              e.preventDefault();
                              dispatch(pushPopup(OnComingPopup, {oncoming_month}));
                            }
                          }}
                        >
                          <div className={cn('item-img', {off: (!onclass_info) || (remaining_days < 1) || (duration < 1)})}>
                          <span>
                            <img
                              src={duration
                                ? staticUrl('/static/images/icon/onclass-duration-on.png')
                                : staticUrl('/static/images/icon/onclass-duration-off.png')}
                              alt="수강 기간"
                            />
                            {isManageOnClass ? '신청' : '학습'}
                            {duration > 0 ? (
                              <> 기간 <b>{duration}일</b> 남음</>
                              ) : (
                                <>종료</>
                            )}
                          </span>
                          <span>
                            바로가기
                            <img
                              src={staticUrl('/static/images/icon/arrow/icon-shortcuts-white.png')}
                              alt={`${name} 바로가기`}
                            />
                          </span>
                          </div>
                          <div className="item-title">
                            <h2 className="ellipsis">{name}</h2>
                            <ul>
                              <li>
                                총 게시글&nbsp;<span>{story_count}</span>&nbsp;·&nbsp;
                              </li>
                              <li>
                                새글&nbsp;<span className="new-story">{new_story_count}</span>&nbsp;·&nbsp;
                              </li>
                              <li>
                                수강생&nbsp;<span>{member_count}</span>
                              </li>
                            </ul>
                          </div>
                        </a>
                      </Link>
                    </article>
                  </ListItem>
                );
              })}
          </ul>
          {myOnClassList[currentTab].totalCount > PAGE_SIZE &&(
            <PaginationDynamic
              currentPage={currentPage}
              totalCount={myOnClassList[currentTab].totalCount}
              pageSize={PAGE_SIZE}
              pageGroupSize={PAGE_GROUP_SIZE}
              onClick={currentPage => setCurrentPage(currentPage)}
            />
          )}
        </ListWrapper>
      ) : (
        <NoContent>
          <img
            className="no-content-img"
            src={isManageOnClass
              ? staticUrl('/static/images/icon/onclass-admin-null.png')
              : staticUrl('/static/images/icon/onclass-join-null.png')}
            alt="온라인강의가 없네요"
          />
          <h2>
            {isManageOnClass
              ? '아직 관리 중인 강의가 없네요'
              : '아직 수강신청한 강의가 없네요'}
          </h2>
          <p>
            {isManageOnClass
              ? '온라인강의를 만들어보세요!!'
              : '아래의 추천 강의를 신청해보세요!!'}
            <img
              src={staticUrl('/static/images/icon/arrow/icon-down-more.png')}
              alt="온라인강의 소개 화살표"
            />
          </p>
        </NoContent>
      )}
    </div>
  );
};

export default React.memo(OnClassList);
