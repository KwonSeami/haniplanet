import * as React from 'react';
import {useDispatch} from 'react-redux';
import {APPLIED_STATUS_LIST} from '../../../../src/constants/meetup';
import Link from 'next/link';
import {pushPopup} from '../../../../src/reducers/popup';
import OnComingPopup from '../../../layout/popup/OnComingPopup';
import styled from 'styled-components';
import {backgroundImgMixin, fontStyleMixin, heightMixin} from '../../../../styles/mixins.styles';
import {$BORDER_COLOR, $GRAY, $TEXT_GRAY, $WHITE} from '../../../../styles/variables.types';
import { USER_TYPE_COLOR } from '../../../../src/constants/users';

const RecommendItem = styled.li<{img: string;}>`
  width: 220px;
  margin-left: 20px;
  display: inline-block;
  vertical-align: top;

  & ~ li {
    margin-left: 8px;
  }

  &:last-child {
    margin-right: 20px;
  }

  .onclass-recommend-img {
    position: relative;
    height: 137px;
    overflow: hidden;

    .img-box {
      height: 100%;
      transition: 0.3s;
      ${({img}) => backgroundImgMixin({img})};
    }

    .status-label {
      position: absolute;
      top: 0;
      left: 0;
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
  }

  .onclass-recommend-info {
    margin: 12px 0 4px;

    p {
      ${fontStyleMixin({size: 13, color: $TEXT_GRAY})};

      ~ p {
        margin-top: 3px;
      }

      span {
        ${fontStyleMixin({size: 13, weight: '600'})};
      }
  
      b {
        font-weight: 600;
      }
    }
  }

  .introduce {
    ${fontStyleMixin({size: 15, weight: '600'})};
  }

  &:hover {
    .onclass-recommend-img {
      .img-box {
        transform: scale(1.2);
      }
    }
  }

  @media screen and (min-width: 680px) {
    width: 250px;
    margin-left: 0;

    & ~ li {
      margin-left: 12px;
    }

    &:last-child {
      margin-right: 0;
    }

    .onclass-recommend-img {
      height: 155px;
    }
  }
`;

interface Props {
  slug: string;
  story: {
    id: HashId;
    title: string;
    user: IUser;
    user_types: string[];
    meetup_status: string;
  };
  oncoming_month: number;
  thumbnail: string;
}
const OnClassRecommendItem: React.FC<Props> = (({
  slug,
  story,
  oncoming_month,
  thumbnail
}) => {
  const {
    id,
    title,
    user,
    user_types = [],
    meetup_status: status,
  } = story || {};

  const dispatch = useDispatch();
  const {name} = user || {};
  const {color, status: onclassStatus} = APPLIED_STATUS_LIST[status] || {};

  const userTypeMap = React.useMemo(() => (
    user_types.map((user_type, index) =>
      <b style={{color: USER_TYPE_COLOR[user_type].color}}>
        {index !== 0 && '/'}{USER_TYPE_COLOR[user_type].value}
      </b>
    )
  ), [user_types]);

  return (
    <RecommendItem img={thumbnail}>
      <Link
        href="/story/[id]"
        as={`/story/${id}`}
      >
        <a
          onClick={e => {
            if (status === 'tobe') {
              e.preventDefault();
              dispatch(pushPopup(OnComingPopup, {oncoming_month}));
            }
          }}
        >
            <div className="onclass-recommend-img">
              <div className="img-box"/>
              <span
                className="status-label"
                style={{backgroundColor: color}}
              >
                {onclassStatus}
              </span>
            </div>
            <div
              className="onclass-recommend-info"
              onClick={e => e.preventDefault()}
            >
              <p>
                강사&nbsp;
                <span>{name}</span>
              </p>
              <p>
                강의대상&nbsp;
                {userTypeMap}
              </p>
            </div>
            <p className="ellipsis introduce">
              {title}
            </p>
        </a>
      </Link>
    </RecommendItem>
  )
});

export default React.memo(OnClassRecommendItem);