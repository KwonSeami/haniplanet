import React from 'react';
import styled from 'styled-components';
import {MainBoardWrapper, MainBoardHeader} from '../common';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$GRAY, $TEXT_GRAY, $BORDER_COLOR, $POINT_BLUE} from '../../../styles/variables.types';
import Item from './Item';
import {useSelector, shallowEqual} from 'react-redux';
import {RootState} from '../../../src/reducers';
import cn from 'classnames';
import {periodRange, TPeriodPick} from '../../../src/lib/date';
import isEmpty from 'lodash/isEmpty';
import NoContentText from '../../NoContent/NoContentText';

const PopularStoryWrapper = styled(MainBoardWrapper)`
  width: 680px;

  header {
    ul {
      display: inline-block;
      vertical-align: middle;
      margin-left: 3px;

      li {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        margin: 0 8px 0 9px;
        line-height: 16px;
        ${fontStyleMixin({
          size: 14,
          weight: '600',
          color: $TEXT_GRAY
        })};
        border-bottom: 1px solid transparent;

        & ~ li::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -8px;
          transform: translateY(-50%);
          height: 9px;
          border-left: 1px solid ${$BORDER_COLOR};
        }

        &.on {
          color: ${$POINT_BLUE};
          border-bottom: 1px solid ${$POINT_BLUE};
        }
      }
    }

    p {
      float: right;
      margin-top: 6px;
      ${fontStyleMixin({
        size: 11,
        color: $TEXT_GRAY
      })};

      span {
        color: ${$GRAY};
      }
    }
  }

  > div {
    position: relative;
    height: 275px;

    &.existence {
      > div {
        height: 100%;
      
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          height: 100%;
          border-left: 1px solid #eee;
          z-index: 1;
          background-color: transparent;
        }
        
        > ul {
          background-color: #fafafa;
          height: 100%;

          &::before {
            content: '';
            position: absolute;
            top: 90px;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            border-top: 1px solid #eee;
            z-index: 1;
          }

          &::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 90px;
            transform: translateY(-50%);
            border-top: 1px solid #eee;
          }
        }
      }       
    }
    
    .no-content {
      text-align: center;
      padding: 125px 0;
      color: #bbb;
      font-size: 14px;
    }
  }
`;

const PopularStory = () => {
  const {community} = useSelector(
    ({community}: RootState) => ({
      community
    }),
    shallowEqual
  );
  const [storyTime, setStoryTime] = React.useState<TPeriodPick>('daily');
  const time = community[`${storyTime}_stories`]

  const standardTime = periodRange(storyTime);
  return (
    <PopularStoryWrapper>
      <MainBoardHeader className="clearfix">
        <h2>인기 글</h2>
        <ul className="pointer">
          <li
            className={cn({on: storyTime === 'daily'})}
            onClick={() => setStoryTime('daily')}
          >
            일간
          </li>
          <li
            className={cn({on: storyTime === 'weekly'})}
            onClick={() => setStoryTime('weekly')}
          >
            주간
          </li>
          <li
            className={cn({on: storyTime === 'monthly'})}
            onClick={() => setStoryTime('monthly')}
          >
            월간
          </li>
        </ul>
        {/* TODO: standardTime에 년, 월, 일 추가해주세요. */}
        <p>좋아요, 조회수, 댓글의 합산이 가장 많은 <span>{standardTime}</span> 기준 글</p>
      </MainBoardHeader>
      <div className={cn({existence: !isEmpty(time)})}>
        {!isEmpty(time) ? (
          <div>
            <ul className="clearfix">
              {community[`${storyTime}_stories`].map((props, idx) => (
                <Item
                  key={props.id}
                  idx={idx}
                  {...props}
                />
              ))}
            </ul>
          </div>
        ) : (
          <NoContentText disabledImg>
            <p>등록 된 글이 없습니다.</p>
          </NoContentText>
        )}
      </div>
    </PopularStoryWrapper>
  )
};

PopularStory.displayName = 'PopularStory';

export default React.memo(PopularStory);
