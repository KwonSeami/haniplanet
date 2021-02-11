import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';

interface Props {
  alt: string;
  className?: string;
  size: number;
  src: string;
}

interface ICroppedImageFrameType extends Pick<Props, 'size'> {
  dimension: IDimension
}

const CroppedImageFrame = styled.div<ICroppedImageFrameType>`
  position: relative;
  overflow: hidden;
  ${({size}) => ({width: size, height: size})};
  
  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    ${({dimension: {width, height}, size}) => ({
      width: width < height || (width === height && size > width)
        ? '100%'
        : 'auto',
      height: width > height || (width === height && size > height)
        ? '100%'
        : 'auto',
      ...['max-width', 'max-height'].reduce((prev, curr, idx) => ({
        ...prev, [curr]: ['inherit', '100%'][width >= height ? idx : 1 - idx]
      }), {})
    })};
  }
`;

const CroppedImage: React.FC<Props> = ({size, src, alt, className}) => {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [dimension, setDimension] = React.useState({
    width: 0,
    height: 0
  });

  const handleImageOnLoad = () => {
    const {current: {naturalWidth, naturalHeight}} = imgRef;

    setDimension({
      width: naturalWidth,
      height: naturalHeight
    });
  };

  return (
    <CroppedImageFrame
      className={cn(className, 'cropped-image')}
      dimension={dimension}
      size={size}
    >
      <img
        alt={alt}
        ref={imgRef}
        src={src}
        onLoad={handleImageOnLoad}
      />
    </CroppedImageFrame>
  );
};

export default React.memo<Props>(CroppedImage);
