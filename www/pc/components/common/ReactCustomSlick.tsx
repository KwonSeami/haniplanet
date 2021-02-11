import * as React from 'react';
import Slider, {Settings} from 'react-slick';

interface Props extends Settings {
  children: React.ReactNode;
}

const ReactCustomSlick = React.memo(
  React.forwardRef<Slider, Props>((props, ref) => {
    const {slidesToShow, children, ...sliderProps} = props;
    const childrenLength = React.Children.count(children);

    return (
      <Slider
        ref={ref}
        slidesToShow={childrenLength > slidesToShow ? slidesToShow : childrenLength}
        children={children}
        {...sliderProps}
      />
    );
  })
);

export default ReactCustomSlick;
