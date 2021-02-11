import * as React from 'react';
import ReactCustomSlick from '../common/ReactCustomSlick';
import Link from 'next/link';
import SimplePaginator from '../UI/paginator/SimplePaginator';
import {staticUrl} from '../../src/constants/env';
import Slider from 'react-slick';
import styled from 'styled-components';
import {$WHITE} from '../../styles/variables.types';
import {backgroundImgMixin} from '../../styles/mixins.styles';
import FeedApi from '../../src/apis/FeedApi';
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import Loading from '../common/Loading';
import isEmpty from 'lodash/isEmpty';
import {pushPopup} from '../../src/reducers/popup';
import OnComingPopup from '../layout/popup/OnComingPopup';
import {useDispatch} from 'react-redux';

const RecommendBandAd = styled.article`
  position: relative;
  margin-bottom: 20px;

  .recommend-ad-paginator {
    position: absolute;
    z-index: 1;
    bottom: 0;
    right: 0;

    button {
      padding-right: 0;
      background-color: ${$WHITE};
      font-size: 0;

      + button {
        margin-left: -1px;
      }

      img {
        width: 25px;
      }
    }
  }
`;

const RecommendBandAdItem = styled.div<{img: string}>`
  width: 320px;
  height: 213px;
  ${({img}) => backgroundImgMixin({
    img,
  })};
`;

const sliderSettings = {
  slidesToShow: 1,
  slidesToScroll: 1,
  speend: 600,
  arrows: false,
  autoplay: true,
  autoplaySpeed: 5000,
};

const OnClassRecommendAd = () => {

  const dispatch = useDispatch();

  const [resData, setResData] = React.useState([]);
  const [pending, setPending] = React.useState(true);
  // API
  const feedApi: FeedApi = useCallAccessFunc(access => access && new FeedApi(access));

  const sliderRef = React.useRef<Slider>(null);
  React.useEffect(() => {
    if (feedApi) {
      feedApi.onclass()
        .then(({status, data: {results}}) => {
          if( status === 200 ) {
            setPending(false);
            setResData(results);
          }
        });
    }
  }, []);

  if (pending) {
    return <Loading/>;
  }


  return !isEmpty(resData) && (
    <RecommendBandAd>
      <ReactCustomSlick
        ref={sliderRef}
        {...sliderSettings}
      >
        {resData.map(({story, oncoming_month, thumbnail = ''}) => {
          const {
            id,
            meetup_status: status,
          } = story || {};

          return (
            <Link
              href="/story/[id]"
              as={`/story/${id}`}
            >
              <a
                onClick={e => {
                  if (status === 'tobe') {
                    e.preventDefault();
                    dispatch(pushPopup(OnComingPopup, {oncoming_month}));
                  }
                }}
                target="_blank"
              >
                <RecommendBandAdItem img={thumbnail}/>
              </a>
            </Link>
          )
        })}
      </ReactCustomSlick>
      {resData.length > 1 && (
        <SimplePaginator
          className="recommend-ad-paginator"
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
          prevClickEvent={() => sliderRef.current.slickPrev()}
          nextClickEvent={() => sliderRef.current.slickNext()}
        />
      )}
    </RecommendBandAd>
  )
}

export default React.memo(OnClassRecommendAd)