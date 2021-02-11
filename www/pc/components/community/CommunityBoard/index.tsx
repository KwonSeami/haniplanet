import React from 'react';
import styled from 'styled-components';
import DefaultItem from './Item';
import {ICommunityCategory, ICommunityComment, ICommunityStory} from '../../../src/reducers/community';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import {isEmpty, range} from 'lodash';
import {NoContent} from '../../meetup/pcStyledComp';
import {staticUrl} from '../../../src/constants/env';

const BoardWrapperDiv = styled.div`
  border: 1px solid #eee;
  border-top: 1px solid #999;

  header {
    position: relative;
    height: 46px;
    background-color: #fbfbfb;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;

    h2 {
      padding: 10px 15px;
      line-height: 25px;
      ${fontStyleMixin({
        size: 15,
        weight: '600'
      })};
    }

    div {
      position: absolute;
      top: 13px;
      right: 14px;

      p {
        display: inline-block;
        width: 43px;
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
        cursor: pointer;

        img {
          width: 5px;
        }

        &:first-child img {
          transform: rotate(180deg);
        }
      }
    }
  }

  .content {
    padding: 8px 14px;
    box-sizing: border-box;
  }
`;

interface Props {
  className?: string;
  title: React.ReactNode;
  data: Array<ICommunityCategory | ICommunityComment | ICommunityStory>;
  comp?: React.ElementType;
  pageSize?: number;
  isHistoryData?: boolean;
}

const CommunityBoard = ({
  className = '',
  title,
  data,
  comp,
  isHistoryData,
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
    <BoardWrapperDiv className="board">
      <header>
        <h2>
          {title}
        </h2>
        {!isEmpty(data) && (
          <div>
            <span onClick={() => sliderRef.current.slickPrev()}>
              <img
                src={staticUrl('/static/images/icon/arrow/icon-more-arrow.png')}
                alt="이전"
              />
            </span>
            <p>
              {currSliderIdx + 1} / {TOTAL_PAGE}
            </p>
            <span onClick={() => sliderRef.current.slickNext()}>
              <img
                src={staticUrl('/static/images/icon/arrow/icon-more-arrow.png')}
                alt="다음"
              />
            </span>
          </div>  
        )}
      </header>
      {isEmpty(data) ? (
        <NoContent>
          {isHistoryData ? '최근 본 글이 없습니다.' : '등록 된 글이 없습니다.'}
        </NoContent>
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

export default React.memo(CommunityBoard);
