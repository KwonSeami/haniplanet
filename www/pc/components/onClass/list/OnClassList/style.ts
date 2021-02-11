// 스타일 파일들 전부 네이밍입니다. 네이밍 어떻게 해야할까요... 기존처럼 styleCompPC?

import styled from 'styled-components';
import ButtonGroup from '../../../inputs/ButtonGroup';
import {heightMixin, fontStyleMixin, backgroundImgMixin} from '../../../../styles/mixins.styles';
import {$FONT_COLOR, $POINT_BLUE, $WHITE, $TEXT_GRAY} from '../../../../styles/variables.types';
import { staticUrl } from '../../../../src/constants/env';

type TabType = 'status' | 'member_status';

interface IButtonProps {
  on: TabType;
}

interface IAvatarProps {
  avatar: string;
}

export const StyledButtonGroup = styled(ButtonGroup)<IButtonProps>`
  position: absolute;
  top: 0;
  right: 0;

  li {
    padding-left: 8px;
  }

  button {
    position: relative;
    width: 150px;
    ${heightMixin(42)};
    border-radius: 29px;
    text-align: left;
    box-sizing: border-box;
    padding: 0 23px;
    border: 1px solid ${$FONT_COLOR};
    ${fontStyleMixin({
      size: 16,
      weight: '300',
    })};

    ${({on}) => on === 'member_status' ? (`
      &.left-button {
        border-color: ${$POINT_BLUE};
        color: ${$POINT_BLUE};

        strong, span {
          color: ${$POINT_BLUE};
        }
      }
    `) : on === 'status' && (`
      &.right-button {
        border-color: ${$POINT_BLUE};
        color: ${$POINT_BLUE};

        strong, span {
          color: ${$POINT_BLUE};
        }
      }
    `)}

    span {
      position: absolute;
      right: 28px;
      top: -1px;
      text-decoration: underline;
      ${fontStyleMixin({
        size: 17,
        weight: '300',
        family: 'Montserrat'
      })};
    }
  }
`;

export const ListWrapper = styled.div`
  .pagination {
    padding: 33px 0 29px;
  }
`;

export const ListItem = styled.li<IAvatarProps>`
  width: 261px;
  display: inline-block;
  margin: 15px 0 0 15px;
  transition: 0.2s;

  &:nth-of-type(4n+1) {
    margin-left: 0;
  }

  &:nth-of-type(-n+4) {
    margin-top: 0;
  }

  &:hover {
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);

    .item-img {
      &::after {
        opacity: 0.3;
      }

      span:last-of-type {
        opacity: 1;
      }
    }
  }

  .item-img {
    position: relative;
    width: 100%;
    height: 162px;
    box-sizing: border-box;
    ${({avatar}) => backgroundImgMixin({
      img: avatar || staticUrl('/static/images/banner/img-pick-writer-bg1.png'),
    })};
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0;
      transition: 0.1s;
    }

    &.off::after {
      background-color: #a1a1a1;
      opacity: 0.5;
    }

    span {
      position: absolute;
      z-index: 1;

      &:first-of-type {
        top: 10px;
        left: 10px;
        height: 25px;
        padding-right: 11px;
        background-color: ${$WHITE};
        border-radius: 19px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        ${fontStyleMixin({
          size: 12,
          weight: '600',
        })};

        img {
          width: 25px;
          margin-right: 4px;
          vertical-align: middle;
        }

        b {
          color: ${$POINT_BLUE};
        }
      }

      &:last-of-type {
        bottom: 23px;
        right: 23px;
        color: ${$WHITE};
        opacity: 0;
        transition: 0.2s;
        ${fontStyleMixin({
          size: 12,
          weight: 'bold',
          color: $WHITE,
        })};

        img {
          display: block;
          width: 58px;
        }
      }
    }
  }

  .item-title {
    height: 80px;
    padding: 14px 15px 22px;
    background-color: ${$WHITE};
    box-sizing: border-box;

    h2 {
      margin-bottom: 6px;
      ${fontStyleMixin({
        size: 15,
        weight: '600'
      })};
    }

    ul {
      li {
        display: inline-block;
        vertical-align: middle;
        ${fontStyleMixin({
          size: 12,
          color: $TEXT_GRAY,
        })};

        span {
          color: ${$FONT_COLOR};

          &.new-story {
            color: ${$POINT_BLUE};
          }
        }
      }
    }
  }
`;

export const NoContent = styled.div`
  text-align: center;

  .no-content-img {
    width: 104px;
    display: block;
    margin: auto;
  }

  h2 {
    padding: 14px 0 5px;
    ${fontStyleMixin({
      size: 20,
      weight: '300',
    })};
  }

  p {
    ${fontStyleMixin({
      size: 14,
      color: '#c7bfb7',
    })};

    img {
      width: 14px;
      display: block;
      margin: auto;
      padding-top: 23px;
    }
  }
`;