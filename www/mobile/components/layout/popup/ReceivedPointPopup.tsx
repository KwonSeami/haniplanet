import * as React from 'react';
import styled from 'styled-components';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $POINT_BLUE, $LIGHT_BLUE} from '../../../styles/variables.types';
import FakeFullPopup from '../../common/popup/base/FakeFullPopup';
import {staticUrl} from '../../../src/constants/env';
import {numberWithCommas} from '../../../src/lib/numbers';
import Link from 'next/link';
import Avatar from '../../AvatarDynamic';
import StoryApi from '../../../src/apis/StoryApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {pickStorySelector} from '../../../src/reducers/orm/story/selector';
import {HashId} from '../../../../../packages/types';
import {PopupProps} from '../../common/popup/base/Popup';
import cn from 'classnames';
import {setLayout, clearLayout} from '../../../src/reducers/system/style/styleReducer';

const ReceivedSection = styled.section`
  max-width: 680px;
  margin: auto;
  padding: 21px 0 0;

  h2 {
    padding: 0 20px 24px;
    ${fontStyleMixin({
      size: 28,
      weight: '300'
    })};
    line-height: 1.1;

    span {
      display: inline-block;
      vertical-align: middle;
      padding-left: 8px;
      margin-top: -5px;
      ${fontStyleMixin({
        size: 33,
        family: 'Montserrat',
        weight: '300',
        color: $POINT_BLUE
      })};

      img {
        display: inline-block;
        vertical-align: middle;
        width: 25px;
        margin: -7px 2px 0 0;
      }
    }
  }

  & > a {
    display: block;
    text-align: right;
    text-decoration: underline;
    font-size: 12px;
    padding-right: 21px;
    margin: -16px 0 15px;
    img {
      display: inline-block;
      vertical-align: middle;
      width: 12px;
      margin: -3px 0 0 -4px;
    }
  }

  & > p {
    position: relative;
    padding: 8px 27px 9px;
    border: 1px solid ${$BORDER_COLOR};
    border-right: 0;
    border-left: 0;
    background-color: #f6f7f9;
    font-size: 12px;
  }

  ul {
    padding-top: 3px;
    min-height: 100px;
    overflow: hidden auto;

    li {
      position: relative;
      padding: 10px 15px 17px;

      & ~ li {
        border-top: 1px solid ${$BORDER_COLOR};
      }

      &.is-me {
        background-color: ${$LIGHT_BLUE};
      }

      a {
        font-size: 13px;
      }

      & > img {
        margin: 0 0 -4px;
        display: inline-block;
        width: 40px;
        height: 40px;
      }

      span {
        position: absolute;
        right: 15px;
        top: 19px;
        font-size: 14px;

        strong {
          display: inline-block;
          vertical-align: middle;
          margin: -1px 1px 0 0;
          ${fontStyleMixin({
            size: 18,
            family: 'Montserrat',
            weight: '300', 
            color: $POINT_BLUE
          })};
        }
      }
    }
  }
`;

interface Props extends PopupProps {
  storyPk: HashId;
  isWriter: boolean;
}

const ReceivedPointPopup = React.memo<Props>(props => {
  const {id, closePop, storyPk, isWriter} = props;

  const dispatch = useDispatch();

  // State
  const [receivePoints, setReceivePoints] = React.useState([]);

  // Redux
  const {story: {received_point} = {} as any} = useSelector(
    ({orm}) => ({
      story: pickStorySelector(storyPk)(orm)
    }),
    shallowEqual,
  );

  const storyApi: StoryApi = useCallAccessFunc(access => new StoryApi(access));

  React.useEffect(() => {
    dispatch(setLayout('받은 별'));

    storyApi.lookUpPoint(storyPk)
      .then(({status, data: {results}}) => {
        if (status === 200) {
          setReceivePoints(results);
        }
      });

    return () => {
      dispatch(clearLayout());
    }
  }, [storyPk]);

  return (
    <FakeFullPopup
      id={id}
      closePop={closePop}
    >
      <ReceivedSection>
        <h2>
          총
          <span>
          <img
            src={staticUrl("/static/images/icon/icon-point-large.png")}
            alt="별"
          />
            {numberWithCommas(Number(received_point))}
        </span>
          개의 별을<br />
          받았습니다.
        </h2>
        {isWriter && (
          <Link
            href={{
              pathname: '/user/point',
              query: {tab: 'history'}
            }}
          >
            <a>
              내역 보러가기
              <img
                src={staticUrl("/static/images/icon/arrow/icon-mini-shortcuts2.png")}
                alt="내역 보러가기"
              />
            </a>
          </Link>
        )}
        <p>
          별 공개 범위에 따라, 아래의 리스트가 노출됩니다.<br/>
          나만보기로 보낸 별일 경우, 별을 보낸 회원에게만 보여지므로, 리스트에는 표시되지 않습니다.
        </p>
        <ul>
          {receivePoints.map(({
            amount,
            giver,
            user_expose_type,
            point: {
              id: pointId
            }
          }) => {
            const {
              id: giverId,
              name,
              nick_name,
              avatar,
              is_giver
            } = giver || {
              id: '',
              name: '',
              nick_name: '',
              avatar: '',
              is_giver: false
            };

            return (
              <li
                key={pointId}
                className={cn('pointer', {
                  'is-me': is_giver
                })}
              >
                <Avatar
                  size={40}
                  src={avatar}
                  userExposeType={user_expose_type}
                  id={giverId}
                  name={name}
                  nick_name={nick_name}
                />
                <span>
                  <strong>{numberWithCommas(amount)}</strong>개
                </span>
              </li>
            );
          })}
        </ul>
      </ReceivedSection>
    </FakeFullPopup>
  );
});

ReceivedPointPopup.displayName = 'ReceivedPointPopup';
export default ReceivedPointPopup;
