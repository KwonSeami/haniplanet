import styled from 'styled-components';
import {$BORDER_COLOR, $POINT_BLUE, $WHITE, $TEXT_GRAY, $FONT_COLOR} from '../../../styles/variables.types';
import {fontStyleMixin, heightMixin} from '../../../styles/mixins.styles';
import Label from '../../UI/tag/Label';
import FileInput from '../../../components/inputs/FileInput';

export const ProfileItemLi = styled.li`
  position: relative;
  width: 100%;
  padding: 22px 0 13px;
  font-size: 16px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR};

  .status-date {
    display: block;
    padding-bottom: 9px;
    ${fontStyleMixin({
      size: 11,
      weight: 'bold'
    })}
  }

  & > strong {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-top: -5px;
    padding-right: 12px;
    ${fontStyleMixin({
      size: 15,
      color: '#999'
    })}

    &::after {
      content: '';
      width: 1px;
      height: 6px;
      background-color: ${$BORDER_COLOR};
      position: absolute;
      right: 6px;
      top: 50%;
      margin-top: -3px;
    }
  }

  &.dissertation-item {
    padding-left: 24px;
    
    img {
      width: 12px;
      position: absolute;
      left: 3px;
      top: 26px;
    }
  }

  &.skill-item {
    h3 {
      ${fontStyleMixin({
        size: 15,
        weight: '600'
      })}
        
      strong {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        padding-right: 13px;
        margin-top: -3px;
        ${fontStyleMixin({
          size: 15,
          color: $POINT_BLUE
        })}
          
        &::after {
          position: absolute;
          top: 50%;
          margin-top: -3px;
          right: 6px;
          display: block;
          content: '';
          width: 1px;
          height: 6px;
          background-color: ${$BORDER_COLOR};
        }
      }
      
      .badge {
        display: inline-block;
        vertical-align: middle;
        margin: -4px 0 0 5px;
        width: 20px;
        ${heightMixin(20)}
        border-radius: 50%;
        text-align: center;
        ${fontStyleMixin({
          size: 10,
          weight: 'bold',
          color: $WHITE
        })}
        background-color: ${$POINT_BLUE};
      }
    }

    p {
      padding-top: 7px;
      ${fontStyleMixin({
        size: 14,
        color: '#999'
      })}
   }
  }
`;

 export const StyledLabel = styled(Label)`
  min-width: 33px;
  margin: -5px 2px 0 3px;
`;

 export const SkillUl = styled.ul`
  padding-top: 6px;
`; 

export const LinkSpan = styled.p`
  position: absolute;
  left: 250px;
  top: 10px;
  display: block;
  ${fontStyleMixin({
    size: 13,
    color: $TEXT_GRAY,
  })};
  
  @media screen and (max-width: 680px) {
    position: static;
    top: auto;
    left: auto;
    padding: 4px 0 1px;
    font-size: 11px;
  }
`;

export const P = styled.p`
  font-size: 11px;
  padding-top: 7px;
  color: ${$TEXT_GRAY};

  em {
    font-style: normal;
    color: ${$FONT_COLOR};
  }
  
  @media screen and (max-width: 680px) {
    padding-top: 0;
  }
`;

export const StyledTextButton = styled.button`
  position: relative;
  display: inline-block;
  
  ${fontStyleMixin({
    size: 13,
    weight: '600',
    color: $POINT_BLUE,
  })};

  &::after {
    content: '';
    position: absolute;
    display: block;
    bottom: 0px;
    width: calc(100% - 14px);
    border-bottom: 1px solid ${$POINT_BLUE};
  }

  &.on {
    img {
      transform: rotate(180deg);
    }
  }

  img {
    vertical-align: 1px;
    width: 11px;
    height: 6px;
    margin-left: 3px;
  }
`;

export const StyledFileInput = styled(FileInput)`
  @media screen and (max-width: 680px) {
    .file-button {
      width: 100%;
      margin-top: 5px;
    }
  }
`;

export const Div = styled.div`
  @media screen and (max-width: 680px) {
    text-align: center;
  }
`;