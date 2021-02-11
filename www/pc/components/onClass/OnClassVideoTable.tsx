import cn from 'classnames';
import Button from '../inputs/Button/ButtonDynamic';
import {$BORDER_COLOR, $WHITE} from '../../styles/variables.types';
import * as React from 'react';
import styled from 'styled-components';
import {fontStyleMixin, radiusMixin} from '../../styles/mixins.styles';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import Router, {useRouter} from 'next/router';
import Pagination from '../UI/Pagination';
import Loading from '../common/Loading';
import {toHHMMSS} from '../../src/lib/date';
import {ADMIN_PERMISSION_GRADE} from '../../src/constants/band';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '../../src/reducers';
import {pickBandSelector} from '../../src/reducers/orm/band/selector';
import OnClassApi from '../../src/apis/OnClassApi';
import {staticUrl} from '../../src/constants/env';

const VideoTable = styled.table`
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

    &:nth-child(n+3) {
      width: 70px;
    }

    &:last-child {
      width: 87px;
    }

    &.time {
      font-family: Montserrat;
    }
  }

  td {
    padding: 15px 0;
    text-align: center;
    ${fontStyleMixin({
      size: 14,
      family: 'Montserrat',
    })};

    &.order {
      ${fontStyleMixin({
        size: 13,
        color: '#999',
      })};
    }

    &.title {
      position: relative;
      padding: 15px 20px 15px 2px;
      text-align: left;

      p {
        display: inline-block;
        ${fontStyleMixin({
          size: 15,
          weight: '600',
          family: 'Noto sans KR',
        })};
      }

      img {
        width: 18px;
        vertical-align: top;
        margin: 3px 0 0 2px;
      }

      &.over-info {
        p:hover {
          text-decoration: underline;

          + span {
            z-index: 1;
            opacity: 1;
          }
        }

        span {
          display: block;
          position: absolute;
          bottom: -82px;
          left: -12px;
          width: 395px;
          height: 88px;
          padding: 13px;
          line-height: 1.54;
          ${radiusMixin('8px', '#eee')};
          background-color: ${$WHITE};
          box-shadow: 1px 2px 6px 0 rgba(0, 0, 0, 0.2);
          opacity: 0;
          ${fontStyleMixin({
            size: 13,
          })};
        }
      }
    }
  }
`;

const StyledPagination = styled(Pagination)`
  margin-top: 40px;
`;

const PAGE_SIZE = 20;
const PAGE_GROUP_SIZE = 10;

interface Props {
  isActive?: boolean;
}

const OnClassVideoTable: React.FC<Props> = ({
  isActive
}) => {
  const {query: {slug, page: _page}} = useRouter();
  const [pending, setPending] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);
  const [onclassList, setOnclassList] = React.useState([]);

  const {extension, band_member_grade} = useSelector(
    ({orm}: RootState) => ((pickBandSelector(slug)(orm) || {})),
    shallowEqual,
  );

  const isButtonOn = isActive || ADMIN_PERMISSION_GRADE.includes(band_member_grade);
  const {total_contents_length} = extension || {};
  const onClassApi = useCallAccessFunc(access => access && new OnClassApi(access));
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
    <div>
      <VideoTable>
        <caption className="hidden">온라인 강의 동영상 목록</caption>
        <thead>
          <tr>
            <th>순서</th>
            <th>모든 동영상</th>
            {!isVisitor && <th>진도율</th>}
            <th className="time">{!!total_contents_length && toHHMMSS(total_contents_length)}</th>
            {!isVisitor && (
              <th>{ADMIN_PERMISSION_GRADE.includes(band_member_grade) ? '영상시청' : '학습하기'}</th>
            )}
          </tr>
        </thead>
        <tbody>
        {(onclassList || []).map(({
          body,
          content: {
            title,
            order,
            media_content_key,
            length,
            progress_rate
          }
        }) => (
          <tr>
            <td className="order">{order + 1}</td>
            <td className={cn('title', {'over-info': !!body})}>
              <p
                className="pointer"
                onClick={() => {
                  if (isButtonOn) {
                    window.open(`/onclass/${slug}/lecture/${media_content_key}`, '_blank');
                  } else {
                    alert('학습 기간이 종료되었습니다.');
                  }
                }}
              >
                {title}
                {!!body && (
                  <img
                    src={staticUrl('/static/images/icon/info-mark.png')}
                    alt=""
                  />
                )}
              </p>
              {!!body && (
                <span className="pre-wrap">
                  {body}
                </span>
              )}
            </td>
            {!isVisitor && (
              <td className={cn('complete', {active: isButtonOn})}>
                {progress_rate.toFixed(0)}%
              </td>
            )}
            <td>{toHHMMSS(length)}</td>
            {(band_member_grade !== 'visitor') && (
              <td>
                <Button
                  border={{width: '0', radius: '6px'}}
                  size={{width: '56px', height: '20px'}}
                  font={{size: '11px', weight: '600', color: $WHITE}}
                  backgroundColor={isButtonOn ? "#499aff" : $BORDER_COLOR}
                  onClick={() => {
                    if (isButtonOn) {
                      window.open(`/onclass/${slug}/lecture/${media_content_key}`, '_blank');
                    } else {
                      alert('학습 기간이 종료되었습니다.');
                    }
                  }}
                >
                  {ADMIN_PERMISSION_GRADE.includes(band_member_grade) ? '영상시청' : '학습시작'}
                </Button>
              </td>
            )}
          </tr>
        ))}
        </tbody>
      </VideoTable>
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
    </div>
  )
};

export default React.memo(OnClassVideoTable);