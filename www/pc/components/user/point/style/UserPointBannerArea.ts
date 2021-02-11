import styled from 'styled-components';
import {BannerDiv} from '../../../search/styleCompPC';
import {fontStyleMixin} from '../../../../styles/mixins.styles';
import {$POINT_BLUE} from '../../../../styles/variables.types';

const UserPointBannerArea = styled(BannerDiv)`
  padding-top: 158px;
  height: 277px;

  & > a {
    left: 45px;
    top: 154px;
  }

  div {
    position: relative;
    width: 680px;
    margin: auto;

    span {
      display: block;
      padding-bottom: 10px;
      ${fontStyleMixin({
        size: 15,
        weight: '300'
      })}
    }

    h2 {
      padding: 4px 0 2px;

      strong {
        vertical-align: middle;
        display: inline-block;
        padding-left: 7px;
        margin-top: -6px;
        ${fontStyleMixin({
          size: 33,
          weight: '300',
          color: $POINT_BLUE,
          family: 'Montserrat'
        })}

        img {
          width: 25px;
          display: inline-block;
          vertical-align: middle;
          margin-top: -5px;
        }
      }
    }

    p {
      text-align: center;
      ${fontStyleMixin({
        size: 15,
        weight: '300',
        color: '#999',
      })}
      
      span {
        display: inline-block;
        vertical-align: middle;
        margin-top: -3px;
        padding: 0;
        ${fontStyleMixin({
          size: 18,
          weight: '300',
          color: '#999',
          family: 'Montserrat'
        })}
        
        img {
          width: 15px;
          height: 15px;
          display: inline-block;
          vertical-align: middle;
          margin: -2px 2px 0 4px; 
        }
      }
    }

    a {
      top: auto;
      left: auto;
      bottom: -38px;
      right: -11px;
      font-size: 12px;
      text-decoration: underline;

      img {
        display: inline-block;
        vertical-align: middle;
        margin-top: -3px;
        width: 12px;
      }
    }
  }
`;

export default UserPointBannerArea;
