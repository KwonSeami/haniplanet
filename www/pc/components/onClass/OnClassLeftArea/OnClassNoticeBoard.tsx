import * as React from 'react';
import {PROD_CLIENT_URL, staticUrl} from '../../../src/constants/env';
import cn from 'classnames';
import styled from 'styled-components';
import {$BORDER_COLOR, $GRAY, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import NoContentText from '../../NoContent/NoContentText';
import {OnClassBoardWrapper} from '../../../pages/onclass/[slug]';
import Router, {useRouter} from 'next/router';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '../../../src/reducers';
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import Loading from '../../common/Loading';
import TimelineApi from '../../../src/apis/TimelineApi';
import moment from 'moment';
import Pagination from '../../UI/Pagination';
import {ONCLASS_MEMBER} from '../../../src/constants/meetup';
import StoryDetail from '../../story/branches/StoryDefault/StoryDetail';
import {waterMarkOptions} from '../../story/story.config';
import {pickUserSelector} from '../../../src/reducers/orm/user/selector';
import OnClassWriteBtn from '../OnClassWriteBtn';

const OnClassNoticeTable = styled.table`
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
      width: 56px;
    }

    &:nth-child(4) {
      width: 97px;
    }

    &:last-child {
      width: 85px;
    }
  }

  td {
    padding: 15px 0 14px;
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

    &.subject {
      ${fontStyleMixin({
        color: '#999',
        family: 'Noto Sans KR',
      })};

      img {
        width: 20px;
        vertical-align: middle;
      }
    }

    &.title {
      position: relative;
      padding-right: 15px;
      text-align: left;

      h3 {
        display: inline-block;
        max-width: 350px;
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
      }

      img {
        display: inline-block;
        vertical-align: middle;
        width: 19px;
        margin: -3px 0 0 3px;
      }

      &.on h3 {
        text-decoration: underline;
      }

      &:active h3 {
        color: ${$GRAY};
      }
    }

    &.author {
      font-weight: 600;

      img {
        width: 18px;
        vertical-align: top;
        margin-right: 1px;
      }

      span {
        color: ${$GRAY};
      }
    }

    &.date {
      ${fontStyleMixin({
        color: $TEXT_GRAY,
        family: 'Montserrat',
      })};
    }
  }
`;

const PAGE_SIZE = 10;
const PAGE_GROUP_SIZE = 10;

interface Props {
  hasPermissionToWrite?: boolean;
}

const OnClassNoticeBoard:React.FC<Props> = ({hasPermissionToWrite}) => {
  const {query: {slug, page: _page}} = useRouter();
  const [pending, setPending] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [timelineList, setTimelineList] = React.useState([]);
  const [openStoryIndex, setOpenStoryIndex] = React.useState(null);

  const {band, me, access} = useSelector(
    ({system: {session: {access, id: userId}}, orm}: RootState) => ({
      band: pickBandSelector(slug)(orm) || {},
      me: pickUserSelector(userId)(orm) || {},
      access
    }),shallowEqual,
  );

  const {band_member_grade, timelines} = band || {};
  const {myId, myName} = me || {};
  const waterMarkProps = {
    options: waterMarkOptions,
    waterMarkText: `${myName}_${myId}`
  };
  const timelineId = timelines.filter(({name}) => name === '공지사항 및 학습자료실')[0].id || '';
  const timelineApi = useCallAccessFunc(access => access && new TimelineApi(access));
  const page = Number(_page) || 1;
  const isVisitor = band_member_grade === 'visitor';

  const {is_writer, isNotice} = React.useMemo(() => {
    if (!!openStoryIndex) {
      const story = timelineList[openStoryIndex - 1] || {};
      const {user, is_notice} = story || {};
      const {is_writer} = user || {};

      return {is_writer, isNotice: is_notice};
    }

    return {};
  }, [openStoryIndex]);

  React.useEffect(() => {
    timelineApi && timelineApi.list(timelineId, {page, page_size: PAGE_SIZE})
      .then(({status, data: {count, results}}) => {
        setPending(true);
        if (status === 200) {
          setPending(false);
          setTotalCount(count);
          setTimelineList(results);
          setOpenStoryIndex(null);
        }
      });
  }, [slug, page]);

  if (pending) {
    return <Loading />;
  }

  return (
    (!isVisitor && !!totalCount) ? (
      <OnClassBoardWrapper>
        <p className="total-story">
          <span>총 {totalCount}건</span>의 글이 있습니다.
        </p>
        {!!openStoryIndex && (
          <StoryDetail
            {...timelineList[openStoryIndex - 1]}
            can_reaction={false}
            waterMarkProps={waterMarkProps}
            labelArr={timelineId}
            shareUrl={`${PROD_CLIENT_URL}/community/${timelineList[openStoryIndex - 1].id}`}
            isWriter={is_writer}
            detail
            access={access}
            storyType="community"
            isNotice={(!!isNotice && openStoryIndex < 4 && page === 1)}
          />
        )}
        <OnClassNoticeTable>
          <caption className="hidden">
            공지사항 및 학습자료실 게시판
          </caption>
          <thead>
            <tr>
              <th>NO</th>
              <th>구분</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {timelineList.map(({
              id,
              is_notice,
              category,
              user,
              title,
              created_at,
              order
            }, index) => {
              const {name} = category || {};
              const {name: userName, member_grade} = user || {};
              return (
                <tr>
                  <td className="order">
                    {(!!is_notice && index < 3 && page === 1) ? (
                      <span>
                        중요
                      </span>
                    ) : (
                      `${order}`
                    )}
                  </td>
                  <td className="subject">
                    {name !== '공지' ? ( // 학습자료실
                      <img
                        src={staticUrl('/static/images/icon/onclass-board-file.png')}
                        alt=""
                      />
                    ) : ( // 공지사항
                      `[${name}]`
                    )}
                  </td>
                  <td
                    onClick = {() => {
                      setOpenStoryIndex(index + 1);
                      window.scrollTo(0, 0);
                    }}
                    className={cn('title', {on: (index + 1) === openStoryIndex})}
                  >
                    <h3 className="ellipsis pointer">{title}</h3>
                    {moment(created_at).add(1, 'days').isAfter() && (
                      <img
                        src={staticUrl('/static/images/icon/icon-new.png')}
                        alt="new"
                      />
                    )}
                  </td>
                  <td className="author">
                    <img
                      src={staticUrl('/static/images/icon/onclass-owner.png')}
                      alt=""
                    />
                    {userName} <span>{ONCLASS_MEMBER[member_grade]}</span>
                  </td>
                  <td className="date">
                    {!!created_at && moment(created_at).format('YY.MM.DD')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </OnClassNoticeTable>
        {hasPermissionToWrite && <OnClassWriteBtn slug={slug as string} timelineId={timelineId}/>}
        <Pagination
          className="board-pagination"
          currentPage={page}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          pageGroupSize={PAGE_GROUP_SIZE}
          onClick={page => {
            Router.replace(
              {pathname: '/onclass/[slug]', query: {timeline: timelineId, page}},
              {pathname: `/onclass/${slug}`, query: {timeline: timelineId, page}},
            );
          }}
        />
      </OnClassBoardWrapper>
    ) : (
      <NoContentText>
        <p>등록 된 글이 없습니다.</p>
        {hasPermissionToWrite && <OnClassWriteBtn slug={slug as string} timelineId={timelineId}/>}
      </NoContentText>
    )
  )
};

export default React.memo(OnClassNoticeBoard);