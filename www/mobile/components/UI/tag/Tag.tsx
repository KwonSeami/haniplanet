// 정윤재 작업 - 메인 MY TAG, 피드의 콘텐츠 태그에 사용됩니다.
// 임용빈 작업 - TagSelector에서 사용됩니다.
import * as React from 'react';
import styled from 'styled-components';
import {$LIGHT_BLUE, $TEXT_GRAY, $FONT_COLOR, $POINT_BLUE} from '../../../styles/variables.types';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import classNames from 'classnames';

interface Props extends ITag {
  className?: string;
  highlighted?: boolean;
  textHighlighted?: boolean;
  isLarge?: boolean;
  onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  noHash?: boolean;
  detail: boolean;
}

const P = styled.p<
  Pick<Props, 'highlighted' | 'onClick' | 'isLarge' | 'textHighlighted' | 'detail'>
>`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  ${fontStyleMixin({
    size: 14,
    color: $TEXT_GRAY
  })};
  z-index: 1;
  cursor: pointer;

  ${props => props.detail && `
    &::after {
      content:'';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background-color: #f4f4f4;
      z-index: -1;
    }
  `};

  ${props => props.isLarge ? `
    font-size: 19px;
    color: ${$TEXT_GRAY};
  `:`
    font-size: 14px;
  `};

  ${props => props.highlighted && `
    &::after {
      content:'';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background-color: ${$LIGHT_BLUE};
      z-index: -1;
    }
  `};

  ${props => props.textHighlighted && `
    color: ${$POINT_BLUE};
  `};
  
  &.new-content {
     &::after {
      content: '';
      width: 4px;
      height: 4px;
      top: 8px;
      background-color: ${$POINT_BLUE};
      position: absolute;
      border-radius: 50%;
    } 
  }
`;

const Tag = React.memo<Props>(
  ({className, name, textHighlighted, highlighted, isLarge, onClick, noHash, detail}) => (
    <P
      className={classNames('pointer', className)}
      textHighlighted={textHighlighted}
      highlighted={highlighted}
      isLarge={isLarge}
      detail={detail}
      onClick={onClick}
    >
      {!noHash && '#'}{name}
    </P>
  )
);

export default Tag;
