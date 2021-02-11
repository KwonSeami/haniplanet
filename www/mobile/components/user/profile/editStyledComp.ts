import styled from 'styled-components';
import TextMsgLi from '../../profile/style/TextMsgLi';
import ProfileDiv from '../../profile/style/ProfileDiv';
import ProfileListUl from '../../profile/style/ProfileListUl';
import MarketingDiv from '../../profile/style/MarketingDiv';
import SecessionDiv from '../../profile/style/SecessionDiv';
import ProfileButtonGroup from '../../profile/style/ProfileButtonGroup';
import NoContentText from '../../profile/style/NoContentText';
import StyledSelectBox from '../../profile/style/common/StyledSelectBox';
import StyledButtonGroup from '../../profile/style/StyledButtonGroup';
import StyledInput from '../../profile/style/common/StyledInput';
import StyledButton from '../../profile/style/StyledButton';
import AvatarDiv from '../../profile/style/AvatarDiv';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import {Div} from '../../UI/ResponsiveLi/ResponsiveLi';
import {LicenseUl} from '../../profile/form/ProfileLicenseForm';
import {ProfileCardDiv} from '../../UI/Card/ProfileCard';
import {StyledFormInput} from '../../profile/form/ProfileEduForm';
import {ToolFormDiv} from '../../profile/form/ProfileToolForm';
import {$BORDER_COLOR, $FONT_COLOR, $POINT_BLUE, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';

export const TabUl = styled.ul`
  position: relative;
  z-index: 1;
  max-width: 680px;
  height: 46px;
  padding: 12px 0 10px;
  box-sizing: border-box;
  margin: auto;

  li {
    float: left;
    margin-right: 12px;

    a {
      ${fontStyleMixin({size: 16, color: $TEXT_GRAY, weight: '300'})}
    }
    
    &.on a {
      border-bottom: 1px solid ${$POINT_BLUE};
      ${fontStyleMixin({weight: '600', color: $FONT_COLOR})}
    }
  }

  @media screen and (max-width: 680px) {
    padding: 12px 15px 10px;
  }
`;

export const InfoText = styled.p`
  background-color: #f5f7f9;
  text-align: center;
  font-size: 12px;
  padding: 12px 0;

  span {
    display: block;
    padding-bottom: 3px;
    ${fontStyleMixin({size: 11, color: $POINT_BLUE})}
  }
`;

/* 기본정보 */
export const Ul = styled.ul`
  @media screen and (max-width: 680px) {
    ${ProfileDiv} {
      & > div {
        width: 100%;
        padding: 27px 17px 15px;

        h2 {
          max-width: calc(100% - 108px);
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .profile-wrapper, p {
          margin-left: 90px;
        }

        & > span {
          position: static;
          padding: 77px 0 0;
        }
      }
    }

    ${AvatarDiv} {
      top: 17px;
      left: 15px;
    }

    ${ProfileButtonGroup} {
      top: auto;
      bottom: 55px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 14px;

      li {
        margin: 0 3px;
        width: calc(50% - 6px);
        padding: 0;
      }

      button {
        width: 100%;
        height: 37px;
        font-size: 12px;
        background-color: ${$WHITE};
        border: 0;

        &.left-button {
          color: ${$POINT_BLUE};
        }
      }
    }

    ${ProfileListUl} {
      width: 100%;
      padding: 24px 0 0;

      li {
        padding: 0 15px 22px;
      }

      h3 {
        position: static;
      }

      ${Div} {
        padding: 0;
      }
    }

    ${TextMsgLi} span {
      color: ${`${$POINT_BLUE} !important`};
    }

    ${StyledInput} {
      width: 100%;

      &.has-select {
        width: calc(100% - 123px);
      }
    }

    ${StyledButton} {
      vertical-align: bottom;
    }

    ${StyledSelectBox} {
      width: 113px;
      margin: -1px 0 6px;

      p {
        ${heightMixin(44)};
      }

      ul li {
        padding: 0 14px;
      }
    } 
    
    .has-button {
      ${StyledInput} {
        width: calc(100% - 123px);
      }

      ${StyledSelectBox} {
        position: relative;
        float: right;
      }
    }

    ${MarketingDiv} {
      width: 100%;
      border-right: 0;
      border-left: 0;
      padding: 14px 14px 26px;

      h2 {
        position: static;
        padding-bottom: 12px; 
        ${fontStyleMixin({size: 18, weight: 'normal'})}

        span {
          display: inline-block;
          padding-left: 3px;
        }
      }

      li {
        padding-top: 16px;
      }
    }

    ${SecessionDiv} {
      width: 100%;
      padding: 14px 15px 30px;

      h2 {
        position: static;
        padding-bottom: 12px; 
        ${fontStyleMixin({size: 18, weight: 'normal'})}
      }

      button {
        width: 100%;
      }
    }

    ${StyledButtonGroup} {
      width: 100%;

      li {
        margin: 0 5px;
      }

      button {
        width: 128px;
        height: 33px;
        border-radius: 17px;
      }
    }
  }
`;

export const ProfileInfoLi = styled.li`
  @media screen and (max-width: 680px) {
    ${ProfileCardDiv} {
      width: 100%;
      padding: 15px 15px 10px;
      border-top: 0;
      border-bottom: 8px solid #f2f3f7;

      h2 {
        position: static;
        padding-bottom: 33px;
        font-size: 18px;

        span {
          padding: 9px 148px 0 2px;
        }
      }

      ${StyledSelectBox} {
        right: 15px;
        top: 5px;
      }

      li {
        .select-box {
          margin: 0 12px 0 0;
          width: 113px;
          vertical-align: bottom;

          &.edu-select {
            margin-bottom: 11px;
          }
        }

        &:last-child {
          padding-bottom: 0;
        }

        li.date {
          padding-right: 18px;
        }

        .years {
          text-align: center;
          width: 50px !important;
          margin-right: 4px !important;
        }

        .month {
          text-align: center;
          width: 39px !important;
        }
      }

      ${StyledFormInput} {
        width: 100%;

        &.has-select {
          width: 100%;
        }
      }

      .btn-group {
        padding: 8px 0 20px;

        li {
          // width: 100%; 
          padding: 0;
        }

        button {
          // width: 100%;
          // height: 37px;
        }
      }
    }

    ${LicenseUl} {
      margin-top: -12px;
      & > li > h3 {
        display: block;
      }
    }

    .skill {
      padding-top: 6px;

      li {
        display: block;
        padding: 0 0 11px;

        h3 {
          width: 70px;
          box-sizing: border-box;
          padding: 0 0 15px 0;
        }
      }
    }

    ${ToolFormDiv} {
      .btn-group {
        position: static;
      }
    }
  }
`;

export const HospitalEditLi = styled.li`
  & > h2 {
    padding: 13px 15px;
    font-size: 18px;
    border-top: 1px solid ${$BORDER_COLOR};
  }
  
  ${InfoText} {
    display: none;
  }

  ul {
    width: 100%;
    // padding-top: 67px;

    // span {
    //   width: 100%;
    //   padding: 0 15px;
    //   box-sizing: border-box;
    // }
  }

  ${NoContentText} {
    width: 100%;
    padding: 80px 0 250px;
    border: 0;
  }
`;
