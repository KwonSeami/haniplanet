import * as React from 'react';
import Link from 'next/link';
import {CustomArrowProps} from 'react-slick';
import cn from 'classnames';
import styled from 'styled-components';
import {staticUrl} from '../../../../../../src/constants/env';
import {numberWithCommas} from '../../../../../../src/lib/numbers';
import {BannerInfoLi, MoaSliderDiv, Shortcuts, MoaBanner} from './styleCompPC';
import ReactCustomSlick from '../../../../../common/ReactCustomSlick';

interface IMyMoa {
  avatar: string;
  created_at: string;
  member_created_at: string;
  name: string;
  slug: string;
  story_count: number;
  new_story_count: number;
  member_count: number;
}

interface Props {
  myMoaList: IMyMoa[];
}

export const SliderItemBox = styled.div`
  position: relative;
  width: 262px !important;
  height: 235px;
`;

const SliderArrowDiv = styled.div`
  z-index: 1;
  width: 38px;
  height: 38px;;
  
  :before {
    display: none;
  }
  
  &.slick-prev {
    padding: 0 0 37px 6px;
  }
  
  &.slick-next {
    padding: 0 19px 37px 0;
  }
`;

interface ISliderArrowProps extends CustomArrowProps {
  arrowImg: string;
}

const SliderArrow = React.memo<ISliderArrowProps>(
  ({arrowImg, className, onClick}) => (
    <SliderArrowDiv
      className={className}
      onClick={onClick}
    >
      <img src={arrowImg} alt="슬라이더 화살표" />
    </SliderArrowDiv>
  )
);

const SLIDER_SHOW_LENGTH = 3;
const sliderSettings = {
  speed: 500,
  variableWidth: true,
  slidesToShow: SLIDER_SHOW_LENGTH,
  slidesToScroll: SLIDER_SHOW_LENGTH,
  prevArrow: <SliderArrow arrowImg={staticUrl('/static/images/icon/icon-radius-prev.png')} />,
  nextArrow: <SliderArrow arrowImg={staticUrl('/static/images/icon/icon-radius-next.png')} />,
};

const MyMoaSlider = React.memo<Props>(({myMoaList}) => {

  return (
    <ReactCustomSlick {...sliderSettings}>
      {myMoaList.map(
        ({avatar, name, slug, story_count, new_story_count, member_count}, idx) => {
          return (
            <SliderItemBox key={slug}>
              <MoaSliderDiv>
                <Link
                  href="/band/[slug]"
                  as={`/band/${slug}`}
                >
                  <a>
                    <MoaBanner bandAvatar={avatar || staticUrl('/static/images/icon/icon-moa-content-default.png')}>
                      <div
                        className={cn('band-avatar',{avatar})}
                      />
                      <Shortcuts>
                        바로가기
                        <img
                          src={staticUrl('/static/images/icon/arrow/icon-shortcuts-white.png')}
                          alt={`${name} 바로가기`}
                        />
                      </Shortcuts>
                    </MoaBanner>
                    <h2>{name}</h2>
                    <ul>
                      <BannerInfoLi>
                        총 게시글 <span>{numberWithCommas(story_count)}</span>
                      </BannerInfoLi>
                      <BannerInfoLi newCount={true}>
                        새글 <span>{numberWithCommas(new_story_count)}</span>
                      </BannerInfoLi>
                      <BannerInfoLi>
                        회원수 <span>{numberWithCommas(member_count)}</span>
                      </BannerInfoLi>
                    </ul>
                  </a>
                </Link>
              </MoaSliderDiv>
            </SliderItemBox>
          );
        }
      )}
    </ReactCustomSlick>
  );
});

MyMoaSlider.displayName = 'MyMoaSlider';
export default MyMoaSlider;
