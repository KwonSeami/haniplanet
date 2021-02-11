// 정윤재 작업 - 메인 MY TAG, 피드의 콘텐츠 태그에 사용됩니다.
// 임용빈 작업 - TagSelector에서 사용됩니다.
import * as React from 'react';
import styled from 'styled-components';
import {$TEXT_GRAY, $POINT_BLUE, $GRAY, $FONT_COLOR} from '../../../styles/variables.types';
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
  not_hover: boolean;
}

const P = styled.p<
  Pick<Props, 'highlighted' | 'onClick' | 'isLarge' | 'textHighlighted' | 'detail' | 'not_hover'>
>`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
  line-height: 18px;
  transition: color 0.1s;
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
      z-index: -1;
      width: 100%;
      height: 100%;
      background-color: #f4f4f4;
    }
  `};

  ${props => !props.not_hover && `
    &:hover {
      color: ${$GRAY};
    }
  `}

  ${props => props.isLarge ? `
    font-size: 19px;
    color: ${$TEXT_GRAY};
  `:`
    font-size: 14px;
  `}

  ${props => props.highlighted && `  
    &::after {
      content:'';
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-color: #f1f7ff;
    }
  `};

  ${props => props.textHighlighted && `
    color: ${$POINT_BLUE} !important; 
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
  ({className, name, textHighlighted, highlighted, isLarge, onClick, noHash, detail, not_hover}) => (
    <P
      className={classNames(className, 'tag pointer')}
      textHighlighted={textHighlighted}
      highlighted={highlighted}
      isLarge={isLarge}
      detail={detail}
      not_hover={not_hover}
      onClick={onClick}
    >
      {!noHash && '#'}{name}
    </P>
  )
);

export default Tag;
