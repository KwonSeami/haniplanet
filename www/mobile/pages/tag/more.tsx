import * as React from 'react';
import styled from 'styled-components';
import isEqual from 'lodash/isEqual';
import {Waypoint} from 'react-waypoint';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/inputs/Button/ButtonDynamic';
import Tag from '../../components/UI/tag/Tag';
import Loading from '../../components/common/Loading';
import useLocation from '../../src/hooks/router/useLocation';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {staticUrl} from '../../src/constants/env';
import {tagListSelector} from '../../src/reducers/orm/tag/selector';
import {fetchFeedTag, fetchFollowedTag, followTag} from '../../src/reducers/orm/tag/thunks';
import {$BORDER_COLOR, $POINT_BLUE, $WHITE, $GRAY} from '../../styles/variables.types';
import loginRequired from "../../hocs/loginRequired";

const Section = styled.section`
  background-color: #f6f7f9;
  padding-bottom: 100px;

  & > p {
    max-width: 580px;
    margin: auto;
    padding: 17px 0 7px;
    ${fontStyleMixin({size: 12, color: $GRAY})}
  }

  @media screen and (max-width: 680px) {
    padding: 0;

    & > p {
      padding-left: 15px;
    }
  }
`;

interface IDivProps {
  on?: boolean;
}

const Div = styled.div<IDivProps>`
  max-width: 580px;
  margin: auto;
  box-sizing: border-box;

  div {
    margin-top: 8px;
    padding-bottom: 5px;
    background-color: ${$WHITE};
    
    &.following-tags {
      padding: 0;
      margin: 0;
    }

    ul {
      overflow-y: scroll;
      max-height: 127.5px;
    }

    li {
      float: left;
      padding: 6px 15px;
      
      box-sizing: border-box;

      &.loading {
        width: 100%;
        text-align: center;
        bottom: -50px;
        padding: 20px;
        background-color: #fff;
      }
      
      p {
        position: relative;
        ${fontStyleMixin({size: 16, weight: '300', color: $GRAY})}
      }
    }

    &.recommend-tag {
      padding-bottom: 0;
      border-bottom: 1px solid ${$BORDER_COLOR};

      h2 {
        padding-top: 12px;
        padding-bottom: 10px;
      }

      ul {
        //padding-bottom: 9px;
        max-height: 400px;
        padding: 9px 0;
      }

      li {
        width: 50.5%;
  
        &:nth-child(odd) {
          width: 48.5%;
          border-right: 1px solid ${$BORDER_COLOR};
        }
      }
    }

  }

  h2 {
    padding: 14px 15px 11px;
    ${fontStyleMixin({size: 12, weight: 'bold'})}
    border-bottom: 1px solid ${$BORDER_COLOR};

    img {
      width: 13px;
      display: inline-block;
      vertical-align: middle;
      margin: -2px 5px 0 0;
    }
  }

  .button-box {
    margin: 0 auto;
    padding: 30px 0 60px;
    background-color: ${$WHITE};
    text-align: center;

    button {
      width: 128px;
      height: 31px;
      box-sizing: border-box;
      border-radius: 17px;
      border: 1px solid ${$POINT_BLUE};
      ${fontStyleMixin({size: 15, color: $POINT_BLUE})}
    }
  }

  @media screen and (max-width: 680px) {
    h2 {
      padding: 13px 13px 11px;
    }

    div li {
      padding: 6px 0px 6px 13px;
    }

    &.recommend-tag li {
      width: 50% !important;
      padding: 6px 15px;
    }

    .button-box {
      padding-bottom: 66px;
    }
  }
`;

const TagMoreList = React.memo(() => {
  const {history} = useLocation();

  // Redux
  const dispatch = useDispatch();

  const {followed: [followed, followedRest], feed: [feed, feedRest]} = useSelector(
    ({orm}) => ({
      followed: tagListSelector('followed')(orm),
      feed: tagListSelector('feed')(orm),
    }),
    (prev, curr) => isEqual(prev, curr),
  );

  React.useEffect(() => {
    dispatch(fetchFollowedTag());
    dispatch(fetchFeedTag(feedRest.next));
  }, []);

  return (
    <Section>
      <Div>
        <div className="following-tags">
          <h2>
            <img
              src={staticUrl('/static/images/icon/check/icon-follow-check.png')}
              alt="팔로우중인 태그"
            />
            팔로우중인 태그
          </h2>
          <ul>
            {followed.map(({id, name}) => (
              <li key={id} className="ellipsis">
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
              <li className="loading">
                <Waypoint
                  onEnter={() => dispatch(fetchFollowedTag(followedRest.next))}
                >
                  <Loading/>
                </Waypoint>
              </li>
            )}
          </ul>
        </div>
        <div className="recommend-tag">
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
              <li className="loading">
                <Waypoint onEnter={() => dispatch(fetchFeedTag(feedRest.next))}>
                  <Loading/>
                </Waypoint>
              </li>
            )}
          </ul>
        </div>
        <div className="button-box">
          <Button onClick={() => history.goBack()}>
            확인
          </Button>
        </div>
      </Div>
    </Section>
  );
});

export default loginRequired(TagMoreList);
