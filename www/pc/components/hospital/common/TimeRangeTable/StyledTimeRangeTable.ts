import styled from "styled-components";
import {$BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY, $WHITE} from "../../../../styles/variables.types";
import {fontStyleMixin, heightMixin} from "../../../../styles/mixins.styles";

export const StyledTimeRangeTable = styled.table`
  text-align: center;
  margin-bottom: 15px;

  caption {
    display: none;
  }
  
  th, td {
    border-right: 1px solid ${$WHITE};
  }

  tr:nth-of-type(3) {
    td {
      border-top: 1px solid ${$BORDER_COLOR};
    }
  }
  
  th {
    width: 100px;
    ${heightMixin(35)};
    background-color: ${$TEXT_GRAY};
    ${fontStyleMixin({
      size: 16,
      weight: 'normal',
      color: $WHITE,
    })};

    &.edit {
      cursor: pointer;
      user-select: none;

      &:hover {
        opacity: 0.9;
      }
    }
    

    &.on {
      background-color: #90b0d7;
    }
  }

  td {
    background-color: #f9f9f9;
    ${heightMixin(35)};
    ${fontStyleMixin({
      size: 16,
      weight: '300',
      color: $FONT_COLOR,
    })};

    span {
      ${fontStyleMixin({
        size: 16,
        weight: 'normal',
        color: $TEXT_GRAY,
      })};
    }
    
    .date-input {
      display: inline-block !important;
      width: 70px;
      height: 30px;
      text-align: center;
      ${fontStyleMixin({
        size: 17,
        weight: '300',
        family: 'Montserrat',
        color: $FONT_COLOR
      })};
    
      ::placeholder {
        ${fontStyleMixin({
          size: 17,
          weight: '300',
          family: 'Montserrat',
          color: $TEXT_GRAY
        })};
      }
    }
  }
`;

export default StyledTimeRangeTable;