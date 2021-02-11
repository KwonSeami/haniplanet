import React from 'react';
import styled from 'styled-components';
import {IAcCompProps} from '../../inputs/Input/SearchBaseInput';
import {AutocompleteUl as AutoCompleteUl} from '../../AutocompleteList';
import cn from 'classnames';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';
import KeyWordHighlight from '../../common/KeyWordHighlight';
import {$POINT_BLUE, $TEXT_GRAY} from '../../../styles/variables.types';

const StyledAutoCompleteUl = styled(AutoCompleteUl)`
  position: absolute;
  z-index: 2;
  top: 47px;
  left: 0;
  width: 1090px;
  padding: 6px 15px;
  box-sizing: border-box;
  border-radius: 7px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
`;

const autoCompleteIcon = {
  location: staticUrl('/static/images/icon/icon-location-blue.png'),
  address: staticUrl('/static/images/icon/icon-hospital-blue.png'),
  normal: staticUrl('/static/images/icon/icon-hospital-search.png'),
  category: staticUrl('/static/images/icon/icon-star-blue.png')
}

const AutoCompleteLi = styled.li<Pick<IHospitalAcList, 'type'>>`
  height: 44px !important;
  padding: 10px 25px !important;
  ${({type}) => backgroundImgMixin({
    img: autoCompleteIcon[type],
    size: '20px',
    position: '0%'
  })};

  span {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;

    &.additional-info {
      padding-left: 10px;
      ${({type}) => fontStyleMixin({
        size: 12,
        color: type === 'category'
          ? $POINT_BLUE
          : $TEXT_GRAY,
        weight: '600'
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
      <StyledAutoCompleteUl
        className={className}
        ref={ref}
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
    )
  )
);

export default HospitalAutoCompleteList;
