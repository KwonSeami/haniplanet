import * as React from 'react';
import cn from 'classnames';
import Slider from 'react-slick';
import styled from 'styled-components';
import {shallowEqual, useSelector} from 'react-redux';
import ReactCustomSlick from '../../../common/ReactCustomSlick';
import BandApi from '../../../../src/apis/BandApi';
import FeedApi from '../../../../src/apis/FeedApi';
import Loading from '../../../common/Loading';
import useCallAccessFunc from '../../../../src/hooks/session/useCallAccessFunc';
import useSaveApiResult from '../../../../src/hooks/useSaveApiResult';
import {staticUrl} from '../../../../src/constants/env';
import {pickUserSelector} from '../../../../src/reducers/orm/user/selector';
import {RootState} from '../../../../src/reducers';
import BandPreviewItem from './BandListItem';
import BandCard from '../../../UI/Card/BandCard/BandCard';
import SimplePaginator from '../../../UI/paginator/SimplePaginator';

const StyledBandCard = styled(BandCard)`
  .slider-wrap {
    position: relative;
    height: 267px;

    .line-img {
      position: absolute;
      right: 0;
      top: -5px;
      width: 167px;
    }
  }
`;

const StyledSimplePaginator = styled(SimplePaginator)`
  position: absolute;
  z-index: 2;
  right: -4px;
  top: -47px;

  button {
    padding-right: 4px;

    img { 
      width: 25px;
    }
  }
`;

const SLIDER_SHOW_LENGTH = 4;

const sliderSettings = {
  slidesToShow: SLIDER_SHOW_LENGTH,
  slidesToScroll: SLIDER_SHOW_LENGTH,
  speed: 500,
  arrows: false,
  dots: false,
  variableWidth: true
};

type IBandType = 'moa' | 'onclass' | 'consultant';

interface Props {
  className?: string;
  showMoaLength?: boolean;
  title: string;
  bandType: IBandType;
}

const BandList: React.FC<Props> = React.memo(
  ({className, title, bandType, showMoaLength}) => {
    // Redux
    const user_type = useSelector(
      ({system, orm}: RootState) => (
        (pickUserSelector(system.session.id)(orm) || {} as any).user_type
      ),
      shallowEqual,
    );

    // API
    const bandApi: BandApi = useCallAccessFunc(access => access && new BandApi(access));
    const feedApi: FeedApi = useCallAccessFunc(access => access && new FeedApi(access));
    const {resData} = useSaveApiResult(() => {
      if (user_type === 'consultant') {
        return bandApi && bandApi.myBandList();
      } else {
        return feedApi && feedApi.band(bandType);
      }
    });
    const sliderRef = React.useRef<Slider>(null);

    if (!resData) { 
      return <Loading/>; 
    }

    const cardTitle = showMoaLength ? `${resData.length}개의 ${title}` : title;
  
    return (
      <StyledBandCard
        className={cn(className, 'moa-list-pc')}
        title={cardTitle}
      >
        <div className="slider-wrap">
          {sliderRef.current && (
            // ref에 값이 연결되면 렌더링합니다.
            <StyledSimplePaginator
              content={{
                left: (
                  <img
                    src={staticUrl("/static/images/icon/arrow/icon-arrow-left3.png")}
                    alt="이전으로"
                  />
                ),
                right: (
                  <img
                    src={staticUrl("/static/images/icon/arrow/icon-arrow-right3.png")}
                    alt="다음으로"
                  />
                )
              }}
              prevClickEvent={sliderRef.current.slickPrev}
              nextClickEvent={sliderRef.current.slickNext}
            />
          )}
          <ReactCustomSlick
            ref={sliderRef}
            {...sliderSettings}
          >
            {resData.map(rest => (
              <div
                key={name}
                style={{width: 225}}
              >
                <BandPreviewItem
                  bandType={bandType}
                  {...rest}
                />
              </div>
            ))}
          </ReactCustomSlick>
          <img
            className="line-img no-select"
            src={staticUrl('/static/images/icon/icon-moa-line.png')}
            alt="슬라이드 더보기"
          />
        </div>
      </StyledBandCard>
    );
  }
);

BandList.displayName = 'BandList';
export default BandList;
