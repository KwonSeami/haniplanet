import styled from 'styled-components';
import {fontStyleMixin, heightMixin} from '../../../../styles/mixins.styles';
import {$BORDER_COLOR, $TEXT_GRAY} from '../../../../styles/variables.types';

const MoaJoinBodyArea = styled.div`
  .apply-info-text {
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    background-color: #f8f6ee;
    border-top: 1px solid ${$BORDER_COLOR};
    ${heightMixin(50)};
    ${fontStyleMixin({size: 14, color: '#999'})};
  }

  .apply-form {
    width: 680px;
    margin: 52px auto auto;
    border-bottom: 1px solid ${$BORDER_COLOR};

    .responsive-li {
      border-top: 1px solid ${$BORDER_COLOR};
      padding-bottom: 0;

      & > h3.title {
        top: 16px;
        letter-spacing: -2px;
        ${fontStyleMixin({size: 19, weight: '300'})};
      }
    }

    .responsive-li > div {
      padding: 16px 0 30px 148px;

      span.title {
        display: inline-block;
        vertical-align: middle;
        padding-right: 2px;
        margin-top: -3px;
        ${fontStyleMixin({size: 11, weight: 'bold'})};
      }

      .applicant-list {
        display: inline-block;
        vertical-align: middle;
        padding-right: 50px;
        ${fontStyleMixin({size: 15, color: $TEXT_GRAY})};
      }

      .nickname-list {
        position: relative;
        padding: 10px 0 0 99px;

        input.input {
          display: inline-block !important;
          vertical-align: middle;
          width: calc(100% - 146px);
          margin-right: 8px;
          height: 44px;
          border-bottom: 1px solid ${$BORDER_COLOR} !important;
          ${fontStyleMixin({size: 14, color: $TEXT_GRAY})};
        }

        span.title {
          position: absolute;
          left: 0;
          top: 30px;
        }

        span.error-message {
          display: block;
          padding-top: 5px;
          ${fontStyleMixin({size: 11, color: $TEXT_GRAY})};
        }
      }

      textarea.answer-input {
        border: 1px solid ${$BORDER_COLOR};
        box-sizing: border-box;
        margin: 8px 0 12px;
        padding: 8px 12px;
        width: 100%;
        height: 180px;
        ${fontStyleMixin({size: 14, color: $TEXT_GRAY})};

        &::placeholder {
          color: ${$TEXT_GRAY};
        }
      }

      li.join-question-list {
        padding-top: 10px;

        h3 {
          font-size: 14px;
        }

        textarea.answer-input {
          height: 56px;
        }
      }
    }
  }
`;

export default MoaJoinBodyArea;
