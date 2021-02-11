import styled from "styled-components";
import {fontStyleMixin} from "../../../../../styles/mixins.styles";
import {$POINT_BLUE} from "../../../../../styles/variables.types";

const HospitalCategoryModalDiv = styled.div`
  .category-container {
    h3 {
      ${fontStyleMixin({
        size: 12,
        weight: 'bold',
      })};
  
      span {
        ${fontStyleMixin({
          size: 12,
          weight: 'bold',
          color: $POINT_BLUE,
        })};
      }
    }

    ul {
      width: 430px;
      margin: 3px 0 0 -3px;
    }
  }
`;

export default HospitalCategoryModalDiv;