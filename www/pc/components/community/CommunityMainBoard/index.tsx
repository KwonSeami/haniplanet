import React from 'react';
import styled from 'styled-components';
import DefaultItem from '../CommunityBoard/Item';
import {ICommunityCategory, ICommunityComment, ICommunityStory} from '../../../src/reducers/community';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import {isEmpty, range} from 'lodash';
import {NoContent} from '../../meetup/pcStyledComp';
import {staticUrl} from '../../../src/constants/env';
import {MainBoardWrapper, MainBoardHeader} from '../common';
import cn from 'classnames';

const BoardWrapperDiv = styled(MainBoardWrapper)`

  header {
    div {
      position: absolute;
      bottom: 14px;
      right: -4px;

      p {
        display: inline-block;
        width: 34px;
        text-align: center;
        line-height: 15px;
        ${fontStyleMixin({
          size: 12,
          weight: '300',
          family: 'Montserrat'
        })};
      }

      span {
        vertical-align: -1px;
        padding: 0 5px;
        cursor: pointer;

        img {
          width: 5px;
        }

        & ~ span img {
          transform: rotate(180deg);
        }
      }
    }
  }

  header + div {
    width: 320px;
    height: 172px;

    .content {
      padding: 10px 14px;
      box-sizing: border-box;
    }
  }

  &.free-board {
    header + div {
      width: 322px;
    }
  }
`;

interface Props {
  className?: string;
  title: React.ReactNode;
  data: Array<ICommunityCategory | ICommunityComment | ICommunityStory>;
  comp?: React.ElementType;
  pageSize?: number;
}

const CommunityMainBoard = ({
  className = '',
  title,
  data,
  comp,
  pageSize = 5 // 한 페이지 당 보이는 게시물 수
}: Props) => {
  const [currSliderIdx, setCurrSliderIdx] = React.useState(0);

  const sliderRef = React.useRef(null);

  const sliderSettings = {
    slidesToShow: 1,
    speend: 600,
    slidesToScroll: 1,
    arrows: false,
    infinite: false
  };

  const TOTAL_PAGE = Math.ceil(data.length / pageSize) || 1;
  const Comp = comp || DefaultItem;

  return (
    <BoardWrapperDiv className={cn('board', className)}>
      <MainBoardHeader>
        <h2>
          {title}
        </h2>
        {!isEmpty(data) && (
          <div>
            <span onClick={() => sliderRef.current.slickPrev()}>
              <img
                src={staticUrl('/static/images/icon/arrow/icon-right-gray-arrow.png')}
                alt="이전"
              />
            </span>
            <p>
              {currSliderIdx + 1} / {TOTAL_PAGE}
            </p>
            <span onClick={() => sliderRef.current.slickNext()}>
              <img
                src={staticUrl('/static/images/icon/arrow/icon-right-gray-arrow.png')}
                alt="다음"
              />
            </span>
          </div>  
        )}
      </MainBoardHeader>
      {isEmpty(data) ? (
        // 동균: Stage 배포 시 Nocontents 사용해야함
        <div>
          <NoContent>등록 된 글이 없습니다.</NoContent>
        </div>
      ) : (
        <ReactCustomSlick
          ref={sliderRef}
          beforeChange={(_, next) => setCurrSliderIdx(next)}
          {...sliderSettings}
        >
          {range(0, TOTAL_PAGE).map(idx => {
            const start = idx * pageSize;
            const end = idx * pageSize + pageSize;

            return (
              <div 
                className="content"
                key={idx}
              >
                {data.slice(start, end).map(props => (
                  <Comp
                    key={props.id}
                    {...props}
                  />
                ))}
              </div>
            );
          })}
        </ReactCustomSlick>
      )}
    </BoardWrapperDiv>
  );
};

export default React.memo(CommunityMainBoard);
