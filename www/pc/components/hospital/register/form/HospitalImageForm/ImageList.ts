import styled from 'styled-components';
import {$BORDER_COLOR} from '../../../../../styles/variables.types';

const ImageList = styled.ul`
  li {
    position: relative;
    border: 1px solid ${$BORDER_COLOR};
    display: inline-block;
    box-sizing: border-box;

    &.imgs-explain {
      width: 100%;
      height: 100%;
      border: none;
    }

    img.delete-btn {
      position: absolute;
      top: 3px;
      right: 3px;
      width: 25px;
      height: 25px;
    }

    img.add-btn {
      position: absolute;
      top: calc(50% - 26px);
      left: calc(50% - 26px);
      width: 52px;
    }

    .title-img-box {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: 50%;
      background-repeat: no-repeat;
    }
  }
`;

export default ImageList;
