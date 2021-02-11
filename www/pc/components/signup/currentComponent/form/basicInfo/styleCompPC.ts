import styled from 'styled-components';
import Input from '../../../../../components/inputs/Input';
import {heightMixin, fontStyleMixin, inlineBlockMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $TEXT_GRAY, $FONT_COLOR} from '../../../../../styles/variables.types';
import VerticalTitleCard from '../../../../../components/UI/Card/VerticalTitleCard';
import {Div} from '../../../../UI/ResponsiveLi/ResponsiveLi';
import Button from '../../../../inputs/Button';
import SelectBox from '../../../../inputs/SelectBox';

interface InputProps {
  telephone?: boolean;
}

export const StyledVerticalTitleCard = styled(VerticalTitleCard)`
  padding: 15px 0 22px 148px;

  ${Div} {
    padding-left: 102px;
  }
`;

export const StyledSelectBox = styled(SelectBox)`
  width: 215px;
`;

export const StyledInput = styled(Input)<InputProps>`
  width: 100%;
  ${heightMixin(44)}
  box-sizing: border-box;
  font-size: 14px;  
  border-bottom: 1px solid ${$BORDER_COLOR} !important;

  ${props => props.telephone && `
    background-color: #f6f7f9;
  `}
`;

export const ErrorSpan = styled.span`
  display: block;
  padding-top: 4px;
  ${fontStyleMixin({
    size: 11,
    color: '#ea6060'
  })}
`;

export const Li = styled.li`
  display: inline-block;
  vertical-align: top;
  margin-bottom: 20px;

  &:first-child {
    width: calc(100% - 146px);
    margin-right: 8px;
    vertical-align: top;
  }

  button {
    color: ${$FONT_COLOR};
  }
`;

export const StyledButton = styled(Button)`
  margin-top: 3px;

  &:active {
    opacity: 0.5;
  }
  
  img {
    margin: -2px 0 0 -6px;
    display: inline-block;
    vertical-align: middle;
    width: 15px;
  }
`;

export const PopupSpan = styled.span`
  position: absolute;
  top: 50px;
  /* bottom: -3px; */
  right: 0;
  font-weight: bold;
  cursor: pointer;

  img {
    ${inlineBlockMixin(18)};
    margin-top: -3px;
  }
`;

export const LinkSpan = styled.span`
  display: block;
  position: absolute;
  left: 250px;
  top: 13px;
  ${fontStyleMixin({
    size: 13,
    color: '#bbb'
  })};
`;

export const P = styled.p`
  font-size: 11px;
  padding-top: 5px;

  span {
    color: ${$TEXT_GRAY};
  }
`;