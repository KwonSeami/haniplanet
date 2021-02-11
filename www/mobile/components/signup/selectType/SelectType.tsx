import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import TitleCard from '../../../components/UI/Card/TitleCard';
import {staticUrl} from '../../../src/constants/env';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {SignType} from '../../../pages/signup';
import {$GRAY, $POINT_BLUE, $BORDER_COLOR, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';

const StyledTitleCard = styled(TitleCard)`
  position: relative;
  padding: 15px 0 28px;
  text-align: center;
  border: 0;

  h2 {
    text-align: left;
    padding: 0 0 18px;
    ${fontStyleMixin({size: 17, weight: 'bold'})};
  }

  p {
    position: absolute;
    top: 17px;
    left: 76px;
    padding: 2px 0;
    text-align: left;
    ${fontStyleMixin({size: 11, color: $TEXT_GRAY})};
  }
  
  
  @media screen and (max-width: 680px) {
    padding: 15px 15px 28px;

    p {
      left: 95px;
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
  padding: 12px 15px;
  background-position: 100% 100%;
  background-size: 96px;
  background-color: #f6f7f9;
  border: 1px solid ${$BORDER_COLOR};
  text-align: left;

  ${fontStyleMixin({size: 15, color: $TEXT_GRAY, weight: 'bold'})};
  
  &:first-child {
    margin-right: 8px;
  }

  ${({type}) => `
    ${backgroundImgMixin({
      img: staticUrl(`/static/images/icon/icon-signup-${type}.png`),
      size: '87px 69px',
      color: $WHITE,
    })};
    
    &.on {
      background-image: url(${staticUrl(`/static/images/icon/icon-signup-${type}-on.png`)});
      background-color: ${$WHITE} !important;
      color: ${$POINT_BLUE};
    }
    &:not(.on) {
      &:hover {
        color: ${$GRAY};
        background-image: url(${staticUrl(`/static/images/icon/icon-signup-${type}-hover.png`)});
      }
    }
  `};
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

const SelectType: React.FC<Props> = ({className, type, setType}) => (
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
);

export default React.memo<Props>(SelectType);
