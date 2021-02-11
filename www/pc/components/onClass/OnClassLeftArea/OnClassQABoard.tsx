import * as React from 'react';
import CheckBox from '../../UI/Checkbox1/CheckBox';
import cn from 'classnames';
import NoSSR from 'react-no-ssr';
import Link from 'next/link';
import {$BORDER_COLOR, $GRAY, $POINT_BLUE, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';
import {PROD_CLIENT_URL, staticUrl} from '../../../src/constants/env';
import Pagination from '../../UI/Pagination';
import styled from 'styled-components';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import SearchInput from '../../UI/SearchInput';
import {OnClassBoardWrapper, WriteButton} from '../../../pages/onclass/[slug]';
import NoContentText from '../../NoContent/NoContentText';
import Router, {useRouter} from 'next/router';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '../../../src/reducers';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import OnClassApi from '../../../src/apis/OnClassApi';
import Loading from '../../common/Loading';
import TimelineApi from '../../../src/apis/TimelineApi';
import moment from 'moment';
import {ONCLASS_MEMBER} from '../../../src/constants/meetup';
import StoryDetail from '../../story/branches/StoryDefault/StoryDetail';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import {waterMarkOptions} from '../../story/story.config';
import OnClassWriteBtn from '../OnClassWriteBtn';
import {pickStorySelector} from '../../../src/reducers/orm/story/selector';

const StyledNoContentText = styled(NoContentText)`
  > p {
    white-space: pre-line;
  }
`;
const OnClassQATable = styled.table`
  border-top: 1px solid ${$BORDER_COLOR};
  border-bottom: 1px solid ${$BORDER_COLOR};
  table-layout: fixed;

  tbody tr ~ tr {
    border-top: 1px solid #eee;
  }

  th {
    padding: 12px 0;
    border-bottom: 1px solid ${$BORDER_COLOR};
    ${fontStyleMixin({
      size: 14,
      weight: '300',
      color: '#999',
    })};

    &:nth-child(1) {
      width: 53px;
    }

    &:nth-child(2) {
      width: 100px;
      padding-left: 25px;
      text-align: left;
    }

    &:nth-child(3) {
      padding-left: 146px;
      text-align: left;
    }

    &:last-child {
      width: 85px;
    }
  }

  td {
    padding: 16px 0;
    text-align: center;
    ${fontStyleMixin({
      size: 12,
      family: 'Noto Sans KR',
    })};

    &.order {
      ${fontStyleMixin({
        size: 13,
        color: '#999',
      })};

      span {
        display: inline-block;
        width: 33px;
        ${heightMixin(22)};
        border-radius: 11px;
        background-color: #f32b43;
        box-sizing: border-box;
        ${fontStyleMixin({
          size: 12,
          weight: '600',
          color: $WHITE,
        })};
      }
    }

    &.author {
      font-weight: 600;
      text-align: left;
      padding-left: 5px;
      padding-right: 10px;

      img {
        width: 18px;
        vertical-align: top;
        margin-right: 1px;
      }

      span {
        color: ${$GRAY};
      }
    }

    &.title {
      position: relative;
      text-align: left;

      h3 {
        display: inline-block;
        max-width: 310px;
        box-sizing: border-box;
        vertical-align: middle;
        ${fontStyleMixin({
          size: 15,
          weight: '600',
          family: 'Noto Sans KR',
        })};

        &:hover {
          text-decoration: underline;
        }

        &:active {
          color: ${$GRAY};
        }
      }

      &.on h3 {
        text-decoration: underline;
      }

      .qa-status {
        display: inline-block;
        width: 46px;
        height: 16px;
        line-height: 16px;
        margin-left: 7px;
        text-align: center;
        background-color: #eee;
        vertical-align: text-top;
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

      .comment-count {
        margin-left: 3px;
        vertical-align: bottom;
        ${fontStyleMixin({
          size: 14,
          color: $TEXT_GRAY
        })};
      }

      img {
        display: inline-block;
        vertical-align: middle;
        width: 19px;
        margin: -3px 0 0 2px;
      }
    }

    &.date {
      ${fontStyleMixin({
        color: '#999',
        family: 'Montserrat',
      })};
    }
  }
`;

const OnClassQASearch = styled(SearchInput)`
  display: inline-block;
  width: 340px;
  height: 40px;
  padding-left: 15px;
  margin: 15px 0 -5px;
  background-color: #f8f8f8;
  border-radius: 20px;
  border-bottom: 0;
  box-sizing: border-box;

  input::placeholder {
    ${fontStyleMixin({
      size: 14,
      weight: '600',
      color: $TEXT_GRAY,
    })};
  }

  > img {
    right: 7px;
    width: 26px;
    opacity: 0.4;
  }
`;

const PAGE_SIZE = 10;
const PAGE_GROUP_SIZE = 10;

const ORDER_TYPE = [
  {label: '최신순', value: '-created_at'},
  {label: '조회순', value: '-retrieve_count'},
];

const OnClassQABoard = (hasPermissionToWrite) => {
  const {query: {slug, q: _q, page: _page, order_by, my_question}} = useRouter();
  const [pending, setPending] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [timelineList, setTimelineList] = React.useState([]);
  const [isMyQuestion, setIsMyQuestion] = React.useState(my_question);
  const [q, setQ] = React.useState(_q);
  const [openStoryIndex, setOpenStoryIndex] = React.useState(null);

  const {is_writer, isOwner, storyId} = React.useMemo(() => {
    if (!!openStoryIndex) {
      const story = timelineList[openStoryIndex - 1] || {};
      const {user, id} = story || {};
      const {is_writer, member_grade} = user || {};
      const isOwner = member_grade !== 'normal';

      return {is_writer, isOwner, storyId: id};
    }

    return {};
  }, [openStoryIndex]);

  const {band, me, access, story} = useSelector(
    ({system: {session: {access, id: userId}}, orm}: RootState) => ({
      band: pickBandSelector(slug)(orm) || {},
      story: pickStorySelector(storyId)(orm) || {},
      me: pickUserSelector(userId)(orm) || {},
      access
    }),shallowEqual,
  );

  const {band_member_grade, timelines} = band || {};
  const {is_answered} = story || {};
  const {myId, myName} = me || {};
  const waterMarkProps = {
    options: waterMarkOptions,
    waterMarkText: `${myName}_${myId}`
  };

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
          setOpenStoryIndex(null);
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
    (!isVisitor && (!!totalCount || !!_q)) ? (
      <OnClassBoardWrapper>
        {!!openStoryIndex && (
          <StoryDetail
            {...timelineList[openStoryIndex - 1]}
            waterMarkProps={waterMarkProps}
            labelArr={timelineId}
            shareUrl={`${PROD_CLIENT_URL}/onclass/${slug}?timeline=${timelineId}&id=${timelineList[openStoryIndex - 1].id}`}
            isWriter={is_writer}
            detail
            access={access}
            storyType="community"
            isQnA={!isOwner}
            band_member_grade={band_member_grade}
          />
        )}
        <p className="total-story">
          <span>총 {totalCount}건</span>의 학습질문이 있습니다.
        </p>
        <div className="qa-category">
          <CheckBox
            checked={isMyQuestion}
            onChange={() => {
              setIsMyQuestion(!isMyQuestion);
              setURL(order_by, q, !isMyQuestion, page);
            }}
          >
            내 질문만 보기
          </CheckBox>
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
        </div>
        <NoSSR>
          <OnClassQATable>
            <caption className="hidden">
              질문 및 답변 게시판
            </caption>
            <thead>
              <tr>
                <th>NO</th>
                <th>작성자</th>
                <th>제목</th>
                <th>작성일</th>
              </tr>
            </thead>
            <tbody>
              {timelineList.map(({
                comment_count,
                user_expose_type,
                user,
                created_at,
                is_answered: _is_answered,
                title,
                order
              }, index) => {
                const {name, member_grade} = user || {};
                const isOwner = member_grade !== 'normal';
                const isAnswered = is_answered || _is_answered ||
                  (moment(created_at).isBefore("20200616") && comment_count > 0);
                return (
                  <tr>
                    <td className="order">
                      {order}
                    </td>
                    <td className="author">
                      <img
                        src={staticUrl(`/static/images/icon/${isOwner ? 'onclass-owner' : 'onclass-stu'}.png`)}
                        alt=""
                      />
                      {user_expose_type === 'anon' ? '익명의' : (name || '익명의')} <span>{ONCLASS_MEMBER[member_grade]}</span>
                    </td>
                    <td
                      onClick = {() => {
                        setOpenStoryIndex(index + 1);
                        window.scrollTo(0, 0);
                      }}
                      className={cn('title', {on: (index + 1) === openStoryIndex})}
                    >
                      <h3 className="ellipsis pointer">{title}</h3>
                      {!isOwner &&
                        <span
                          className={cn('qa-status', {on: isAnswered})}
                        >
                          {isAnswered  ? '답변완료' : '답변대기'}
                        </span>
                      }
                      {!!comment_count && <span className="comment-count">({comment_count})</span>}
                      {moment(created_at).add(1, 'days').isAfter() && (
                        <img
                          src={staticUrl('/static/images/icon/icon-new.png')}
                          alt="new"
                        />

                      )}
                    </td>
                    <td className="date">
                      {!!created_at && moment(created_at).format('YY.MM.DD')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </OnClassQATable>
          <OnClassQASearch
            placeholder="찾고 싶은 글이 있으신가요?"
            value={q}
            onChange={onChangeKeyword}
            onSearch={onSearchKeyword}
          />
          {hasPermissionToWrite && <OnClassWriteBtn slug={slug as string} timelineId={timelineId}/>}
        </NoSSR>
        <Pagination
          className="board-pagination"
          currentPage={page}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          pageGroupSize={PAGE_GROUP_SIZE}
          onClick={page => setURL(order_by, q, isMyQuestion, page)}
        />
      </OnClassBoardWrapper>
    ) : (
      <StyledNoContentText>
        <p>
          {!!isVisitor
            ? '권한이 없습니다.'
            : '아직 작성된 학습질문이 없습니다. \n궁금한 질문을 남겨보세요.'
          }
        </p>
        {hasPermissionToWrite && <OnClassWriteBtn slug={slug as string} timelineId={timelineId}/>}
      </StyledNoContentText>
    )
  )
}

export default React.memo(OnClassQABoard)