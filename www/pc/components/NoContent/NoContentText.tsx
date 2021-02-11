import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$TEXT_GRAY, $WHITE, $GRAY, $BORDER_COLOR} from '../../styles/variables.types';

const Div = styled.div`
  text-align: center;
  background-color: ${$WHITE};
  
  > img {
    display: block;
    width: 25px;
    margin: 0 auto 8px;
  }

  > p {
    line-height: 22px;
    ${fontStyleMixin({
      size: 15,
      color: $TEXT_GRAY
    })};
  }

  &.border-box {
    text-align: center;
    padding: 75px 0 85px;
    border-top: 1px solid ${$GRAY};
    border-bottom: 1px solid ${$BORDER_COLOR};

    img {
      display: block;
      margin: 0 auto 8px;
      width: 25px;
      height: 21px;
    }

    > p {
      ${fontStyleMixin({
        size: 14,
        color: $TEXT_GRAY
      })};
    }
  }
`;

interface Props {
  className?: string;
  children?: React.ReactNode;
  src?: string;
  alt?: string;
  borderBox?: boolean;
  disabledImg?: boolean;
}

const NoContentText: React.FC<Props> = ({
  className,
  children,
  disabledImg,
  src = '/static/images/icon/icon-no-content.png',
  alt = '검색 결과가 없습니다.',
  borderBox
}) => {

  return (
    <Div className={cn('no-content', className, {
      'border-box': borderBox
    })}>
      {!disabledImg && (
        <img
          src={staticUrl(src)}
          alt={alt}
        />
      )}
      {children}
    </Div>
  )
}

NoContentText.displayName = 'NoContentText';

export default React.memo(NoContentText);