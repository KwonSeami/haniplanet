import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin, backgroundImgMixin, heightMixin} from '../../styles/mixins.styles';
import {$WHITE, $POINT_BLUE, $GRAY, $TEXT_GRAY} from '../../styles/variables.types';
import {useDispatch} from 'react-redux';
import {dateRange, toDateFormat} from '../../src/lib/date';
import cn from 'classnames';
import Link from 'next/link';
import {toggleFollowStoryThunk} from '../../src/reducers/orm/story/thunks';
import {APPLIED_STATUS_LIST} from '../../src/constants/meetup';
import moment from 'moment';
import {numberWithCommas} from '../../src/lib/numbers';

interface ITagLiProps {
  imgSrc: string;
}

const Li = styled.li<ITagLiProps>`
  position: relative;
  margin-top: 8px;
  padding: 15px;
  background-color: ${$WHITE};

  .title {
    position: relative;
    min-height: 92px;
    box-sizing: border-box;

    .status-label {
      position: absolute;
      top: 1px;
      left: 1px;
      ${heightMixin(30)};
      padding: 0 11px;
      text-align: center;
      z-index: 1;
      background-color: ${$GRAY};
      box-sizing: border-box;
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
        color: $WHITE
      })};
    }

    .img {
      position: absolute;
      top: 0;
      left: 0;
      width: 138px;
      height: 92px;
      border: 1px solid #eee;
      box-sizing: border-box;
      ${props => backgroundImgMixin({
        img: props.imgSrc,
        position: 'center',
        size: '100% 100%'
      })}
    }

    .title-text {
      margin-left: 157px;

      h3 {
        position: relative;
        display: -webkit-box;  
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 24px;
        ${fontStyleMixin({
          size: 16,
          weight: '600'
        })};
      }

      p {
        ${fontStyleMixin({
          size: 13,
          color: '#999'
        })};
      }
    }
  }

  .contents {
    padding-top: 13px;

    > ul {
      position: relative;
      display: table;
      width: 100%;
      box-sizing: border-box;

      > li {
        position: relative;
        display: table-cell;
        vertical-align: middle;

        & ~ li:before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          width: 1px;
          height: 23px;
          transform: translateY(-50%);
          border-left: 1px solid #f4f4f4;
        }

        img {
          display: inline-block;
          vertical-align: middle;
          width: 10px;
          height: 12px;
        }

        p {
          display: inline-block;
          vertical-align: middle;
          margin-left: 5px;
          line-height: 16px;
          ${fontStyleMixin({
            size: 11,
            color: $GRAY,
            family: 'Montserrat'
          })};
        }
      }
    }

    .info {
      width: 157px;
    }

    .personnel {
      width: 118px;

      img {
        vertical-align: middle;
        width: 20px;
        height: 20px;
        margin: 0 7px 0 21px;
      }

      p {
        display: inline-block;
        vertical-align: middle;
        ${fontStyleMixin({
          size: 12,
          color: '#999',
          family: 'Montserrat'
        })};

        span {
          ${fontStyleMixin({
            size: 12,
            weight: '600',
            color: $POINT_BLUE,
            family: 'Montserrat'
          })};
        }
      }
    }
    
    .followed {
      padding-left: 18px;
      font-size: 0;

      > div {
        display: inline-block;
        width: 27px;
        height: 25px;
        
      }

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .meetup-price {
    padding-top: 15px;
    margin-top: 14px;
    border-top: 1px solid #f4f4f4;

    p {
      ${fontStyleMixin({
        size: 11,
      })};

      .discount-rate {
        margin-right: 6px;
        ${fontStyleMixin({
          size: 16,
          weight: '600',
          family: 'Montserrat',
          color: '#f32b43'
        })};
      }
  
      > b {
        ${fontStyleMixin({
          size: 16,
          weight: '600',
          family: 'Montserrat',
        })};
      }

      .fixed-price {
        margin-left: 6px;
        ${fontStyleMixin({
          size: 11,
          color: $TEXT_GRAY
        })};

        b {
          text-decoration: line-through;
          ${fontStyleMixin({
            size: 12,
            weight: '600',
            family: 'Montserrat',
            color: $TEXT_GRAY
          })};
        }
      }
    }
  }

  div.tag {
    padding: 8px 13px 11px;
  }
`;

const Meetup2 = React.memo(({
  id,
  title,
  user,
  is_follow,
  extension,
  className
}) => {
  const {
    avatar,
    status,
    progress_range: [progress_start_at, progress_end_at] = [],
    receipt_range: [receipt_start_at, receipt_end_at] = [],
    is_online_meetup = false,
    course_period = 0,
    region,
    participate_count,
    capacity,
    products,
  } = extension || {} as any;

  const {price, sale_price, sale_start_at, sale_end_at} = (products || [])[0] || {};
  const isInSale = !!sale_start_at && moment().isBetween(sale_start_at, sale_end_at, null, '[]');
  const salePercent = sale_price && ((price - sale_price) / price) * 100;

  const {
    name,
  } = user || {} as any;

  // Router
  const dispatch = useDispatch();

  return (
    <Li
      imgSrc={avatar}
      className={className}
    >
      <Link
        href="/story/id"
        as={`/story/${id}`}
      >
        <a>
          <div className="title">
            <span 
              className="status-label" 
              style={{backgroundColor: APPLIED_STATUS_LIST[status]?.color}}
            >
              {APPLIED_STATUS_LIST[status]?.status}
            </span>
            <div className="img">
            </div>
            <div className="title-text">
              <h3>{title}</h3>
              <p>{name}</p>
            </div>
          </div>
          <div className="contents">
            <ul>
              <li className="info">
                <ul>
                  <li>
                    <img
                      src={staticUrl('/static/images/icon/icon-meetup-place.png')}
                      alt="장소"
                    />
                    <p>{region ? region.name : "온라인"}</p>                
                  </li>
                  <li>
                    <img
                      src={staticUrl('/static/images/icon/calender-date.png')}
                      alt="날짜"
                    />
                    <p>
                      {dateRange(receipt_start_at, receipt_end_at, 'YYYY.MM.DD')}
                    </p>
                  </li>
                  <li>
                    <img
                      src={staticUrl('/static/images/icon/icon-meetup-time.png')}
                      alt="시간"
                    />
                    <p>
                      {is_online_meetup
                        ? `${course_period}일`
                        : `${toDateFormat(progress_start_at, 'HH:mm')} ~ ${toDateFormat(progress_end_at, 'HH:mm')}`
                      }
                    </p>
                  </li>
                </ul>
              </li>
              <li className="personnel">
                <img
                  src={staticUrl('/static/images/icon/icon-meetup-personnel.png')}
                  alt="인원수"
                />
                <p>
                  <span>{participate_count}</span>
                  /{capacity}
                </p>
              </li>
              <li className={cn("followed", {on: is_follow})}>
                <div 
                  onClick={e => {
                    e.preventDefault();
                    dispatch(toggleFollowStoryThunk(id));
                  }}>
                  {is_follow ? (
                    <img
                      src={staticUrl('/static/images/icon/icon-heart-on.png')}
                      alt="heart"
                    />
                  ): (
                    <img
                      src={staticUrl('/static/images/icon/icon-heart-off.png')}
                      alt="heart"
                    />
                  )}
                </div>
              </li>
            </ul>
          </div>
          <div className="meetup-price">
            <p>
              {!!price ? (
                isInSale ? ( //할인율 있을 시
                  <>
                    <span className="discount-rate">{salePercent.toFixed(0)}%</span>
                    <b>{numberWithCommas(sale_price)}</b>원
                    <span className="fixed-price">
                      <b>{numberWithCommas(price)}</b>원
                    </span>
                  </>
                ) : <><b>{numberWithCommas(price)}</b>원</>
              ) : <b>무료</b>}
            </p>
          </div>
        </a>
      </Link>
    </Li>
  )
});

Meetup2.displayName = 'Meetup2';
export default Meetup2;
