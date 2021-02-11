import * as React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import Link from 'next/link';
import {pushPopup} from '../../src/reducers/popup';
import OnComingPopup from '../layout/popup/OnComingPopup';
import {numberWithCommas} from '../../src/lib/numbers';
import {backgroundImgMixin, fontStyleMixin, heightMixin, lineEllipsisMixin} from '../../styles/mixins.styles';
import {$GRAY, $WHITE, $BORDER_COLOR, $TEXT_GRAY} from '../../styles/variables.types';
import {APPLIED_STATUS_LIST, USER_TYPE_COLOR} from '../../src/constants/meetup';
import Avatar from '../Avatar';
import Tag from '../UI/tag/Tag';
import Button from '../inputs/Button';
import isEmpty from 'lodash/isEmpty';
import {toDateFormat} from '../../src/lib/date';
import Router from 'next/router';

const Li = styled.li`
  width: 100%;
  height: 209px;
  margin-bottom: 20px;
  box-sizing: border-box;

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

  > div, > a div {
    display: inline-block;
    height: 100%;
    vertical-align: middle;
    box-sizing: border-box;
  }

  .onclass-collect-introduce {
    width: 503px;
    padding: 25px 25px 28px;
    border-top: 1px solid ${$BORDER_COLOR};
    border-bottom: 1px solid ${$BORDER_COLOR};

    h2 {
      margin-bottom: 8px;
      ${fontStyleMixin({
        size: 18,
        weight: '600'
      })};
    }

    > p {
      ${lineEllipsisMixin(14, 20, 3)};
      ${fontStyleMixin({
        color: $GRAY
      })};
    }

    > div {
      margin-top: 13px;

      span {
        position: relative;
        padding-right: 8px;
        margin-right: 6px;
        ${fontStyleMixin({
          size: 13,
          color: '#999'
        })};
  
        &::after {
          content: '';
          position: absolute;
          top: 5px;
          right: 0;
          width: 1px;
          height: 12px;
          background-color: #eee;
        }
      }
    }

    .onclass-admin {
      display: inline-block;

      div {
        margin-right: 3px;
      }
    }

    .tags {
      margin-top: 9px;

      li {
        display: inline-block;
        margin-right: 10px;
        background-color: #f4f4f4;

        p {
          margin: 0;
          padding: 0;
          ${fontStyleMixin({
            size: 14,
            color: $TEXT_GRAY
          })};
        }
      }
    }
  }

  .onclass-collect-info {
    position: relative;
    width: 273px;
    background-color: #f9f9f9;
    border: 1px solid ${$BORDER_COLOR};
    border-left: 0;

    ul {
      padding: 22px 0 11px;
      margin: 0 23px;
      border-bottom: 1px solid ${$BORDER_COLOR};

      li {
        display: flex;
        justify-content: space-between;

        & ~ li {
          margin-top: 4px;
        }

        > span {
          padding-top: 2px;
          ${fontStyleMixin({
            size: 12,
            weight: '300',
            color: $GRAY
          })};
        }

        p {
          word-break: keep-all;
          ${fontStyleMixin({
            size: 14,
            color: $GRAY,
          })};

          b {
            font-weight: 600;

            ~ b {
              position: relative;
              padding-left: 8px;
              margin-left: 7px;

              &::before {
                content: '';
                position: absolute;
                top: 6px;
                left: 0;
                width: 1px;
                height: 10px;
                background-color: ${$BORDER_COLOR};
              }
            }
          }

          span {
            ${fontStyleMixin({
              size: 14,
              weight: '600',
              family: 'Montserrat',
            })};

            &.duration {
              position: relative;
              padding-left: 8px;
              margin-left: 7px;

              &::before {
                content: '';
                position: absolute;
                top: 6px;
                left: 0;
                width: 1px;
                height: 10px;
                background-color: ${$BORDER_COLOR};
              }
            }
          }
        }
      }
    }

    .onclass-price {
      padding: 11px 23px 0;
      display: flex;
      justify-content: space-between;

      > span {
        padding-top: 2px;
        ${fontStyleMixin({
          size: 12,
          weight: '300',
          color: $GRAY
        })};
      }

      p {
        text-align: right;
        ${fontStyleMixin({
          size: 14,
          color: $GRAY,
        })};

        .discount-rate {
          margin-right: 6px;
          ${fontStyleMixin({
            size: 14,
            weight: '600',
            family: 'Montserrat',
            color: '#f32b43'
          })};
        }
    
        > b {
          ${fontStyleMixin({
            size: 14,
            weight: '600',
            family: 'Montserrat',
          })};
        }

        .fixed-price {
          margin-left: 6px;
          ${fontStyleMixin({
            size: 12,
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

        .price-free {
          ${fontStyleMixin({
            size: 14,
            weight: '600',
            color: '#f32b43',
          })};
        }
      }
    }

    .button {
      position: absolute;
      bottom: 0;
      left: 0;
      transition: 0.2s;

      &:hover {
        color: ${$WHITE};
        background-color: #499aff;
        box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.2);
      }
    }

    .onclass-coming-soon {
      ${heightMixin(207)};
      text-align: center;
      ${fontStyleMixin({
        size: 14,
        weight: '600',
        color: '#999',
      })};
    }
  }
`;

const OnClassThumbImg = styled.div<{img: string;}>`
  position: relative;
  width: 314px;
  border: 1px solid ${$BORDER_COLOR};
  border-right: 0;
  ${({img}) => backgroundImgMixin({
    img: img
  })};
`;


interface IOnClassStoryProps {
  id: string;
  title: string;
  user: IUser;
  avatar: string[];
  user_types: TUserType[];
  meetup_status: string;
  receipt_range: string[];
  tags: ITag[];
}

interface IMeetUpProductsProps {
  id: string;
  name: string;
  text: string;
  price?: number;
  sale_price?: number;
  sale_start_at?: string;
  sale_end_at?: string;
  user_types: TUserType[];
  band_slug: string;
}

interface Props {
  slug: string;
  story: IOnClassStoryProps;
  contents_length: number;
  course_period: number;
  introduction?: string;
  products: IMeetUpProductsProps;
  thumbnail: string;
  oncoming_month: number;
}

const OnClassGatheringItem: React.FC<Props> = ({
  slug,
  introduction,
  story,
  contents_length,
  course_period,
  products = [],
  thumbnail,
  oncoming_month,
}) => {
  const {
    id,
    title,
    user,
    avatar = [],
    user_types = [],
    meetup_status,
    receipt_range = [],
    tags = []
  } = story || {};

  const {
    sale_price,
    sale_start_at,
    sale_end_at,
    price
  } = products[0] || {};

  const {id: userId, name: userName, avatar: userAvatar} = user || {};
  const isInSale = (!!sale_price && !!sale_start_at) && moment().isBetween(sale_start_at, sale_end_at, null, '[]');
  const salePercent = isInSale && ((price - sale_price) / price) * 100;
  const {color: statusColor, status: onclassStatus} = APPLIED_STATUS_LIST[meetup_status] || {};
  const isOpen = (meetup_status !== 'tobe');
  const timeHour = Math.floor(contents_length / 3600);
  const timeMinute = Math.floor((contents_length / 60) - (timeHour * 60));

  const userTypeMap = React.useMemo(() => (
    user_types.map((user_type) =>
      <b style={{color: USER_TYPE_COLOR[user_type].color}}>
        {USER_TYPE_COLOR[user_type].value}
      </b>
    )
  ), [user_types]);

  const dispatch = useDispatch();

  return (
    <Li>
      <Link
        href={'/story/[id]'}
        as={`/story/${id}`}
      >
        <a onClick={e => {
          if (!isOpen) {
            e.preventDefault();
            dispatch(pushPopup(OnComingPopup, {oncoming_month}));
          }
        }}>
          <OnClassThumbImg img={avatar[0]}>
            <span
              className="status-label"
              style={{backgroundColor: statusColor}}
            >
              {onclassStatus}
            </span>
          </OnClassThumbImg>
        </a>
      </Link>
      <div className="onclass-collect-introduce">
        <Link
          href={'/story/[id]'}
          as={`/story/${id}`}
        >
          <a onClick={e => {
            if (!isOpen) {
              e.preventDefault();
              dispatch(pushPopup(OnComingPopup, {oncoming_month}));
            }
          }}>
            <h2 className="ellipsis">{title}</h2>
          </a>
        </Link>
        <p className="pre-wrap">
          {introduction}
        </p>
        <div>
          <span>강사</span>
          <Avatar
            className="onclass-admin"
            id={userId}
            userExposeType="real"
            src={userAvatar}
            name={userName}
            size={25}
          />
        </div>
        <ul className="tags">
          {tags.map(({id, name, is_follow}) => (
            <li>
              <Tag
                id={id}
                name={name}
                highlighted={is_follow}
                onClick={() => Router.push(`/tag/${id}`)}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="onclass-collect-info">
        {isOpen ? ( // 오픈한 강의일 때
          <>
            <ul>
              {!isEmpty(user_types) && (
                <li>
                  <span>강의대상</span>
                  <p>
                    {userTypeMap}
                  </p>
                </li>
              )}
              <li>
                <span>강의시간/기간</span>
                <p>
                  {!!timeHour && <><span>{timeHour}</span>시간&nbsp;</>}
                  <span>{timeMinute}</span>분
                  <span className="duration">{course_period}</span>일
                </p>
              </li>
              <li>
                <span>마감기한</span>
                <p>
                  <span>{toDateFormat(receipt_range[1], 'YYYY.MM.DD')}</span>까지
                </p>
              </li>
            </ul>
            <div className="onclass-price">
              <span>수강료</span>
              <p>
                {!!price
                  ? (
                    <>
                      {isInSale && <span className="discount-rate">{salePercent.toFixed(0)}%</span>}
                      <b>{numberWithCommas(isInSale ? sale_price : price)}</b>&nbsp;원<br/>
                      {isInSale && (
                        <span className="fixed-price">
                          <b>{numberWithCommas(price)}</b>&nbsp;원
                        </span>
                      )}
                    </>
                  ) : <span className="price-free">무료</span>
                }
              </p>
            </div>
            <Button
              size={{
                width: '100%',
                height: '39px'
              }}
              border={{
                radius: '0'
              }}
              font={{
                size: '14px',
                weight: '600',
                color: $GRAY
              }}
              backgroundColor="#eee"
              onClick={() => {
                isOpen
                  ? Router.push('/story/[id]', `/story/${id}`)
                  : dispatch(pushPopup(OnComingPopup, {oncoming_month}))
              }}
            >
              상세보기
            </Button>
          </>
        ) : ( // 오픈 예정인 강의일 때
          <p className="onclass-coming-soon">
            오픈 예정 강의입니다
          </p>
        )}
      </div>
    </Li>
  );
};

export default React.memo(OnClassGatheringItem);
