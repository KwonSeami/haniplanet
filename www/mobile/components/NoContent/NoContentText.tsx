import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import {staticUrl} from '../../src/constants/env';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$TEXT_GRAY, $WHITE} from '../../styles/variables.types';

const Div = styled.div`
  text-align: center;
  background-color: ${$WHITE};
  
  > img {
    display: block;
    width: 25px;
    margin: 0 auto 8px;
  }

  > p {
    line-height: 21px;
    ${fontStyleMixin({
      size: 15,
      color: $TEXT_GRAY
    })};
  }
`;

interface Props {
  className?: string;
  children?: React.ReactNode;
  src?: string;
  alt?: string;
  disabledImg?: boolean;
}

const NoContentText: React.FC<Props> = ({
  className,
  children,
  disabledImg,
  src = '/static/images/icon/icon-no-content.png',
  alt = '검색 결과가 없습니다.',
}) => {

  return (
    <Div className={cn('no-content', className)}>
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