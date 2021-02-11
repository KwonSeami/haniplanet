import React from 'react';
import styled from 'styled-components';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import {HashId} from '../../../../../packages/types';
import {staticUrl} from '../../../src/constants/env';
import {CommunitySection, TitleHeader} from '../../community/common';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$FONT_COLOR} from '../../../styles/variables.types';
import NoContentText from '../../NoContent/NoContentText';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import Item from './Item';

const BoardWrapperSection = styled(CommunitySection)`
  padding-bottom: 20px;

  .slick-slider {
    padding: 0 15px;
  }

  footer {
    padding: 10px 0 14px;
    text-align: center;

    .pagination {
      font-size: 0;

      img, span {
        display: inline-block;
        vertical-align: middle;
      }

      .btn {
        width: 50px;

        &.reverse {
          transform: rotate(180deg);
        }
      }

      span {
        margin: -3px 18px 0;
        ${fontStyleMixin({
          size: 12,
          weight: '300',
          color: $FONT_COLOR,
          family: 'Montserrat'
        })}
      }
    }
  }

  .no-content {
    padding: 100px 0;
  }

  @media screen and (max-width: 680px) {
    border-top-color: #f2f3f7;

    .slick-slider {
      padding: 0;
    }
  }
`;

export interface IOnClassStory {
  id: HashId;
  title: string;
  is_notice: boolean;
  comment_count;
}

export interface Props {
  className?: string;
  title: React.ReactNode;
  data: Array<IOnClassStory>;
  comp?: React.ElementType;
  pageSize?: number;
  isHistoryData?: boolean;
  isQnA?: boolean;
  children: React.ReactNode;
}

const OnClassStoryMore = ({
  title,
  data,
  isHistoryData,
  pageSize = 5,
  isQnA,
  children
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

  const TOTAL_PAGE = Math.ceil(data.length / pageSize);

  return (
    <BoardWrapperSection className="board">
      <TitleHeader>
        {title}
      </TitleHeader>
      <div>
        {isEmpty(data) ? (
          <NoContentText disabledImg>
            <p>{isHistoryData ? '최근 본 글이 없습니다.' : '등록 된 글이 없습니다.'}</p>
          </NoContentText>
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
                    <Item
                      isQnA={isQnA}
                      key={props.id}
                      {...props}
                    />
                  ))}
                </div>
              );
            })}
          </ReactCustomSlick>
        )}
      </div>
      {!isEmpty(data) && (
        <footer>
          <div className="pagination">
            <img
              className="btn"
              src={staticUrl('/static/images/icon/arrow/arrow-left-radiuse50x30.png')}
              alt="이전으로"
              onClick={() => sliderRef.current.slickPrev()}
            />
            <span>
              {currSliderIdx + 1} / {TOTAL_PAGE}
            </span>
            <img
              className="btn reverse"
              src={staticUrl('/static/images/icon/arrow/arrow-left-radiuse50x30.png')}
              alt="이전으로"
              onClick={() => sliderRef.current.slickNext()}
            />
          </div>
        </footer>
      )}
      {children}
    </BoardWrapperSection>
  );
};

export default React.memo(OnClassStoryMore);
