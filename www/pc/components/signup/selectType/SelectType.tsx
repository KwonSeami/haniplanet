import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import TitleCard from '../../../components/UI/Card/TitleCard';
import {staticUrl} from '../../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {SignType} from '../../../pages/signup';
import {$GRAY, $POINT_BLUE, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';

export const Li = styled.li<Pick<Props, 'type'>>`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  cursor: pointer;

  ${fontStyleMixin({size: 15, color: $TEXT_GRAY, weight: 'bold'})};
  
  &:hover {
    color: ${$GRAY};
  }

  ${({type}) => `
    ${backgroundImgMixin({
      img: staticUrl(`/static/images/icon/icon-signup-${type}.png`),
      size: '87px 69px',
      color: $WHITE
    })};
    
    &.on {
      background-image: url(${staticUrl(`/static/images/icon/icon-signup-${type}-on.png`)});
      background-color: ${$WHITE} !important;
      color: ${$POINT_BLUE};
    }
    &:not(.on) {
      &:hover {
        background-image: url(${staticUrl(`/static/images/icon/icon-signup-${type}-hover.png`)});
      }
    }
  `};
`;

const StyledTitleCard = styled(TitleCard)`
  padding: 15px 0 40px;
  text-align: center;

  h2 {
    text-align: left;
    ${fontStyleMixin({size: 19, weight: '300'})};
  }

  p {
    padding: 2px 0;
    text-align: left;
    ${fontStyleMixin({size: 11, color: $GRAY})};
  }

  ${Li} {
    padding: 92px 68px 0;
  }
`;

const SelectTypeTitle = (
  <>
    <h2>회원 유형</h2>
    <p>회원 유형을 선택해주세요.</p>
  </>
);

const USER_SELECT_TYPE = {
  doctor: '한의사',
  student: '한의대생(학생)',
};

interface Props {
  className?: string;
  type: SignType;
  setType: React.Dispatch<React.SetStateAction<SignType>>;
}

const SelectType = React.memo<Props>(({className, type, setType}) => (
  <StyledTitleCard
    className={className}
    title={SelectTypeTitle}
  >
    <ul>
      {(Object.keys(USER_SELECT_TYPE) as SignType[]).map((key) => (
        <Li
          type={key}
          className={cn({on: type === key})}
          onClick={() => setType(key)}
        >
          {USER_SELECT_TYPE[key]}
        </Li>
      ))}
    </ul>
  </StyledTitleCard>
));

export default SelectType;
