import React from 'react';
// Hook
import useSetQueryParam from '../../src/hooks/useSetQueryParam';
import {useRouter} from 'next/router'
import {useQuery} from '@apollo/react-hooks';
// Redux
import {useSelector} from 'react-redux';
import {RootState} from '../../src/reducers';
// GQL
import {MY_MERCHANT_UIDS} from '../../src/gqls/shopping';
// Component
import PaymentTabMenu from '../../components/payment/PaymentTabMenu';
import Link from 'next/link';
import PaymentItem from '../../components/payment/PaymentItem';
import CustomDayPickerInput from '../../components/CustomDayPickerInput';
import Loading from '../../components/common/Loading';
import NoContentLi from '../../components/AutocompleteList/NoContentACLi';
// Styled Component
import {PaymentWrapperDiv, PaymentLayoutDiv} from '../../components/shopping/style/payment';
import {PaymentMoreButton} from '../../components/payment/style';
// Constant
import {staticUrl} from '../../src/constants/env';
import {$BORDER_COLOR, $WHITE} from '../../styles/variables.types';
// Util
import moment from 'moment';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';

const DATE_FORMAT = 'YYYYMMDD';
const PAGE_SIZE = 20;

const PaymentList: React.FC = () => {
  const [year, month] = React.useMemo(() => {
    const _moment = moment();
    return [_moment.get('year'), _moment.get('month')];
  }, []);

  const {query: {
    start_at = moment([year, month, 1]).format(DATE_FORMAT), 
    end_at = moment([year, month+1, 1]).format(DATE_FORMAT), 
    extend_to = 'goods',
    track_progresses,
    apply_statuses,
  }} = useRouter();
  
  const userId = useSelector(({system: {session: {id}}}: RootState) => id);
  
  const {pushQueryParam} = useSetQueryParam();
  const [page, setPage] = React.useState(1);
  const [toggleMonth, setToggleMonth] = React.useState(0);
  const [periodStartAt, setPeriodStartAt] = React.useState(moment(start_at));
  const [periodEndAt, setPeriodEndAt] = React.useState(moment(end_at));

  const periodStartDate = periodStartAt.toDate();
  const periodEndDate = periodEndAt.toDate();

  const {
    data: {my_merchant_uids = {}} = {my_merchant_uids},
    loading,
  } = useQuery(MY_MERCHANT_UIDS, {
    variables: {
      offset: 0,
      limit: PAGE_SIZE * page,
      start_at,
      end_at,
      story_extend_to: extend_to,
      track_progresses: track_progresses ? [track_progresses] : [],
      apply_statuses: apply_statuses ? [apply_statuses] : []
    }
  });

  const {
    nodes,
    count
  } = my_merchant_uids || {};

  const applyCount = React.useMemo(() => {
    if(loading || isEmpty(nodes)) return 0;

    return nodes.reduce((prevCurr, {applies}) => {
      return prevCurr + applies.length;
    }, 0);
  }, [nodes]);

  React.useEffect(() => {
    if(periodStartAt.get('date') === 1 && periodEndAt.get('date') === 1) {
      const periodStartMonth = periodStartAt.get('month');
      
      if(periodEndAt.get('month') - periodStartMonth === 1) {
        setToggleMonth(periodStartMonth);
      }
    }
  }, [periodStartAt, periodEndAt])

  return (
    <PaymentWrapperDiv>
      <header>
        <div className="background-wrap">
          <PaymentLayoutDiv>
            <ul className="tab-title">
              <li className={cn({
                on: extend_to === 'goods'
              })}>
                <Link href="/payment?extend_to=goods">
                  <a>마켓</a>
                </Link>
              </li>
              <li className={cn({
                on: extend_to === 'meetup'
              })}>
                <Link href="/payment?extend_to=meetup">
                  <a>세미나모임/온라인강의</a>
                </Link>
              </li>
            </ul>
            <PaymentTabMenu 
              status={track_progresses || apply_statuses || '' as string}
              extend_to={extend_to as string}
              onClick={({
                key,
                value
              }) => {
                const data = {
                  track_progresses: '',
                  apply_statuses: '',
                  [key || '']: value
                };``

                pushQueryParam(curr => ({
                  ...curr,
                  ...data
                }), {shallow: true})
              }}
            />
          </PaymentLayoutDiv>
        </div>
        <div className="date-wrap">
          <ul>
            {[month-2, month-1, month].map(value => (
              <li key={value}>
                <button
                  className={cn({
                    on: toggleMonth === value
                  })}
                  onClick={() => {
                    setPeriodStartAt(moment([year, value, 1]));
                    setPeriodEndAt(moment([year, value+1, 1]));
                  }}
                >
                  {value+1}월
                </button>
              </li>
            ))}
          </ul>
          <div>
            <ul>
              <li className="date-li">
                <CustomDayPickerInput
                  placeholder="0000.00.00"
                  value={periodStartDate}
                  format="LL"
                  additionalStyle={{
                    backgroundImage: `url(${staticUrl('/static/images/icon/icon-calendar-payment.png')})`,
                    backgroundSize: '17px 16px',
                    backgroundPosition: 'left 12px center',
                  }}
                  dayPickerProps={{
                    selectedDays: [periodStartDate, periodEndDate] as any[],
                    disabledDays: {
                      after: periodEndDate
                    },
                    month: periodStartDate
                  }}
                  onDayChange={value => {
                    setToggleMonth(0);
                    setPeriodStartAt(moment(value));
                  }}
                />
              </li>
              <li className="date-li">
                <CustomDayPickerInput
                  placeholder="0000.00.00"
                  value={periodEndDate}
                  additionalStyle={{
                    backgroundImage: `url(${staticUrl('/static/images/icon/icon-calendar-payment.png')})`,
                    backgroundSize: '17px 16px',
                    backgroundPosition: 'left 12px center',
                  }}
                  dayPickerProps={{
                    selectedDays: [periodStartDate, periodEndDate] as any[],
                    disabledDays: {
                      before: periodStartDate
                    },
                    month: periodEndDate
                  }}
                  onDayChange={value => {
                    setToggleMonth(0);
                    setPeriodEndAt(moment(value))
                  }}
                />
              </li>
            </ul>
            <button
              onClick={() => {
                pushQueryParam(curr => ({
                  ...curr,
                  start_at: periodStartAt.format(DATE_FORMAT),
                  end_at: periodEndAt.format(DATE_FORMAT)
                }));
              }}
            >
              조회
            </button>
          </div>
        </div>
      </header>
      <ul className="data-list">
        {loading 
          ? <Loading/> 
          : !!applyCount 
            ? (
              nodes.map((
                {
                  merchant_uid,
                  created_at,
                  applies
                }
              ) => (
                !isEmpty(applies) && (
                  <li key={merchant_uid}>
                    <h2>{created_at}</h2>
                    <ul>
                      {applies.map(({id, story: {id: storyId, ...story}, ...props}) => (
                        <PaymentItem
                          key={id}
                          id={id}
                          storyId={storyId}
                          merchant_uid={merchant_uid}
                          userId={userId}
                          {...props}
                          {...story}
                        />
                      ))}
                    </ul>
                  </li>
                )
              ))
            ) : (
              <NoContentLi>결제 정보가 없습니다.</NoContentLi>
            )
        }
      </ul>
      {count > page * PAGE_SIZE && (
        <PaymentMoreButton
          size={{
            width: '100%',
            height: '50px'
          }}
          border={{
            width: '1px',
            radius: '0',
            color: $BORDER_COLOR,
          }}
          font={{
            size: '14px',
            color: '#999',
          }}
          backgroundColor={$WHITE}
          onClick={() => setPage(curr => curr+1)}
        >
          더보기
        </PaymentMoreButton>
      )}
    </PaymentWrapperDiv>
  )
};

export default React.memo(PaymentList);