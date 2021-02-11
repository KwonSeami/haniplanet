import * as React from 'react';
import Router, {useRouter} from "next/router";
import {useSelector, shallowEqual} from "react-redux";
import {RootState} from "../../../src/reducers";
import {pickBandSelector} from '../../../src/reducers/orm/band/selector';
import {pickUserSelector} from "../../../src/reducers/orm/user/selector";
import useCallAccessFunc from "../../../src/hooks/session/useCallAccessFunc";
import TimelineApi from '../../../src/apis/TimelineApi';
import {waterMarkOptions} from '../../story/story.config';
import Loading from '../../common/Loading';
import {staticUrl} from "../../../src/constants/env";
import Avatar from "../../Avatar";
import {ONCLASS_MEMBER} from "../../../src/constants/meetup";
import moment from 'moment';
import styled from "styled-components";
import {fontStyleMixin} from "../../../styles/mixins.styles";
import {$GRAY, $TEXT_GRAY} from "../../../styles/variables.types";
import {BoardSection} from "../../../pages/onclass/[slug]";
import NoContentText from '../../NoContent/NoContentText';
import Pagination from '../../UI/Pagination';
import Link from 'next/link';

const OnClassNoticeLi = styled.li`
  display: flex;
  border-bottom: 1px solid #eee;

  div:first-of-type {
    flex: 0 0 38px;
    text-align: center;
    background-color: #fbfbfb;

    > p {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      ${fontStyleMixin({
        size: 12,
        weight: '600',
        color: '#f32b43',
      })};
    }

    > span {
      display: block;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
      ${fontStyleMixin({
        size: 13,
        color: '#999',
        family: 'Montserrat'
      })};
    }
  }

  div:last-of-type {
    flex: 1 1 auto;
    padding: 15px;

    h3 {
      margin-bottom: 6px;
      line-height: 1.64;
      ${fontStyleMixin({
        size: 15,
        weight: '600'
      })};

      img:not(.new-story) {
        width: 20px;
        margin-right: 2px;
        vertical-align: text-top;
      }

      span {
        margin-right: 3px;
        vertical-align: text-bottom;
        ${fontStyleMixin({
          size: 12,
          color: '#999',
        })};
      }

      .new-story {
        width: 4px;
        margin: 8px 0 0 3px;
        vertical-align: top;
      }
    }

    > img {
      width: 18px;
      margin-right: 2px;
      vertical-align: middle;
    }

    .avatar {
      display: inline-block;
      vertical-align: middle;
      font-size: 12px;
    }

    > span {
      margin-left: 4px;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 12,
        color: $GRAY,
      })};
    }

    > p {
      display: inline-block;
      margin-left: 5px;
      vertical-align: middle;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY,
      })};
    }
  }
`;

const PAGE_SIZE = 6;
const PAGE_GROUP_SIZE = 5;

const MAX_TITLE_LENGTH = 38;

const OnClassNoticeBoard = () => {
  const {query: {slug, page: _page}} = useRouter();
  const [pending, setPending] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [timelineList, setTimelineList] = React.useState([]);

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

  React.useEffect(() => {
    timelineApi && timelineApi.list(timelineId, {page, page_size: PAGE_SIZE})
      .then(({status, data: {count, results}}) => {
        setPending(true);
        if (status === 200) {
          setPending(false);
          setTotalCount(count);
          setTimelineList(results);
        }
      });
  }, [slug, page]);

  if (pending) {
    return <Loading />;
  }

  return (
    <BoardSection>
      <div>
        {(!isVisitor && !!totalCount) ? (
          <>
            <p className="total-story">
              <span>총 {totalCount}건</span>의&nbsp;글이 있습니다.
            </p>
            <ul>
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
                  <OnClassNoticeLi>
                    <div>
                      {(!!is_notice && index < 3 && page === 1) ? (
                        <p>
                          중요
                        </p>
                      ) : (
                        <span>{order}</span>
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/onclass/[slug]/timeline/[id]?timeline=${timelineId}`}
                        as={`/onclass/${slug}/timeline/${id}?timeline=${timelineId}`}
                      >
                        <a>
                          <h3>
                            {name !== '공지' ? ( // 학습자료실
                              <img
                                src={staticUrl('/static/images/icon/onclass-board-file.png')}
                                alt=""
                              />
                            ) : ( // 공지사항
                              <span>[{name}]</span>
                            )}
                            {title.length <= MAX_TITLE_LENGTH
                              ? title
                              : `${title.substr(0, MAX_TITLE_LENGTH)}...`}
                            {moment(created_at).add(1, 'days').isAfter() && (
                              <img
                                className="new-story"
                                src={staticUrl('/static/images/icon/new-story-dot-blue.png')}
                                alt="새 글"
                              />
                            )}
                          </h3>
                        </a>
                      </Link>
                      <img
                        src={staticUrl('/static/images/icon/onclass-owner.png')}
                        alt=""
                      />
                      <Avatar
                        name={userName}
                        userExposeType="real"
                        {...user}
                        hideImage
                      />
                      <span>{ONCLASS_MEMBER[member_grade]}</span>
                      <p>
                        {!!created_at && moment(created_at).format('YY.MM.DD')}
                      </p>
                    </div>
                  </OnClassNoticeLi>
                )
              })}
            </ul>
            <Pagination
              className="notice-pagination"
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
          </>
        ) : (
          <NoContentText>
            <p>
              {!!isVisitor
                ? '권한이 없습니다.'
                : '등록 된 글이 없습니다.'
              }
            </p>
          </NoContentText>
        )}
      </div>
    </BoardSection>
  )
};

export default React.memo(OnClassNoticeBoard);