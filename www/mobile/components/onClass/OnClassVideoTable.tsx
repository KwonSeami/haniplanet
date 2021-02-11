import * as React from 'react';
import Button from '../inputs/Button/ButtonDynamic';
import {staticUrl} from '../../src/constants/env';
import Pagination from '../UI/Pagination';
import Router, {useRouter} from 'next/router';
import styled from 'styled-components';
import {fontStyleMixin, maxLineEllipsisMixin} from '../../styles/mixins.styles';
import {$TEXT_GRAY, $POINT_BLUE, $WHITE} from '../../styles/variables.types';
import useCallAccessFunc from "../../src/hooks/session/useCallAccessFunc";
import Loading from "../common/Loading";
import cn from 'classnames';
import {toFormatSec} from '../../src/lib/date';
import {ADMIN_PERMISSION_GRADE} from '../../src/constants/band';
import OnClassApi from '../../src/apis/OnClassApi';

const PAGE_SIZE = 20;
const PAGE_GROUP_SIZE = 5;

const VideoList = styled.ul`
  li {
    position: relative;
    display: table;
    width: 100%;
    padding: 15px 0 15px 35px;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;

    &.on {
      background-color: #f9f9f9;

      .video-info-wrapper h3 {
        color: ${$POINT_BLUE};
        text-decoration: underline;
      }
    }

    span {
      position: absolute;
      top: 18px;
      left: 18px;
      ${fontStyleMixin({
        size: 13,
        family: 'Montserrat',
        color: '#999',
      })};
    }

    > div {
      display: table-cell;
      vertical-align: middle;
      box-sizing: border-box;

      &.video-info-wrapper {
        padding-right: 19px;

        h3 {
          display: inline;
          line-height: 1.38;
          ${fontStyleMixin({
            size: 15,
            weight: '600',
          })};
        }
        
        button {
          width: 18px;
          margin-left: 4px;
          vertical-align: middle;
        }
    
        p {
          margin-top: 7px;
          ${fontStyleMixin({
            size: 12,
            color: $TEXT_GRAY
          })};
        }
      }

      &.play-btn-wrapper {
        width: 72px;
        height: 41px;
        border-left: 1px solid #eee;
        line-height: 1;
        text-align: center;
      }
    }

    .over-info {
      display: flex;
      position: absolute;
      z-index: -1;
      bottom: -64px;
      left: 16px;
      width: calc(100% - 30px);
      max-width: 331px;
      min-height: 100px;
      box-sizing: border-box;
      border-radius: 4px;
      background-color: ${$WHITE};
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.21);
      opacity: 0;
      

      &.on {
        z-index: 1;
        opacity: 1;
      }
      
      p {
        flex: 1 1 auto;
        padding: 14px;
        white-space: pre-wrap;
        ${fontStyleMixin({
          size: 12,
        })};
      }

      .button {
        flex: 0 0 38px;

        img {
          width: 25px;
        }
      }
    }
  }
`;

const StyledPagination = styled(Pagination)`
  .pagination {
    margin: 0 auto;
  }
`;

const MAX_TITLE_LENGTH = 25;

interface Props {
  band_member_grade: string;
  isActive: boolean;
  video?: any;
}

const OnClassVideoTable: React.FC<Props> = ({band_member_grade, isActive, video}) => {
  const router = useRouter();
  const {query: {slug, page: _page}} = router;
  const [pending, setPending] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [onclassList, setOnclassList] = React.useState([]);
  const [openIntro, setOpenIntro] = React.useState(-1);

  const isButtonOn = isActive || ADMIN_PERMISSION_GRADE.includes(band_member_grade);
  const onClassApi: OnClassApi = useCallAccessFunc(access => access && new OnClassApi(access));
  const page = Number(_page) || 1;
  const isVisitor = band_member_grade === 'visitor';

  React.useEffect(() => {
    onClassApi && onClassApi.onclassList(slug as string, {offset: (page - 1) * PAGE_SIZE})
      .then(({status, data: {count, results}}) => {
        if (status === 200) {
          setPending(false);
          setTotalCount(count);
          setOnclassList(results);
        }
      });
  }, [slug, page]);

  if (pending) {
    return <Loading />;
  }

  return (
    <>
      <VideoList>
        {onclassList.map(({
          body,
          content: {
            order,
            title,
            length,
            media_content_key,
            retrieve_count,
            progress_rate
          }
        }) => (
          <li className={cn({on: video === media_content_key})}>
            <span>{order + 1}</span>
            <div className="video-info-wrapper">
              <div onClick={() => setOpenIntro(order)}>
                <h3>
                  {title.length <= MAX_TITLE_LENGTH
                    ? title
                    : `${title.substr(0, MAX_TITLE_LENGTH)}...`}
                </h3>
                {!!body && (
                  <button
                    type="button"
                  >
                    <img
                      src={staticUrl('/static/images/icon/info-mark.png')}
                      alt=""
                    />
                  </button>
                )}
              </div>
              <p>
                {toFormatSec(length * progress_rate / 100)} {(!isVisitor && isButtonOn) && '수강중'}/
                {(length/60).toFixed(0)}분&nbsp;·&nbsp;조회&nbsp;{retrieve_count || 0}
              </p>
            </div>
            {!!body && (
              <div
                className={cn('over-info', {on: openIntro === order})}
              >
                <p>
                  {body}
                </p>
                <Button
                  border={{
                    radius: '0'
                  }}
                  backgroundColor="#f8f8f8"
                  onClick={() => setOpenIntro(-1)}
                >
                  <img
                    src={staticUrl('/static/images/icon/icon-close.png')}
                    alt="닫기"
                  />
                </Button>
              </div>
            )}
            <div className="play-btn-wrapper">
              <Button
                className={cn({'off': isVisitor})}
                size={{width: '35px', height: '35px'}}
                border={{radius: '50%'}}
                onClick={() => {
                  if (isVisitor) {
                    alert('강의를 결제해 주세요.');
                  } else if (isButtonOn) {
                    Router.push('/onclass/[slug]/[id]', `/onclass/${slug}/${media_content_key}`);
                  } else {
                    alert('학습 기간이 종료되었습니다.');
                  }
                }}
              >
                <img
                  src={(isVisitor || !isButtonOn)
                    ? staticUrl('/static/images/icon/arrow/arrow-gray-white_bg.png')
                    : staticUrl('/static/images/icon/arrow/arrow-blue-white_bg.png')}
                  alt=""
                />
              </Button>
            </div>
          </li>
        ))}
      </VideoList>
      <StyledPagination
        currentPage={Number(page) || 1}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        pageGroupSize={PAGE_GROUP_SIZE}
        onClick={page => {
          Router.replace(
            {pathname: '/onclass/[slug]', query: {page}},
            {pathname: `/onclass/${slug}`, query: {page}},
          );
        }}
      />
    </>
  )
};

export default React.memo(OnClassVideoTable);