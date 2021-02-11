import React from 'react';
import styled, {keyframes} from 'styled-components';
import {IAcCompProps} from '../../inputs/Input/SearchBaseInput';
import {AutocompleteUl as AutoCompleteUl} from '../../AutocompleteList';
import cn from 'classnames';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';
import KeyWordHighlight from '../../common/KeyWordHighlight';
import {$POINT_BLUE, $TEXT_GRAY, $WHITE} from '../../../styles/variables.types';

const DivAni = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const AutoCompleteUlAni = keyframes`
  from {
    transform: translateY(-25px);
  }

  to {
    transform: translateY(0);
  }
`;

const Div = styled.div`
  position: absolute;
  z-index: 200;
  top: 50px;
  left: 0;
  width: 100%;
  height: calc(100vh - 104px);
  background-color: ${$WHITE};
  box-sizing: border-box;
  animation: ${DivAni} 0.3s forwards;
`;

const StyledAutoCompleteUl = styled(AutoCompleteUl)`
  border-top: none;
  background-color: transparent;
  animation: ${AutoCompleteUlAni} 0.4s forwards;
`;

const autoCompleteIcon = {
  location: staticUrl('/static/images/icon/icon-location-blue.png'),
  address: staticUrl('/static/images/icon/icon-hospital-blue.png'),
  normal: staticUrl('/static/images/icon/icon-hospital-search.png'),
  category: staticUrl('/static/images/icon/icon-star-blue.png')
}

const AutoCompleteLi = styled.li<Pick<IHospitalAcList, 'type'>>`
  height: 44px !important;
  padding: 11px 35px !important;
  ${({type}) => backgroundImgMixin({
    img: autoCompleteIcon[type],
    size: '20px',
    position: '10px'
  })};

  span {
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    font-weight: 600;

    &.additional-info {
      padding-left: 10px;
      ${({type}) => fontStyleMixin({
        size: 12,
        color: type === 'category'
          ? $POINT_BLUE
          : $TEXT_GRAY
      })};
    }
  }
`;

interface IHospitalAcList {
  name: string;
  additional?: string;
  x?: string;
  y?: string;
  type: 'location' | 'address' | 'category' | 'normal';
  id?: HashId;
}

interface Props extends Omit<IAcCompProps, 'acList'> {
  acList: IHospitalAcList[];
}

const HospitalAutoCompleteList = React.memo(
  React.forwardRef<HTMLUListElement, Props>(
    ({
      acList,
      keyword,
      onSelectAutoList,
      className,
      children,
      queryKey,
      focusedRow
    }, ref) => (
      <Div
        ref={ref} //@TODO: <StyledAutoCompleteUl>에 있던 ref를 이쪽으로 옮겼습니다. 수정 필요합니다.
        className="hospital-autocomplete-list"
      >
        <StyledAutoCompleteUl
          className={className}
        >
          {acList.map((item, index) => {
            const text = queryKey ? item[queryKey] : item;
      
            return (
              <AutoCompleteLi
                className={cn('pointer ellipsis', { on: index + 1 === focusedRow })}
                key={`autocomplete-list--${index}`}
                onClick={() => onSelectAutoList(acList[index])}
                type={item.type}
              >
                {keyword ? (
                  <KeyWordHighlight
                    text={text}
                    keyword={keyword}
                    color={$POINT_BLUE}
                  />
                ) : text}
                {item.additional && (
                  <span className="additional-info">{item.additional}</span>
                )}
              </AutoCompleteLi>
            );
          })}
          {children}
        </StyledAutoCompleteUl>
      </Div>
    )
  )
);

export default HospitalAutoCompleteList;
