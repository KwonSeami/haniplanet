import styled from 'styled-components';
import {fontStyleMixin} from '../../../../../styles/mixins.styles';
import {$GRAY, $TEXT_GRAY, $WHITE} from '../../../../../styles/variables.types';

const HospitalInfoFormDiv = styled.div`
  position: relative;
  margin-bottom: 30px;

  > p {
    position: absolute;
    top: -26px;
    left: 1px;
    ${fontStyleMixin({size: 11, color: $WHITE})};

    span {
      ${fontStyleMixin({size: 11, color: '#f32b43'})};
    }
  }
  
  button.hospital-delete {
    position: absolute;
    top: -46px;
    right: 1px;
    
    &:hover {
      border-color: #d8d8d8;
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    img {
      width: 15px;
      margin-right: 1px;
      vertical-align: middle;
    }
  }

  .hospital-title-content {
    .thumb-area {
      display: inline-block;
      width: 465px;
      vertical-align: top;
      background-color: ${$WHITE};

      .thumb {
        width: 100%;
        height: 310px;
        border: 1px solid #eee;
        box-sizing: border-box;
        text-align: center;
        background-size: cover;
        background-position: center;

        &.is-image {
          position: relative;

          &:hover {
            background-color: rgba(0, 0, 0, 0.3);
            background-blend-mode: multiply;

            @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
              &::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #000;
                opacity: 0.3;
              }
            }
          }
        }

        &:hover {
          img {
            opacity: 1;

            &.add-main-image {
              opacity: 1;
            }
          }

          span {
            ${fontStyleMixin({size: 14, color: '#999'})};
          }
        }

        img.add-main-image {
          position: relative;
          z-index: 1;
          width: 44px;
          margin-top: 134px;
          opacity: 0;
        }
        

        > img {
          display: block;
          width: 52px;
          margin: 114px auto 4px;
          opacity: 0.5;
        }

        span {
          position: relative;
          margin-left: 6px;
          ${fontStyleMixin({size: 14, color: $TEXT_GRAY})};

          &::before {
            content: '*';
            position: absolute;
            top: -2px;
            left: -8px;
            color: #f32b43;
          }
        }
      }

      img {
        width: 100%;
      }

      > p {
        padding-left: 12px;
        margin-top: 21px;
        border-left: 4px solid #ecedef;
        line-height: 21px;
        ${fontStyleMixin({size: 12, color: $TEXT_GRAY})};
      }
    }

    .info-area {
      display: inline-block;
      width: 535px;
      height: 100%;
      padding: 24px 31px 0;
      background-color: ${$WHITE};
      box-sizing: border-box;
      vertical-align: middle;

      > ul {
        > li {
          position: relative;
          margin-bottom: 23px;

          > h3 {
            position: relative;
            display: inline-block;
            ${fontStyleMixin({size: 14, weight: 'bold'})};

            &.must::after {
              content: '*';
              position: absolute;
              top: -2px;
              right: -8px;
              color: #f32b43;
            }
          }

          ul.tag-list {
            margin: 7px 0 0 -3px;
          }

          .tag-input {
            input {
              ${fontStyleMixin({size: 15})};
            }

            img.clear-button {
              right: 10px;
            }
          }

          > p {
            display: inline-block;
            margin-left: 10px;
            ${fontStyleMixin({size: 13, color: $GRAY})};
          }

          .search-address:hover {
            border: 1px solid ${$GRAY};
          }
        }
      }

      .medical-field-wrapper {
        h3 {
          ${fontStyleMixin({size: 14, weight: 'bold'})};
        }
      }
    }
  }
`;

export default HospitalInfoFormDiv;
