import * as React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import Link from 'next/link';
import {fontStyleMixin, heightMixin, backgroundImgMixin, maxLineEllipsisMixin} from '../../../../styles/mixins.styles';
import {$WHITE, $BORDER_COLOR, $GRAY, $TEXT_GRAY} from '../../../../styles/variables.types';
import OnComingPopup from '../../../layout/popup/OnComingPopup';
import {pushPopup} from '../../../../src/reducers/popup';
import Avatar from '../../../Avatar';
import Tag from '../../../UI/tag/Tag';
import {staticUrl} from '../../../../src/constants/env';
import {toDateFormat} from '../../../../src/lib/date';
import {numberWithCommas} from '../../../../src/lib/numbers';
import {USER_TYPE_COLOR} from '../../../../src/constants/users';
import {APPLIED_STATUS_LIST} from '../../../../src/constants/meetup';
import Router from 'next/router';

const Li = styled.li`
  position: relative;
  width: 100%;
  padding: 15px;
  border-bottom: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;
  background-color: ${$WHITE};

  & ~ li {
    margin-top: 8px;
  }
  
  h2 {
    padding-right: 40px;
    ${maxLineEllipsisMixin(16, 1.25, 2)};
    ${fontStyleMixin({
      weight: '600'
    })};
  }

  img.go-detail-img {
    position: absolute;
    top: 15px;
    right: 9px;
    width: 30px;
  }

  .tutor {
    margin: 5px 0 11px;

    span {
      position: relative;
      padding-right: 7px;
      margin-right: 4px;
      ${fontStyleMixin({
        size: 12,
        color: '#999'
      })};
  
      &::after {
        content: '';
        position: absolute;
        top: 3px;
        right: 0;
        width: 1px;
        height: 12px;
        background-color: #eee;
      }
    }
  
    .avatar {
      display: inline-block;
      font-size: 12px;
    }
  }

  .info-wrapper {
    width: 100%;
    height: 100px;
    margin-bottom: 9px;
    border: 1px solid #eee;
    box-sizing: border-box;
    display: table;
    table-layout: fixed;

    .onclass-collect-info {
      display: table-cell;
      background-color: #fbfbfb;

      ul {
        padding: 11px 15px;

        li {
          display: table;
          table-layout: fixed;

          & ~ li {
            margin-top: 4px;
          }

          > span {
            display: table-cell;
            width: 50px;
            ${fontStyleMixin({
              size: 11,
              weight: '300',
              color: $GRAY,
            })};
          }
  
          p {
            display: table-cell;
            ${fontStyleMixin({
              size: 11,
              color: $GRAY,
            })};
  
            span {
              ${fontStyleMixin({
                size: 11,
                weight: '600',
                family: 'Montserrat',
              })};

              &.user-type {
                font-weight: 600;
                font-family: "Noto Sans KR", sans-serif;
                word-break: keep-all;

                ~ span {
                  position: relative;
                  padding-left: 5px;
                  margin-left: 5px;
    
                  &::before {
                    content: '';
                    position: absolute;
                    top: 5px;
                    left: 0;
                    width: 1px;
                    height: 7px;
                    background-color: ${$BORDER_COLOR};
                  }
                }
              }
            }
          }
        }
      }

      .onclass-coming-soon {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        ${fontStyleMixin({
          size: 12,
          weight: '600',
          color: '#999'
        })};
      }
    }
  }

  .onclass-collect-introduce {
    ${maxLineEllipsisMixin(12, 1.67, 3)};
    ${fontStyleMixin({
      color: $GRAY
    })};
  }

  .tags {
    padding-top: 13px;
    ${maxLineEllipsisMixin(14, 1.4, 2)};

    li {
      display: inline;
      margin-right: 8px;
      padding: 0 1px;
      background-color: #f4f4f4;

      p {
        margin: 0 0 4px 0;
        padding: 0;
        ${fontStyleMixin({
          size: 14,
          color: $TEXT_GRAY
        })};
      }
    }
  }

  .onclass-price {
    display: flex;
    justify-content: space-between;
    padding-top: 15px;
    margin-top: 10px;
    border-top: 1px solid #f4f4f4;

    > span {
      ${fontStyleMixin({
        size: 13,
        weight: '600',
        color: '#636363'
      })};
    }

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

      .price-free {
        ${fontStyleMixin({
          size: 14,
          weight: 'bold',
          color: '#f32b43'
        })};
      }
    }
  }

  @media screen and (max-width: 359px) {
    padding: 0;

    h2 {
      padding: 15px 45px 0 15px;
    }

    .tutor {
      padding: 0 15px;
    }

    .onclass-collect-introduce {
      padding: 0 15px;
    }

    .tags {
      padding: 13px 15px 0;
    }

    .onclass-price {
      padding: 15px 0;
      margin: 10px 15px 0;
    }
  }

  @media screen and (min-width: 680px) {
    border-bottom: 0;
  }
`;

const OnClassThumbImg = styled.div<{img: string;}>`
  position: relative;
  width: 151px;
  height: 100%;
  display: table-cell;
  ${({img}) => backgroundImgMixin({img})};

  .status-label {
    position: absolute;
    bottom: 0;
    left: 0;
    ${heightMixin(20)};
    padding: 0 5px;
    text-align: center;
    z-index: 1;
    background-color: #999;
    box-sizing: border-box;
    ${fontStyleMixin({
      size: 11,
      weight: 'bold',
      color: $WHITE
    })};
  }
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
  thumbnail = '',
  oncoming_month,
}) => {
  const {
    id,
    title,
    avatar = [],
    user,
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
  const {color: statusColor, status: onclassStatus} = APPLIED_STATUS_LIST[meetup_status] || {};
  const isOpen = meetup_status !== 'tobe';
  const timeHour = Math.floor(contents_length / 3600);
  const timeMinute = Math.floor((contents_length/60) - (timeHour * 60));

  const handleOnComingClick = React.useCallback(e => {
    if (!isOpen) {
      e.preventDefault();
      dispatch(pushPopup(OnComingPopup,{oncoming_month}));
    }
  }, [isOpen, oncoming_month]);

  const userTypeMap = React.useMemo(() => (
    user_types.map((user_type) =>
      <span
        className="user-type"
        style={{color: USER_TYPE_COLOR[user_type].color}}
      >
        {USER_TYPE_COLOR[user_type].value}
      </span>
    )
  ), [user_types]);

  const dispatch = useDispatch();

  return (
    <Li>
      <Link
        href="/story/[id]"
        as={`/story/${id}`}
      >
        <a onClick={handleOnComingClick}>
          <h2>{title}</h2>
          <img
            className="go-detail-img"
            src={staticUrl('/static/images/icon/arrow/arrow-gray-long.png')}
            alt="자세히 보러가기"
          />
        </a>
      </Link>
      <p className="tutor">
        <span>강사</span>
        <Avatar
          id={userId}
          userExposeType="real"
          className="onclass-admin"
          name={userName}
          size={25}
          hideImage
        />
      </p>
      <Link
        href="/story/[id]"
        as={`/story/${id}`}
      >
        <a onClick={handleOnComingClick}>
          <div className="info-wrapper">
            <OnClassThumbImg img={avatar[0]}>
               <span
                 className="status-label"
                 style={{backgroundColor: statusColor}}
               >
                {onclassStatus}
              </span>
            </OnClassThumbImg>
            <div className="onclass-collect-info">
              {isOpen ? ( // 오픈한 강의일 때
                <ul>
                  <li>
                    <span>강의대상</span>
                    <p>
                      {userTypeMap}
                    </p>
                  </li>
                  <li>
                    <span>강의시간</span>
                    <p>
                      {!!timeHour && <><span>{timeHour}</span>시간&nbsp;</>}
                      <span>{timeMinute}</span>분
                    </p>
                  </li>
                  <li>
                    <span>강의기간</span>
                    <p>
                      <span>{course_period}</span>일
                    </p>
                  </li>
                  <li>
                    <span>마감기한</span>
                    <p>
                      <span>{toDateFormat(receipt_range[1], 'YYYY.MM.DD')}</span>까지
                    </p>
                  </li>
                </ul>
              ) : ( // 오픈 예정인 강의일 때
                <p className="onclass-coming-soon">
                  오픈 예정 강의입니다
                </p>
              )}
            </div>
          </div>
        </a>
      </Link>
      <p className="pre-wrap onclass-collect-introduce">
        {introduction}
      </p>
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
      {isOpen && ( //오픈 예정인 강의에선 뜨지 않습니다
        <div className="onclass-price">
          <span>수강료</span>
          <p>
            {!!price
              ?
                <>
                  {isInSale && <span className="discount-rate">{(((price - sale_price) / price) * 100).toFixed(0)}%</span>}
                  <b>{numberWithCommas(isInSale ? sale_price : price)}</b>원
                  {isInSale && (
                    <span className="fixed-price">
                      <b>{numberWithCommas(price)}</b>원
                    </span>
                  )}
                </>
              : <span className="price-free">무료</span>
            }
          </p>
        </div>
      )}
    </Li>
  );
};

export default React.memo(OnClassGatheringItem);
