import * as React from 'react';
import styled from 'styled-components';
import useElementSize from '@charlietango/use-element-size';
import {$FONT_COLOR} from '../../styles/variables.types';
import {fontStyleMixin} from '../../styles/mixins.styles';
import uuid from 'uuid';

const SLIDE_CLASS_NAME = 'slide';
const SLIDE_CURRENT_CLASS_NAME = 'current-slide';
const SLIDE_CLONE_CLASS_NAME = 'clone-slide';

const SliderDiv = styled.div<{width?: number}>`
  position: relative;
  overflow: hidden;
  .${SLIDE_CLASS_NAME} {
    float: left;
    width: ${({width}) => width ? `${width}px` : '100%'};
  }

  .slider-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0;
    cursor: pointer;
    z-index: 2;

    &::before {
      ${fontStyleMixin({
        size: 18,
        color: $FONT_COLOR
      })};
    }
    &.slider-prev {
      left: 0;
      &::before {
        content: '<';
      }
    }
    &.slider-next {
      right: 0;
      &::before {
        content: '>';
      }
    }
  }
`

interface ISliderMethods {
  next: () => void;
  prev: () => void;
  move: (targetPage: number) => void;
}

interface ISliderRef {
  current: ISliderMethods
}

type TSliderDirection = 'horizontal' | 'vertical';

interface ISliderProps {
  ref: React.RefObject<ISliderRef>;
  children: React.ReactChild;
  direction: TSliderDirection;
  speed?: number;
  autoPlayTimer?: number;
  onChange?: (currentPage: number) => void;
  onAfterChange?: (currentPage: number) => void;
};



export const ARROW_SLIDER_DEFAULT_OPTION = {
  speed: 800,
  autoPlayTimer: 2000,
  direction: 'horizontal' as TSliderDirection,
}


const ArrowSlider = React.forwardRef<any, ISliderProps>((props, ref: ISliderRef) => {
  const {
    children,
    direction,
    speed = 800,
    onChange,
    onAfterChange,
  } = props;
  
  const [sizeRef, {
    width: sliderWidth,
    height: sliderHeight,
  }] = useElementSize();
  
  const [slideState, setSlideState] = React.useState({
    currentPage: 0,
    currentSpeed: speed,
    pending: false
  });
  const {currentPage, currentSpeed, pending} = slideState;
  const [style, setStyle] = React.useState({});

  const sliderChildArray = React.useMemo(() => {
    return React.Children.toArray(children);
  }, [children]);
  const slideCount = React.useMemo(() => React.Children.count(children), [sliderChildArray]);

  const [cloneFirst, cloneLast] = React.useMemo(() => {
    return [
      React.cloneElement(sliderChildArray[0] as any, {
        key: `${sliderChildArray[0]}-${uuid()}`,
        className: `${SLIDE_CLASS_NAME} ${SLIDE_CLONE_CLASS_NAME}`
      }),
      React.cloneElement(sliderChildArray[slideCount-1] as any, {
        key: `${sliderChildArray[slideCount-1]}-${uuid()}`,
        className: `${SLIDE_CLASS_NAME} ${SLIDE_CLONE_CLASS_NAME}`,
      }),
    ]
  }, [sliderChildArray]);


  const move = React.useCallback((targetPage: number) => {
    if(pending) return;
    const isReset = targetPage === -1 || targetPage === slideCount;
    setSlideState(curr => ({
      ...curr,
      currentPage: targetPage,
      pending: true
    }));
    onChange && onChange(
      isReset 
        ? (targetPage === -1 ? slideCount-1 : 0)
        : targetPage
    );
    setTimeout(() => {
      if(isReset) {
        setSlideState(curr => ({
          ...curr,
          currentSpeed: 0,
          currentPage: targetPage === -1 ? slideCount-1 : 0
        }));
      }
      setSlideState(curr => ({
        ...curr,
        currentSpeed: speed,
        pending: false
      }));
      onAfterChange && onAfterChange(targetPage);
    }, speed);
  }, [pending]);

  // 페이지 변경 시 
  React.useEffect(() => {
    setStyle(curr => ({
      ...curr,
      'transition': `transform ${currentSpeed}ms`,
      'transform': direction === 'horizontal'
        ? `translateX(${-(currentPage*sliderWidth)-sliderWidth}px)`
        : `translateY(${-(currentPage*sliderHeight)-sliderHeight}px)`
    }));
  }, [currentPage]);

  // Children이 모두 Loaded 됬을 때 사이즈 및 포지션 설정 
  React.useEffect(() => {
    if(direction === 'vertical') {
      setStyle(curr => ({
        ...curr,
        height: `${sliderHeight * (slideCount+2)}px`,
        transform: `translateY(${-(currentPage*sliderHeight)-sliderHeight}px)`
      }))
    } else {
      setStyle(curr => ({
        ...curr,
        width: `${sliderWidth * (slideCount+2)}px`,
        transform: `translateX(${-(currentPage*sliderWidth)-sliderWidth}px)`
      }))
    }
  }, [sliderWidth, sliderHeight]);

  React.useEffect(() => {
    setStyle({
      transition: 'transform 0ms'
    });
    
    ref.current = {
      next: () => move(currentPage+1),
      prev: () => move(currentPage-1),
      move: (targetPage) => move(targetPage),
    };
  }, []);
  
  return (
    <SliderDiv 
      width={sliderWidth}
      ref={sizeRef}
      className="arrow-slider"
    >
      <button 
        type="button"
        className="slider-btn slider-prev"
        onClick={() => move(currentPage-1)}
      >
        Previous
      </button>
      <div 
        className="slider-list"
        style={style}
      > 
        {cloneLast} 
        {React.Children.map(children, (item, index) => {
          const {key, type, props} = item as any;
          const {className, children} = props;
          const slide = React.createElement(type, {
            ...props,
            key,
            className: `${SLIDE_CLASS_NAME} ${index === currentPage && SLIDE_CURRENT_CLASS_NAME} ${className} `
          }, children);

          return slide;
        })}
        {cloneFirst} 
      </div>
      <button
        type="button"
        className="slider-btn slider-next"
        onClick={() => move(currentPage+1)}
      >
        Next
      </button>
    </SliderDiv>
  )
});

ArrowSlider.displayName = 'ArrowSlider';
export default React.memo(ArrowSlider);
