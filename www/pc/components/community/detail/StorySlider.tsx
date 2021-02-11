import * as React from 'react';
import ReactCustomSlick from '../../common/ReactCustomSlick';
import {isEmpty, range} from 'lodash';
import {staticUrl} from '../../../src/constants/env';
import {FeedListUl, FeedGalleryDiv} from '../detail';
import classNames from 'classnames';
import {ICommunityStory} from '../../../src/reducers/community';
import Link from 'next/link';
import CroppedImage from '../../CroppedImage';

interface IProps {
  title: String;
  activeId: HashId;
  data: ICommunityStory[]
}

const SLIDER_PAGE_SIZE = 4;
const sliderSettings = {
  slidesToShow: 1,
  speend: 600,
  slidesToScroll: 1,
  arrows: false,
  infinite: false
};;

const StorySlider: React.FC<IProps> = ({
  data,
  title,
  activeId
}) => {
  const sliderRef = React.useRef(null);
  const [sliderPage, setSliderPage] = React.useState(1);
  const [onCenter, setOnCenter] = React.useState(true);

  return (
    <>
      <header>
        <h3>{title}</h3>
        {!isEmpty(data) && (
          <nav className="page">
            <span className="count">
              {sliderPage} / {Math.ceil(data.length / SLIDER_PAGE_SIZE)}
            </span>
            <span className="buttons">
              <img
                src={staticUrl('/static/images/icon/arrow/icon-arrow-left3.png')}
                alt="이전으로"
                title="이전으로"
                onClick={() => {
                  setOnCenter(false);
                  sliderRef.current.slickPrev();
                }}
              />
              <img
                src={staticUrl('/static/images/icon/arrow/icon-arrow-right3.png')}
                alt="다음으로"
                title="다음으로"
                onClick={() => {
                  setOnCenter(false);
                  if( sliderPage < Math.ceil(data.length / SLIDER_PAGE_SIZE)) {
                    sliderRef.current.slickNext()
                  }
                }}
              />
            </span>
          </nav>
        )}
      </header>
      <div>
        <ReactCustomSlick
          ref={sliderRef}
          beforeChange={(_, page) => setSliderPage(page+1)}
          onReInit={() => {
            const setCenter = () => {
              if(sliderRef.current === null) {
                setTimeout(setCenter,300);
                return;
              }
              const activeItemIndex = data.findIndex(({id}) => id === activeId);
              if(activeItemIndex > SLIDER_PAGE_SIZE) {
                sliderRef.current.slickGoTo(Math.floor(activeItemIndex % SLIDER_PAGE_SIZE));
              }
            }
            if (onCenter) {
              setCenter();
            }
          }}
          {...sliderSettings}
        >
          {range(0, SLIDER_PAGE_SIZE).map(idx => {
            const start = idx * SLIDER_PAGE_SIZE;
            const end = idx * SLIDER_PAGE_SIZE + SLIDER_PAGE_SIZE;

            return (
              <FeedListUl
                key={idx}
                onClick={() => setOnCenter(false)}
              >
                {data.slice(start, end).map(({
                  id,
                  title,
                  retrieve_count,
                  comment_count,
                  images
                }) => (
                  <li key={id}>
                    <FeedGalleryDiv className={classNames({
                      active: activeId === id
                    })}>
                      <Link
                        href="/community/[id]"
                        as={`/community/${id}`}
                      >
                        <a
                          onClick={e => {
                            !id && e.preventDefault();
                          }}
                        >
                          {isEmpty(images) ? (
                            <div className="background"></div>
                          ) : (
                            <CroppedImage
                              alt="스토리 썸네일"
                              className="background"
                              size={{width: 164, height: 180}}
                              src={images[0].image}
                            />
                          )}

                          <div className="content">
                            <p>{title}</p>
                            <small>조회 {retrieve_count} · 댓글 {comment_count}</small>
                          </div>
                        </a>
                      </Link>
                    </FeedGalleryDiv>
                  </li>
                ))}
              </FeedListUl>
            )
          })}
        </ReactCustomSlick>
      </div>
    </>
  )
};

StorySlider.displayName = 'StorySliider';
export default React.memo(StorySlider);

