import * as React from 'react';
import CheckBox from '../../UI/Checkbox1/CheckBox';
import cn from 'classnames';
import NoSSR from 'react-no-ssr';
import {$GRAY, $POINT_BLUE, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';
import {PROD_CLIENT_URL, staticUrl} from '../../../src/constants/env';
import Pagination from '../../UI/Pagination';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import SearchInput from '../../UI/SearchInput';
import {BoardSection} from '../../../pages/onclass/[slug]';
import NoContentText from '../../NoContent/NoContentText';
import Router, {useRouter} from 'next/router';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '../../../src/reducers';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import Loading from '../../common/Loading';
import TimelineApi from '../../../src/apis/TimelineApi';
import moment from 'moment';
import {ONCLASS_MEMBER} from '../../../src/constants/meetup';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {waterMarkOptions} from '../../story/story.config';
import StoryDetailPage from '../../story/StoryDetailPage';
import Link from 'next/link';

const OnClassQALi = styled.li`
  padding: 15px;
  border-bottom: 1px solid #eee;

  .title {
    position: relative;
    display: inline-block;
    margin-bottom: 7px;

    h3 {
      display: inline;
      line-height: 1.6;
      ${fontStyleMixin({
        size: 15,
        weight: '600'
      })};
    }
  
    .comment-count {
      margin-left: 2px;
      ${fontStyleMixin({
        size: 14,
        color: $TEXT_GRAY
      })};
    }

    .new-story {
      width: 4px;
      margin: 6px 0 0 2px;
      vertical-align: top;
    }
  }

  div:not(.title) {
    > img {
      width: 18px;
      margin-right: 2px;
      vertical-align: middle;
    }
  
    b {
      display: inline-block;
      font-size: 12px;
      vertical-align: middle;
    }
  
    span:not(.qa-status) {
      vertical-align: middle;
      ${fontStyleMixin({
        size: 12,
        color: $GRAY
      })};
    }
  
    p {
      display: inline-block;
      margin-left: 5px;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })};
    }

    .qa-status {
      display: inline-block;
      width: 46px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      background-color: #eee;
      vertical-align: middle;
      float: right;
      ${fontStyleMixin({
        size: 11,
        color: '#999'
      })};

      &.on {
        color: ${$POINT_BLUE};
        background-color: ${$WHITE};
        border: 1px solid #499aff;
      }
    }
  }

  @media screen and (min-width: 680px) {
    div:not(.title) {
      .qa-status {
        float: none;
        margin-left: 7px;
      }
    }
  }
`;

export const OnClassQASearch = styled(SearchInput)`
  top: 0;
  width: 330px;
  height: 40px;
  padding: 0 0 0 13px;
  margin: auto;
  background-color: #f8f8f8;
  border-radius: 20px;
  box-sizing: border-box;

  input[type="text"] {
    height: 100%;
    border-bottom: 0;
    padding-bottom: 0;
  }

  input::placeholder {
    ${fontStyleMixin({
      size: 14,
      weight: '600',
      color: $TEXT_GRAY,
    })};
  }

  > img {
    top: 50%;
    right: 9px;
    transform: translateY(-50%);
    width: 26px;
    opacity: 0.4;
    padding-bottom: 0;
  }
`;

const PAGE_SIZE = 6;
const PAGE_GROUP_SIZE = 5;

const MAX_TITLE_LENGTH = 38;

const ORDER_TYPE = [
  {label: '최신순', value: '-created_at'},
  {label: '조회순', value: '-retrieve_count'},
];

const OnClassQABoard = () => {
  const {query: {slug, q: _q, page: _page, order_by, my_question, id: storyId}} = useRouter();
  const [pending, setPending] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [timelineList, setTimelineList] = React.useState([]);
  const [isMyQuestion, setIsMyQuestion] = React.useState(my_question || false);
  const [q, setQ] = React.useState(_q);

  const {band, me, access} = useSelector(
    ({system: {session: {access, id: userId}}, orm}: RootState) => ({
      band: pickBandSelector(slug)(orm) || {},
      me: pickUserSelector(userId)(orm) || {},
      access
    }),shallowEqual,
  );

  const {band_member_grade, timelines} = band || {};
  const {myId, myName} = me || {};

  const timelineId = timelines.filter(({name}) => name === '질문 및 답변')[0].id || '';
  const timelineApi = useCallAccessFunc(access => access && new TimelineApi(access));
  const page = Number(_page) || 1;
  const isVisitor = band_member_grade === 'visitor';

  const setURL = (order_by, q, my_question, page) => {
    Router.replace(
      {pathname: '/onclass/[slug]', query: {timeline: timelineId, order_by, q, my_question, page}},
      {pathname: `/onclass/${slug}`, query: {timeline: timelineId, order_by, q, my_question, page}},
    );
  };

  React.useEffect(() => {
    timelineApi && timelineApi.list(timelineId, {
      page,
      page_size: PAGE_SIZE,
      order_by,
      my_question: isMyQuestion ? "True" : "False",
      q
    }).then(({status, data: {count, results}}) => {
      setPending(true);
      if (status === 200) {
        setPending(false);
        setTotalCount(count);
        setTimelineList(results);
      }
    });
  }, [slug, page, order_by, my_question, _q]);

  const onChangeKeyword = React.useCallback(({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
    setQ(value);
  }, []);

  const onSearchKeyword = React.useCallback((keyword: string) => {
    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return setURL(order_by, '', my_question, page);
    }

    setURL(order_by, trimmedKeyword, my_question, page);
  }, []);

  if (pending) {
    return <Loading/>;
  }

  return (
    <BoardSection>
      <div>
        {(!isVisitor && (!!totalCount || !!_q)) ? (
          <>
            <p className="total-story">
              <span>총 {totalCount}건</span>의&nbsp;학습질문이 있습니다.
            </p>
            <div className="qa-category">
              <ul>
                {ORDER_TYPE.map(({label, value}, index) => (
                  <li
                    className={cn({on: order_by ? value === order_by : index === 0})}
                    key={label + value}
                    onClick={() => setURL(value, q, isMyQuestion, page)}
                  >
                    {label}
                  </li>
                ))}
              </ul>
              <CheckBox
                checked={isMyQuestion as boolean}
                onChange={() => {
                  setIsMyQuestion(!isMyQuestion);
                  setURL(order_by, q, !isMyQuestion, page);
                }}
              >
                내 질문만 보기
              </CheckBox>
            </div>
            <NoSSR>
              <ul>
                {timelineList.map(({
                  id,
                  comment_count,
                  user,
                  created_at,
                  is_answered,
                  title,
                  user_expose_type,
                  order
                }, index) => {
                  const {name, member_grade} = user || {};
                  const isOwner = member_grade !== 'normal';
                  const isAnswered = is_answered || moment(created_at).isBefore("20200616");

                  return (
                    <OnClassQALi>
                      <Link
                        href={`/onclass/[slug]/timeline/[id]?timeline=${timelineId}`}
                        as={`/onclass/${slug}/timeline/${id}?timeline=${timelineId}`}
                      >
                        <a>
                          <div className="title">
                            <h3>
                              {title.length <= MAX_TITLE_LENGTH
                                ? title
                                : `${title.substr(0, MAX_TITLE_LENGTH)}...`}
                            </h3>
                            {!!comment_count && <span className="comment-count">({comment_count})</span>}
                            {moment(created_at).add(1, 'days').isAfter() && (
                              <img
                                className="new-story"
                                src={staticUrl('/static/images/icon/new-story-dot-blue.png')}
                                alt="새 글"
                              />
                            )}
                          </div>
                        </a>
                      </Link>
                      <div className="clearfix">
                        <img
                          src={staticUrl(`/static/images/icon/${isOwner ? 'onclass-owner' : 'onclass-stu'}.png`)}
                          alt=""
                        />
                        <b>{user_expose_type === 'anon' ? '익명의' : (name || '익명의')}</b>&nbsp;
                        <span>{ONCLASS_MEMBER[member_grade]}</span>
                        <p>
                          {!!created_at && moment(created_at).format('YY.MM.DD')}
                        </p>
                        {!isOwner &&
                          <span
                            className={cn('qa-status', {on: isAnswered})}
                          >
                            {isAnswered ? '답변완료' : '답변대기'}
                          </span>
                        }
                      </div>
                    </OnClassQALi>
                  )
                })}
              </ul>
              <Pagination
                className="qa-pagination"
                currentPage={page}
                totalCount={totalCount}
                pageSize={PAGE_SIZE}
                pageGroupSize={PAGE_GROUP_SIZE}
                onClick={page => setURL(order_by, q, isMyQuestion, page)}
              />
              <OnClassQASearch
                placeholder="찾고 싶은 글이 있으신가요?"
                value={q}
                onChange={onChangeKeyword}
                onSearch={onSearchKeyword}
              />
            </NoSSR>
          </>
        ) : (
          <NoContentText>
            <p>
              {!!isVisitor
                ? '권한이 없습니다.'
                : '아직 작성된 학습질문이 없습니다. \n궁금한 질문을 남겨보세요.'
              }
            </p>
          </NoContentText>
        )}
      </div>
    </BoardSection>
  )
}

export default React.memo(OnClassQABoard)