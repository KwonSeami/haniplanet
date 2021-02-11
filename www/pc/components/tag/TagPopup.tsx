import * as React from 'react';
import {PopupProps} from '../common/popup/base/Popup';
import styled from 'styled-components';
import {TitleDiv} from '../common/popup/base/TitlePopup';
import Alert from '../common/popup/Alert';
import {backgroundImgMixin, fontStyleMixin} from '../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $GRAY, $LIGHT_BLUE} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';
import {fetchFeedTag, fetchFollowedTag, followTag} from '../../src/reducers/orm/tag/thunks';
import {useDispatch, useSelector} from 'react-redux';
import {tagListSelector} from '../../src/reducers/orm/tag/selector';
import Tag from '../UI/tag/Tag';
import {Waypoint} from 'react-waypoint';
import Loading from '../common/Loading';

interface Props extends PopupProps {
  on?: boolean;
}

const StyledAlert = styled(Alert)`
  .modal-body {
    width: 680px;
    padding-bottom: 5px;
    ${backgroundImgMixin({
      img: staticUrl("/static/images/graphic/img-tag-bg.png"),
      size: '200px 150px',
      position: '91.5% 0'
    })}

    ${TitleDiv} {
      border: 0;

      h2 {
        position: relative;
        padding: 14px 29px 21px;
        line-height: 1;
        
        ${fontStyleMixin({
          size: 26,
          weight: '300'
        })}

        span {
          font-size: 14px;
          display: inline-block;
          vertical-align: top;
          margin-left: 1px;
        }

        strong {
          display: block;
        }
      }
    } 
  }
`;

const TagPopupDiv = styled.div<Pick<Props, 'on'>>`
  .notice {
    padding: 0 30px 20px;
    font-size: 12px;
    border-bottom: 1px solid ${$BORDER_COLOR};
  }

  .tag-list {
    padding: 15px 10px 0;
    border-bottom: 1px solid ${$BORDER_COLOR};

    div {
      float: left;
      width: 220px;
      box-sizing: border-box;

      &.follow-tag {
        width: calc(100% - 229px);
        border-left: 1px solid ${$BORDER_COLOR};

        li {
          float: left;
          width: 50%;
          box-sizing: border-box;
        }
      }

      h2 {
        padding: 2px 0 13px 20px;
        ${fontStyleMixin({
          size: 12,
          weight: 'bold'
        })}

        img {
          width: 13px;
          display: inline-block;
          vertical-align: middle;
          margin: -2px 5px 0 0;
        }
      }

      ul {
        height: 385px;
        overflow-y: auto;

        li {
          padding: 0 0 9px 20px;
          cursor: pointer;

          span {
            position: relative;
            ${fontStyleMixin({
              size: 17,
              weight: '300',
              color: $GRAY
            })}
          }
          /* TODO: on이 작동이 안됩니다 ~ 확인부탁드려용 */
          ${({on}) => on && `
            span {
              color: ${$FONT_COLOR};

              &::after {
                content:'';
                position: absolute;
                left: 0;
                bottom: 0;
                z-index: -1;
                width: 100%;
                height: 50%;
                background-color: ${$LIGHT_BLUE};
              }
            }
          `}
        }
      }
    }
  }
`;


const TagPopup: React.FC<Props> = React.memo(({id, closePop, ...props}) => {
  // Redux
  const dispatch = useDispatch();

  const {
    followed: [followed, followedRest],
    feed: [feed, feedRest],
  } = useSelector(({orm}) => ({
    followed: tagListSelector('followed')(orm),
    feed: tagListSelector('feed')(orm),
  }));

  React.useEffect(() => {
    dispatch(fetchFollowedTag());
    dispatch(fetchFeedTag(feedRest.next));
  }, [feedRest.next]);

  return (
    <StyledAlert
      id={id}
      closePop={closePop}
      title={
        <>
          태그<span>#</span>
          <strong>더보기</strong>
        </>
      }
      {...props}
    >
      <TagPopupDiv>
        <div className="tag-list clearfix">
          <div>
            <h2>
              <img
                src={staticUrl('/static/images/icon/icon-follow-check.png')}
                alt="팔로우중인 태그"
              />
              팔로우중인 태그
            </h2>
            <ul>
              {followed.map(({id, name}) => (
                <li key={id}>
                  <Tag
                    key={id}
                    className="pointer"
                    name={name}
                    highlighted
                    onClick={() => dispatch(followTag(id))}
                  />
                </li>
              ))}
              {followedRest.next && (
                <li>
                  <Waypoint
                    onEnter={() => dispatch(fetchFollowedTag(followedRest.next))}
                  >
                    <Loading />
                  </Waypoint>
                </li>
              )}
            </ul>
          </div>

          <div className="follow-tag">
            <h2>
              <img
                src={staticUrl('/static/images/icon/icon-follow-add.png')}
                alt="추천 태그"
              />
              추천 태그
            </h2>
            <ul className="clearfix">
              {feed.map(({id, name, is_follow}) => (
                <li key={id}>
                  <Tag
                    key={id}
                    className="pointer"
                    name={name}
                    highlighted={is_follow}
                    onClick={() => dispatch(followTag(id))}
                  />
                </li>
              ))}
              {feedRest.next && (
                <li>
                  <Waypoint onEnter={() => dispatch(fetchFeedTag(feedRest.next))}>
                    <Loading />
                  </Waypoint>
                </li>
              )}
            </ul>
          </div>
        </div>
      </TagPopupDiv>
    </StyledAlert>
  );
});

export default TagPopup;
