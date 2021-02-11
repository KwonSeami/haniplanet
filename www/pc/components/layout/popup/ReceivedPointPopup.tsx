import * as React from 'react';
import {PopupProps} from '../../common/popup/base/Popup';
import styled from 'styled-components';
import TitlePopup, {TitleDiv} from '../../common/popup/base/TitlePopup';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR, $BORDER_COLOR, $POINT_BLUE, $LIGHT_BLUE} from '../../../styles/variables.types';
import {staticUrl} from '../../../src/constants/env';
import Link from 'next/link';
import Avatar from '../../AvatarDynamic';
import {shallowEqual, useSelector} from 'react-redux';
import {pickStorySelector} from '../../../src/reducers/orm/story/selector';
import {numberWithCommas} from '../../../src/lib/numbers';
import StoryApi from '../../../src/apis/StoryApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import cn from 'classnames';

const StyledTitlePopup = styled(TitlePopup)`
  .modal-body {
    width: 390px;

    ${TitleDiv} {
      padding: 24px 38px 10px;
      border: 0;

      h2 {
        position: relative;
        ${fontStyleMixin({
          size: 15,
          weight: 'bold'
        })}

        &::after {
          content: '';
          position: absolute;
          left: -18px;
          top: 6px;
          width: 11px;
          height: 5px;
          background-color: ${$FONT_COLOR};
        }
      }
    } 
  }
`;

const ReceivedPointDiv = styled.div`
  h2 {
    padding: 6px 27px 28px;
    ${fontStyleMixin({
      size: 28,
      weight: '300'
    })}
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
      })}

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
    padding-right: 29px;
    margin: -23px 0 15px;
    text-decoration: underline;
    font-size: 12px;

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
    margin: 0 0 40px;
    max-height: 320px;
    overflow: hidden auto;

    li {
      padding: 0 15px;
      position: relative;
      border-bottom: 1px solid ${$BORDER_COLOR};

      &.is-me {
        background-color: ${$LIGHT_BLUE};
      }

      p {
        padding: 10px 15px 17px;

        a {
          font-size: 13px;
        }
        
        span {
          position: absolute;
          right: 29px;
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
            })}
          }
        }
      }
    }
  }
`;

interface Props extends PopupProps {
  storyPk: HashId;
  isWriter: boolean;
}

const ReceivedPointPopup = React.memo<Props>(
  ({id, closePop, storyPk, isWriter}) => {
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
      storyApi.lookUpPoint(storyPk)
        .then(({status, data: {results}}) => {
          if (status === 200) {
            setReceivePoints(results);
          }
        });
    }, [storyPk]);

    return (
      <StyledTitlePopup
        id={id}
        closePop={closePop}
        title="받은 별"
      >
        <ReceivedPointDiv>
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
                  <p>
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
                  </p>
                </li>
              );
            })}
          </ul>
        </ReceivedPointDiv>
      </StyledTitlePopup>
    );
  }
);

ReceivedPointPopup.displayName = 'ReceivedPointPopup';
export default ReceivedPointPopup;
