import styled from "styled-components";
import {fontStyleMixin} from "../../../../../styles/mixins.styles";
import {WorkInfoDiv} from "../../../../profile/form/ProfileJobForm";
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE} from "../../../../../styles/variables.types";

const HospitalMedicalFormDiv = styled.div`
  position: relative;
  border: 1px solid ${$BORDER_COLOR};
  border-top: 1px solid ${$FONT_COLOR};
  box-sizing: border-box;
  
  #treatment {
    position: absolute;
    top: -122px;
    left: 0;
  }
  
  #medicalTeam {
    position: absolute;
    top: 530px;
    left: 0;
  }
  
  #location-map {
    position: absolute;
    top: 1550px;
    left: 0;
  }

  > ul {
    > li {
      position: relative;
      min-height: 62px;
      padding: 20px 0 20px 230px;
      margin: 0 30px;
      border-bottom: 1px solid #eeeee0;
      box-sizing: border-box;

      &:nth-child(5) {
        padding: 20px 0 2px;
        margin: 0;
        border-top: 1px solid ${$FONT_COLOR};
        border-bottom: 1px solid ${$FONT_COLOR};

        &:after {
          content: '';
          position: absolute;
          z-index: -1;
          top: 64px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: #eee;
        }

        > h3 {
          left: 30px;
        }

         > span {
          width: inherit;
          margin: 0 30px 0 0;
          float: right;
          ${fontStyleMixin({size: 14})};

          &.toggle {
            img {
              transform: rotate(180deg);
            }
          }

          img {
            width: 15px;
            margin-left: 5px;
            vertical-align: middle;
          }
        }

        > .profile-job-form {
          margin-top: 42px;
        }
      }

      &:last-child {
        padding: 20px 0;
        border-bottom: none;
      }

      > h3 {
        position: absolute;
        top: 22px;
        left: 0;
        ${fontStyleMixin({size: 14, weight: 'bold'})};

        &::after {
          content: '*';
          position: absolute;
          top: -3px;
          right: -9px;
          color: #f32b43;
        }

        img {
          width: 24px;
          margin: -3px 6px 0 0;
          vertical-align: middle;
        }
      }
      
      > p {
         text-align: left;
         margin-bottom: 6px;
         ${fontStyleMixin({size: 11, color: $POINT_BLUE})};
      }

      ${WorkInfoDiv} {
        top: 0;
        left: -1px;
        border-top: 1px solid ${$BORDER_COLOR};
        border-bottom: none;

        .profile {
          border-bottom: none;
        }
      }

      .availability {
        li {
          display: inline-block;
          margin-right: 30px;

          label {
            padding-left: 25px;
            margin-top: -2px;
          }

          span {
            top: 2px;
          }
        }
      }
    }
  }
`;

export default HospitalMedicalFormDiv;