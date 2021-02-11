import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import TitleCard from '../../../components/UI/Card/TitleCard';
import {staticUrl} from '../../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {$POINT_BLUE, $BORDER_COLOR, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';
import {TDoctalkSignType} from '../../../pages/doctalk/signup';

const StyledTitleCard = styled(TitleCard)`
  position: relative;
  padding: 15px 0 28px;
  text-align: center;
  border: 0;

  h2 {
    text-align: left;
    padding: 0 0 18px;
    ${fontStyleMixin({
      size: 17,
      weight: 'bold'
    })};
  }

  > p {
    position: absolute;
    top: 15px;
    left: 76px;
    padding: 2px 0;
    text-align: left;
    ${fontStyleMixin({
      size: 12,
      color: $TEXT_GRAY
    })};
  }
  
  
  @media screen and (max-width: 680px) {
    padding: 15px 15px 28px;

    p {
      left: 87px;
    }
  }
`;

export const Li = styled.li<Pick<Props, 'type'>>`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  
  width: calc(50% - 4px);
  height: 122px;
  padding: 9px;
  border: 1px solid ${$BORDER_COLOR};
  text-align: left;
  ${fontStyleMixin({
    size: 17,
    color: $TEXT_GRAY,
    weight: 'bold'
  })};
  
  &:first-child {
    margin-right: 8px;
  }

  ${({type}) => `
    ${backgroundImgMixin({
      img: staticUrl(`/static/images/icon/icon-signup-${CONVERT_USER_TYPE[type]}.png`),
      size: '87px 69px',
      position: '91% 85%',
      color: '#f6f7f9',
    })};
    
    &.on {
      background-image: url(${staticUrl(`/static/images/icon/icon-signup-${CONVERT_USER_TYPE[type]}-on.png`)});
      background-color: ${$WHITE} !important;
      color: ${$POINT_BLUE};

      p {
        color: ${$POINT_BLUE};
      }
    }
  `};

  p {
    padding-right: 40px;
    ${fontStyleMixin({
      size: 14,
      color: $TEXT_GRAY
    })};
  }

  @media screen and (max-width: 680px) {
    ${fontStyleMixin({
      size: 12,
      color: $TEXT_GRAY,
      weight: 'bold'
    })};

    p {
      ${fontStyleMixin({
        size: 11,
        color: $TEXT_GRAY
      })};
    }
  }
`;

const SelectTypeTitle = (
  <>
    <h2>회원 유형</h2>
    <p>회원 유형을 선택해주세요.</p>
  </>
);

const USER_SELECT_TYPE = {
  hospital: <>한의 의료기관에<br/>재직 중인 한의사</>,
  haniplanet: '비 재직 상태의 한의사',
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
