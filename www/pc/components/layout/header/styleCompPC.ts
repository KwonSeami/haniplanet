import styled from 'styled-components';
import {$WHITE, $BORDER_COLOR, $POINT_BLUE, $TEXT_GRAY} from '../../../styles/variables.types';
import {fontStyleMixin, inlineBlockMixin, heightMixin, backgroundImgMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';
import SearchBaseInput from '../../inputs/Input/SearchBaseInput';
import AutoComplete from '../../AutoComplete/';
import {AutocompleteUl} from '../../AutocompleteList';
import NoContentLi from '../../AutocompleteList/NoContentACLi';
import {HEADER_HEIGHT} from '../../../styles/base.types';
import Button from '../../inputs/Button';

interface IThemeType {
  themetype: string;
}

interface IStyledHeaderProps extends IThemeType {
  background: string;
  position: string;
}

export const StyledHeader = styled.header<IStyledHeaderProps>`
  position: ${({position}) => position};
  width: 100%;
  min-width: 1024px;
  height: ${HEADER_HEIGHT}px;
  padding: 14px 0 0 31px;
  box-sizing: border-box;
  top: 0;
  left: 0;
  z-index: 10000;
  
  // TODO: styled-component 내에서 조건식을 사용하는 경우, 렌더링이 많이 느려집니다.
  // TODO: 아래 부분은 className으로 대체되어야 합니다.
  background-color: ${({background}) => {
    if (background) { return background; }
    return $WHITE;
  }};
  ${({themetype}) => `border-bottom: 1px solid ${themetype === 'black' 
    ? `${$BORDER_COLOR}` 
    : 'rgba(255, 255, 255, 0.2)'}`};
    
  h1 {
    width: 175px;
    padding: 11px 0 0 3px;

    img {
      width: 100%;
    }
  }
  
  .right-menu {
    position: absolute;
    right: 19px;
    top: 14px;
  }
`;

export const InputOnButton = styled(Button)`
  vertical-align: middle;
  padding-top: 7px;
  text-align: right;

  img {
    width: 36px;
    margin-right: -6px;
  }
`;

export const StyledSearchBaseInput = styled(SearchBaseInput)<IThemeType>`
  position: relative;
  height: 46px;
  box-sizing: border-box;
  border-bottom: 1px solid ${$BORDER_COLOR};
  ${inlineBlockMixin(480)};

  input {
    width: 100%;
    height: 45px;
    padding-right: 57px;
    font-size: 14px;
    ${({themetype, theme}) => themetype && `
      color: ${theme.fontColor[themetype]};

      &::placeholder {
        color: ${theme.placeholdColor[themetype]};
      }
    `}
  }

  img {
    width: 36px;
    position: absolute;
    right: -6px;
    top: 7px;
  }
`;

export const StyledAutoComplete = styled(AutoComplete)`
  position: absolute;

  h2 {
    margin-bottom: -13px;
  }

  ${AutocompleteUl} li:first-child {
    margin-top: 13px;
  }
`;

export const StyledNoContentLi = styled(NoContentLi)`
  padding: 40px 0 67px !important;
`;

export const RightMenuUl = styled.ul`
  display: inline-block;
  vertical-align: middle;
  padding: 4px 0 0 5px;

  > li {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    padding-left: 14px;

    .avatar {
      display: inline-block;
      margin-right: 8px;
    }
    
    .help-icon {
      position: absolute;
      bottom: -28px;
      left: 8px;
      z-index: 1;
      display: block;
      width: 50px;
      height: 28px;
      box-sizing: border-box;
      ${backgroundImgMixin({
        img: staticUrl('/static/images/icon/icon-speech-bubble.png'),
        size: '100%'
      })};
      line-height: 30px;
      text-align: center;
      ${fontStyleMixin({
        size: 10,
        color: $WHITE
      })};

      &:hover {
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/icon-speech-bubble-hover.png'),
          size: '100%'
        })};
      }
    }

    .login-btn {
      margin-right: -1px;
    }
  }
`;

export const IconImg = styled.img `
  width: 35px;
  display: block;
`;

export const ButtonText = styled.button<IThemeType>`
  display: inline-block;
  vertical-align: middle;
  width: 65px;
  ${heightMixin(25)};
  border: 1px solid ${$BORDER_COLOR};

  a {
    ${fontStyleMixin({
      size: 12,
      weight: '600'
    })};
  }

  ${({themetype, theme}) => `
    border-color: ${theme.borderColor[themetype]};
    ${themetype === 'white' && `
      background-color: rgba(255, 255, 255, 0.3);
    `}

    a {
      color: ${theme.fontColor[themetype]} !important;
    }
  `}
`;

export const ButtonTextA = styled.a<IThemeType>`
  display: inline-block;
  vertical-align: middle;
  width: 68px;
  text-align: center;
  border: 1px solid ${$BORDER_COLOR};
  box-sizing: border-box;
  ${heightMixin(27)};
  ${fontStyleMixin({
    size: 12,
    weight: 'bold'
  })};
  cursor: pointer;
  
  ${({themetype, theme}) => `
    border-color: ${theme.borderColor[themetype]};
    ${themetype === 'white' && `
      background-color: rgba(255, 255, 255, 0.3);
      color: ${theme.fontColor[themetype]} !important;
    `}
  `}

  &.login-btn {
    ${({themetype, theme}) => `
      border-color: ${theme.borderColor[themetype]};
      ${themetype === 'white' && `
        background-color: ${$WHITE};
        color: ${$POINT_BLUE} !important;
      `}
    `};
  }
`;

export const FakeHeight = styled.div`
  height: ${HEADER_HEIGHT}px;
`;

export const StyledMainHeader = styled.header`
  position: relative;
  height: 178px;

  .header-top-wrapper {
    position: relative;
    width: 1090px;
    height: 124px;
    margin: 0 auto;

    h1 {
      position: absolute;
      width: 204px;
      top: 39px;
      left: 0;
  
      img {
        width: 100%;
      }
    }
  
    .right-menu {
      position: relative;
  
      .search-wrapper {
        position: absolute;
        top: 27px;
        left: 243px;
      }
  
      ${RightMenuUl} {
        position: absolute;
        top: 28px;
        right: 0;
      }
    }
  }
`;
