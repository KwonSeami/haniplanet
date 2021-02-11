import styled from 'styled-components';
import Alert from '../../common/popup/Alert';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {Close, TitleDiv} from '../../common/popup/base/TitlePopup';
import {$BORDER_COLOR, $GRAY} from '../../../styles/variables.types';

const StyledNewRatingAlert = styled(Alert)`
  ${fontStyleMixin({
    size: 14
  })};

  ${TitleDiv} {
    width: 330px;
    padding: 29px 0 9px;
    text-align: center;
    border: 0;

    h2 {
      ${fontStyleMixin({
        size: 21,
        weight: '300'
      })};
    }
  }

  .popup-child > p {
    text-align: center;
    ${fontStyleMixin({
      color: $GRAY
    })};
  }

  ${Close} {
    right: 13px;
    top: 13px
  }

  .inner-add-popup {
    padding: 15px 20px 0;

    .select-box {
      width: auto;
      padding: 0;
      margin: 4px 0 2px;

      p img {
        right: 0;
        opacity: 0.3;
      }
    }

    .input {
      width: 100%;
      height: 44px;
      border-bottom: 1px solid ${$BORDER_COLOR};
      margin-bottom: 4px;
      ${fontStyleMixin({
        size: 14
      })};

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  button {
    margin-bottom: 30px;
  }
`;

export default StyledNewRatingAlert;