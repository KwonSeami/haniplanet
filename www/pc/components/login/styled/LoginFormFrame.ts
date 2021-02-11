import styled from 'styled-components';
import {fontStyleMixin, heightMixin, inlineBlockMixin} from '../../../styles/mixins.styles';
import {$BORDER_COLOR, $FONT_COLOR, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';

const SignUpBtnHeight = 34;

const LoginFormFrame = styled.div`
  width: 330px;
  margin: auto;
  padding: 0 0 89px;

  .login-form {
    margin-bottom: 15px;
    
    li {
      padding: 0 15px;
      border-radius: 24px;
      background-color: #f5f5f5;

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
    padding: 13px 0 19px;
    border-bottom: 1px solid ${$BORDER_COLOR};

    ul {
      position: absolute;
      right: 1px;
      top: 13px;

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

        &:hover a {
          text-decoration: underline;
          color: ${$FONT_COLOR};
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
    margin-top: 35px;

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
