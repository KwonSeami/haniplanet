import * as React from 'react';
import styled, {keyframes} from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin, backgroundImgMixin, heightMixin} from '../../styles/mixins.styles';
import {$WHITE, $POINT_BLUE, $GRAY, $TEXT_GRAY} from '../../styles/variables.types';
import {dateRange, toDateFormat} from '../../src/lib/date';
import {useRouter} from 'next/router';
import cn from 'classnames';
import Link from 'next/link';
import {useDispatch} from 'react-redux';
import {toggleFollowStoryThunk} from '../../src/reducers/orm/story/thunks';
import {APPLIED_STATUS_LIST} from '../../src/constants/meetup';
import moment from 'moment';
import {numberWithCommas} from '../../src/lib/numbers';

const scale = keyframes`
  from {
    transform: scale(1.15);
  }

  to {
    transform: scale(1);
  }
`;

interface ITagLiProps {
  imgSrc: string;
}

export interface IMeetup {
  id: HashId;
  title: string;
  user: IUser;
  is_follow: boolean;
  extension: IExtension;
  tags: ITag[];
  className?: string;
}

interface IExtension {
  status: string;
  capacity: number;
  avatar: string;
  region: IRegion;
}

interface IUser {
  name: string;
}

interface ITag {
  id: HashId;
  name: string;
  avatar: string;
  is_follow: boolean;
}

interface IRegion {
  name: string;
}

const Li = styled.li<ITagLiProps>`
  position: relative;
  display: inline-block;
  vertical-align: top;
  width: 254px;
  margin: 25px 0 0 25px;

  &:hover {
    .followed img{
      transform: translateY(0);
      opacity: 1;
    }

    .title {
      .img {
        transform: scale(1.08);
        transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
      }
    }
  }

  .status-label {
    position: absolute;
    top: 0;
    left: 0;
    ${heightMixin(30)};
    padding: 0 11px;
    text-align: center;
    z-index: 1;
    background-color: #999;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 12,
      weight: 'bold',
      color: $WHITE
    })};
  }

  .followed {
    position: absolute;
    top: 128px;
    right: 16px;
    width: 27px;
    height: 25px;
    cursor: pointer;
    z-index: 1;
    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);

    img {
      width: 100%;
      height: 100%;
      opacity: 0;
      transform: translateY(5px);
      transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    }

    &.on {
      animation: 0.5s ${scale} cubic-bezier(0.25, 0.1, 0.25, 1);
    }
  }

  .title {
    position: relative;
    width: 254px;
    height: 169px;
    overflow: hidden;
    box-sizing: border-box;

    .img {
      width: 100%;
      height: 100%;
      transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
      ${props => backgroundImgMixin({
        img: props.imgSrc,
        position: 'center',
        size: '100% 100%'
      })};
    }
  }

  .contents {
    border: 1px solid #eee;
    border-top: 0;
    box-sizing: border-box;

    .title-text {
      padding: 12px 13px 11px;
      border-bottom: 1px solid #f4f4f4;
      box-sizing: border-box;

      h3 {
        ${fontStyleMixin({
          size: 15,
          weight: '600',
        })};
      }

      p {
        padding-top: 4px;
        ${fontStyleMixin({
          size: 13,
          color: $GRAY,
        })};
      }
    }

    > ul {
      position: relative;
      display: table;
      width: 100%;
      padding-left: 13px;
      box-sizing: border-box;
      border-bottom: 1px solid #f4f4f4;

      > li {
        vertical-align: middle;
        display: table-cell;
      }

      ul {
        padding: 8px 0;

        li {
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
    }

    .personnel {
      position: relative;
      text-align: center;
      width: 80px;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 1px;
        height: 53px;
        transform: translateY(-50%);
        border-left: 1px solid #f4f4f4;
      }

      img {
        display: block;
        margin: 0 auto 5px;
        width: 19px;
        height: 20px;
      }

      p {
        margin-bottom: 3px;
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

    .meetup-price {
      padding: 10px 13px;
      border-bottom: 1px solid #f4f4f4;

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
  }
`;



const Meetup2: React.FC<IMeetup> = React.memo(
  ({
    id,
    title,
    user,
    is_follow,
    extension,
    tags,
    className,
  }) => {
    const {
      avatar,
      status,
      progress_range: [progress_start_at, progress_end_at] = [],
      receipt_range: [receipt_start_at, receipt_end_at] = [],
      region,
      participate_count,
      is_online_meetup = false,
      course_period,
      capacity,
      products,
    } = extension || {} as IExtension;

    const {price, sale_price, sale_start_at, sale_end_at} = (products || [])[0] || {};

    const isInSale = !!sale_start_at && moment().isBetween(sale_start_at, sale_end_at, null, '[]');
    const salePercent = sale_price && ((price - sale_price) / price) * 100;

    const {
      name,
    } = user || {} as IUser;

    // Router
    const router = useRouter();
    const dispatch = useDispatch();

  return (
    <Li
      imgSrc={avatar}
      className={className}
    >
      <Link
        href="/story/id"
        as={`story/${id}`}
      >
        <a>
          <span 
            className="status-label" 
            style={{backgroundColor: APPLIED_STATUS_LIST[status]?.color}}
          >
            {APPLIED_STATUS_LIST[status]?.status}
          </span>
          <div 
            className={cn("followed", {on: is_follow})}
            onClick={e => {
              e.preventDefault();
              dispatch(toggleFollowStoryThunk(id));
            }}
          >
            {is_follow ? (
              <img
              src={staticUrl(`/static/images/icon/icon-heart-on.png`)}
              alt="heart"
            />
            ) : (
              <img
              src={staticUrl(`/static/images/icon/icon-heart-off.png`)}
              alt="heart"
            />
            )} 
          </div>
          <div className="title">
            <div className="img"></div>
          </div>
          <div className="contents">
            <div className="title-text">
              <h3 className="ellipsis">{title}</h3>
              <p>{name}</p>
            </div>
            <ul>
              <li>
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
                        ? `${course_period || 0}일`
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
            </ul>
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
          </div>
        </a>
      </Link>
    </Li>
  )
});

Meetup2.displayName = 'Meetup2';
export default Meetup2;
