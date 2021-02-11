import styled from 'styled-components';
import {fontStyleMixin, heightMixin, inlineBlockMixin } from '../../../styles/mixins.styles';
import {$WHITE, $BORDER_COLOR, $TEXT_GRAY} from '../../../styles/variables.types';

const SignUpBtnHeight = 34;

const LoginFormFrame = styled.div`
  max-width: 328px;
  margin: 0 auto;
  box-sizing: border-box;

  .login-form {
    margin-bottom: 18px;
    
    li {
      position: relative;
      background-color: #f5f5f5;
      border-radius: 24px;
      padding: 0 15px;

      ~ li {
        margin-top: 6px;
      }

      .login-error::placeholder {
        color: #ea6060;
      }
    }
  }

  .login-check-info {
    position: relative;
    margin-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid ${$BORDER_COLOR};

    ul {
      position: absolute;
      top: 0;
      right: 1px;

      li {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        padding-left: 17px;

        &:first-child::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -9px;
          transform: translateY(-50%);
          width: 1px;
          height: 10px;
          background-color: ${$TEXT_GRAY};
        }

        a {
          ${fontStyleMixin({
            size: 12,
            color: $TEXT_GRAY
          })};
        }
      }
    }
  }

  input {
    box-shadow: 0 0 0 1000px #f5f5f5 inset !important;
    
    &:-webkit-autofill,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:hover,
    &:-internal-autofill-selected {
      box-shadow: inherit !important;
    }
  }
  
  .sign-up-wrapper {
    display: flex;
    -ms-display: flexbox;
    justify-content: space-between;
    margin: 35px 0 64px;

    p {
      flex: 0 0 auto;
      text-align: center;
      font-size: 14px;
      ${heightMixin(SignUpBtnHeight)};
    }

    a {
      flex: 0 0 auto;
      display: inline-block;
      width: 94px;
      ${heightMixin(SignUpBtnHeight)};
      text-align: center;
      background-color: #499aff;
      ${fontStyleMixin({
        size: 15,
        color: $WHITE,
      })};

      img {
        ${inlineBlockMixin(12)};
        margin: -3px 0 0 2px;
      }
    }
  }
`;

export default LoginFormFrame;

