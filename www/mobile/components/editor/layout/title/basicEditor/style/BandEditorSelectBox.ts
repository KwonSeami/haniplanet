import styled from 'styled-components';
import SelectBox from '../../../../../inputs/SelectBox';
import {staticUrl} from '../../../../../../src/constants/env';
import {backgroundImgMixin} from '../../../../../../styles/mixins.styles';
import {$BORDER_COLOR} from '../../../../../../styles/variables.types';

const BandEditorSelectBox = styled(SelectBox)`
  position: relative;
  display: inline-block;
  width: 120px;
  height: 42px;
  margin-top: 34px;
  border-bottom: 0;

  p {
    position: relative;
    padding-left: 23px;
    font-size: 15px;
    text-decoration: underline;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-49%);
      width: 17px;
      height: 17px;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/icon-eye.png'),
        size: '100%',
      })};
    }

    img {
      right: 10px;
    }
  }
  
  ul {
    left: -2px;
    margin-top: 0;

    li {
      margin-top: 0px;
      border-top-width: 0;
      box-sizing: border-box;
      background-color: #fff;

      &:first-child {
        border-top-width: 1;
        border-top: 1px solid ${$BORDER_COLOR};
      }
    }
  }

  &::-ms-expand {
    display: none;
  }
`;

export default BandEditorSelectBox;