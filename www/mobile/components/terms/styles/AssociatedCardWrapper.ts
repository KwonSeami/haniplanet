import styled from "styled-components";
import {$WHITE, $GRAY, $BORDER_COLOR, $FONT_COLOR} from "../../../styles/variables.types";
import {fontStyleMixin} from "../../../styles/mixins.styles";

const AssociatedCardWrapper = styled.div`
  position: relative;
  max-width: 680px;
  margin: 0 auto;
  padding-bottom: 36px;
  box-sizing: border-box;
  background-color: ${$WHITE};

  .card-title {
    height: 166px;
    padding-top: 27px;
    box-sizing: border-box;
    background-color: #4a5560;

    h2 {
      text-align: center;
      ${fontStyleMixin({
        size: 22,
        weight: '600',
        color: $WHITE,
      })};
  
      p {
        margin-bottom: 4px;
        ${fontStyleMixin({
          size: 14,
          weight: '300',
          color: $WHITE,
        })};
        opacity: 0.7;
      }
    }
  }

  .card-info {
    margin: -65px 0 40px;

    .shinhancard-img-wrapper {
      width: 250px;
      margin: 0 auto;
    }

    .info-text {
      width: 284px;
      margin: 0 auto;

      span {
        ${fontStyleMixin({
          size: 18,
          weight: 'bold',
          color: '#6788ab',
        })};
      }
  
      strong {
        display: block;
        margin-top: 1px;
        line-height: 33px;
        ${fontStyleMixin({
          size: 26,
          weight: 'bold',
        })};
      }
  
      p {
        margin-top: 13px;
        ${fontStyleMixin({
          size: 18,
        })};
      }
  
      ul {
        margin-top: 5px;

        li {
          position: relative;
          padding-left: 12px;
          ${fontStyleMixin({
            size: 14,
            color: $GRAY,
          })};
  
          &::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: #d7d7d7;
          }
        }
      }

      .button {
        margin: 14px auto 0;

        img {
          width: 14px;
          margin: 4px 0 0 2px;
          vertical-align: top;
        }
      }
    }
  }

  .mobile-img {
    display: block;
  }

  .pc-img {
    display: none;
    width: calc(100% - 50px);
    margin: 0 25px;
  }

  .associated-notice {
    margin-top: 24px;
    padding: 0 15px;
    box-sizing: border-box;

    > p {
      ${fontStyleMixin({
        size: 16,
        weight: 'bold',
        color: $GRAY,
      })};
    }

    .associated-notice-top {
      padding: 13px 0 17px;
      border-bottom: 1px solid ${$BORDER_COLOR};
      box-sizing: border-box;

      li {
        position: relative;
        padding-left: 8px;
        line-height: 22px;
        ${fontStyleMixin({
          size: 13,
          color: $GRAY,
        })};

        p {
          ${fontStyleMixin({
            size: 13,
            color: $GRAY,
          })};
        }

        span {
          position: absolute;
          top: 0;
          left: 0;
        }

        ~ li {
          margin-top: 1px;
        }
      }
    }

    .associated-notice-bottom {
      padding-top: 18px;
      box-sizing: border-box;

      li {
        line-height: 24px;
        ${fontStyleMixin({
          size: 13,
          weight: 'bold',
        })};

        p {
          ${fontStyleMixin({
            size: 13,
            weight: 'bold',
          })};
        }
      }
    }
  }

  @media screen and (min-width: 680px) {
    .mobile-img {
      display: none;
    }

    .pc-img {
      display: block;
    }

    .associated-notice {
      padding: 0 30px;
    }
  }
`;

export default AssociatedCardWrapper;