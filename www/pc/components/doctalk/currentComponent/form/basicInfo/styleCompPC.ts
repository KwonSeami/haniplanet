import styled from 'styled-components';
import Input from '../../../../../components/inputs/Input';
import {heightMixin, fontStyleMixin, inlineBlockMixin} from '../../../../../styles/mixins.styles';
import {$BORDER_COLOR, $TEXT_GRAY, $FONT_COLOR, $POINT_BLUE} from '../../../../../styles/variables.types';
import VerticalTitleCard from '../../../../../components/UI/Card/VerticalTitleCard';
import {Div} from '../../../../../components/UI/ResponsiveLi/ResponsiveLi';
import Button from '../../../../../components/inputs/Button';
import SelectBox from '../../../../inputs/SelectBox';
import TextArea from '../../../../hospital/common/TextArea';
import AddressInput from '../../../../inputs/Input/AddressInput';

interface InputProps {
  telephone?: boolean;
}

export const StyledVerticalTitleCard = styled(VerticalTitleCard)`
  padding: 15px 0 22px 150px;

  ${Div} {
    padding-left: 100px;

    > ul {
      li:first-child {
        padding-bottom: 9px;
      }
    }
  }

  .title {
    top: 14px;
  }

  .radio {
    display: inline-block;
    margin: 11px 32px 2px 0;

    span {
      top: 2px;
      cursor: pointer;
    }
  }

  .chart h3 {
    top: 7px;
  }
`;

export const StyledSelectBox = styled(SelectBox)`
  p span {
    color: ${$TEXT_GRAY};
  }

  ul {
    max-height: 220px;
    overflow-y: auto;
    border-bottom: 1px solid ${$BORDER_COLOR};

    li {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &:last-child {
        border-bottom: 0;
      }
    }
  }
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

  &.search-address {
    display: inline-block;
    width: calc(100% - 119px);
    margin-right: 9px;
  }

  &[disabled] {
    opacity: 1;
    background-color: #f9f9f9;
  }
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
  // margin-bottom: 20px;

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

export const ExampleSpan = styled.span`
  display: block;
  ${fontStyleMixin({
    size: 11,
    color: '#999'
  })};

  span {
    ${fontStyleMixin({
      size: 11,
      color: $POINT_BLUE
    })};
  }
`;

export const ExplainSpan = styled.span`
  display: block;
  line-height: 18px;
  margin-top: 3px;
  ${fontStyleMixin({
    size: 11,
    color: $TEXT_GRAY
  })};

  a {
    display: block;
    text-decoration: underline;
    ${fontStyleMixin({
      size: 11,
      weight: '600'
    })};

    img {
      width: 11px;
      margin-left: 2px;
    }
  }
`;

export const StyledTextArea = styled(TextArea)`
  height: 98px;
`;

export const Span = styled.span`
  position: absolute;
  top: 15px;
  left: 0;
  ${fontStyleMixin({
    size: 11,
    weight: '300'
  })};
`;

export const StyledAddressInput = styled(AddressInput)`
  input {
    width: 100%;
    border-bottom: 1px solid ${$BORDER_COLOR};
  }
`;