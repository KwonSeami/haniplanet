import * as React from 'react';
import {$POINT_BLUE, $GRAY} from '../../styles/variables.types';
import {backgroundImgMixin, fontStyleMixin} from '../../styles/mixins.styles';
import styled from 'styled-components';

interface Props {
  children?: React.ReactNode;
  text?: React.ReactNode;
  backgroundImg?: string;
  className?: string;
}

const Div = styled.div<Pick<Props, 'backgroundImg'>>`
  display: table;
  width: 100%;
  height: 96px;
  font-size: 14px;
  padding-left: 25px;
  ${props => props.backgroundImg && backgroundImgMixin({
    color: '#f2f3f7',
    img: `${props.backgroundImg}`,
    position: '100% 0',
    size: '124px 100%'
  })};
  box-sizing: border-box;

  p {
    display: table-cell;
    vertical-align: middle;

    span {
      color: ${$POINT_BLUE};
    }
  }

  strong {
    display: block;
    padding-top: 2px;
    ${fontStyleMixin({
      size: 12,
      weight: 'normal'
    })};
    color: ${$GRAY};
  }
`;

const NoContent = React.memo(({children, text, backgroundImg, className}: Props) => (
  <Div
    backgroundImg={backgroundImg}
    className={className}
  >
    <p>
      {children}
      {text && (
        <strong>{text}</strong>
      )}
    </p>
  </Div>
));

export default NoContent;