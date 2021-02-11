import React from 'react';
import styled from 'styled-components';
import DefaultItem from './Item';
import {ICommunityCategory, ICommunityComment, ICommunityStory} from '../../../src/reducers/community';
import {$FONT_COLOR} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import {isEmpty, range} from 'lodash';
import {staticUrl} from '../../../src/constants/env';
import {CommunitySection, TitleHeader} from '../common';
import NoContentText from '../../NoContent/NoContentText';

const BoardWrapperSection = styled(CommunitySection)`
  .slick-slider {
    padding: 0 15px;

    @media screen and (max-width: 680px) {
      padding: 0;
    }
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
`;

export interface Props {
  className?: string;
  title: React.ReactNode;
  data: Array<ICommunityCategory | ICommunityComment | ICommunityStory>;
  comp?: React.ElementType;
  pageSize?: number;
  isHistoryData?: boolean;
}

const CommunityBoard = ({
  title,
  data,
  comp,
  isHistoryData,
  pageSize = 5
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
  const Comp = comp || DefaultItem;

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
    </BoardWrapperSection>
  );
};

export default React.memo(CommunityBoard);
