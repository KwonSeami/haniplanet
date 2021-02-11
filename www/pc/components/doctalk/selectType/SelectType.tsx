import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import TitleCard from '../../UI/Card/TitleCard';
import {staticUrl} from '../../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {$GRAY, $POINT_BLUE, $TEXT_GRAY, $WHITE, $BORDER_COLOR} from '../../../styles/variables.types';
import {TDoctalkSignType} from '../../../pages/doctalk/signup';

export const Li = styled.li<Pick<Props, 'type'>>`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  cursor: pointer;
  ${fontStyleMixin({
    size: 15,
    color: $TEXT_GRAY,
    weight: '600'
  })};
  
  &:hover {
    color: ${$GRAY};

    p {
      color: ${$GRAY};
    }
  }

  ${({type}) => `
    ${backgroundImgMixin({
      img: staticUrl(`/static/images/icon/icon-signup-${CONVERT_USER_TYPE[type]}.png`),
      size: '87px 69px',
      position: 'center 0%',
      color: $WHITE
    })};
    
    &.on {
      background-image: url(${staticUrl(`/static/images/icon/icon-signup-${CONVERT_USER_TYPE[type]}-on.png`)});
      background-color: ${$WHITE} !important;
      color: ${$POINT_BLUE};

      p {
        color: ${$POINT_BLUE};
      }
    }

    &:not(.on) {
      &:hover {
        background-image: url(${staticUrl(`/static/images/icon/icon-signup-${CONVERT_USER_TYPE[type]}-hover.png`)});
      }
    }
  `};

  p {
    ${fontStyleMixin({
      size: 10,
      color: $TEXT_GRAY,
      weight: '600'
    })};
  }
`;

const StyledTitleCard = styled(TitleCard)`
  padding: 13px 0 38px;
  text-align: center;

  h2 {
    text-align: left;
    ${fontStyleMixin({
      size: 19,
    })};
  }

  > p {
    padding: 2px 0 22px;
    text-align: left;
    ${fontStyleMixin({
      size: 11,
      color: $GRAY
    })};
  }

  ul li:first-child {
    &::after {
      content: '';
      position: absolute;
      top: 25px;
      right: 11px;
      width: 1px;
      height: 47px;
      background-color: ${$BORDER_COLOR};
    }
  }

  ${Li} {
    padding: 71px 55px 0;
    vertical-align: top;
  }
`;

const SelectTypeTitle = (
  <>
    <h2>회원 유형</h2>
    <p>회원 유형을 선택해주세요.</p>
  </>
);

const USER_SELECT_TYPE = {
  hospital: '한의 의료기관에 재직중인 한의사',
  haniplanet: '비재직 상태의 한의사',
};

const CONVERT_USER_TYPE = {
  hospital: 'doctor',
  haniplanet: 'doctor2'
};

interface Props {
  className?: string;
  type: TDoctalkSignType;
  setType: React.Dispatch<React.SetStateAction<TDoctalkSignType>>;
}

const SelectType = React.memo<Props>(({className, type, setType}) => (
  <StyledTitleCard
    className={className}
    title={SelectTypeTitle}
  >
    <ul>
      {(Object.keys(USER_SELECT_TYPE) as TDoctalkSignType[]).map((key) => (
        <Li
          type={key}
          className={cn({on: type === key})}
          onClick={() => setType(key)}
        >
          {USER_SELECT_TYPE[key]}
          {(key === 'haniplanet') && (
            <p>(한의플래닛 소속으로 연동됩니다)</p>
          )}
        </Li>
      ))}
    </ul>
  </StyledTitleCard>
));

export default SelectType;
