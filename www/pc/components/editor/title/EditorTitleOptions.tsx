import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import SelectBox from '../../inputs/SelectBox';
import {$BORDER_COLOR} from '../../../styles/variables.types';
import {backgroundImgMixin} from '../../../styles/mixins.styles';
import {staticUrl} from '../../../src/constants/env';

interface IEditorOptionSelectBox {
  field?: string;
}

const StyledSelectBox = styled(SelectBox)<IEditorOptionSelectBox>`
  border-bottom: 0;
  display: inline-block;
  height: 42px;
  ${({field}) => field === 'menu_tag_id' ? 'width: 170px;' : 'width: 120px'};
  ${({field}) => field === 'open_range' && 'margin-top: 34px'};
  position: relative;
  
  p {
    font-size: 15px;
    position: relative;
    text-decoration: underline;
    
    ${({field}) => field === 'open_range' && (`
      padding-left: 23px;
    
      &::after {
        content: '';
        height: 17px;
        width: 17px;
        left: 0;
        top: 50%;
        position: absolute;
        transform: translateY(-49%);
        ${backgroundImgMixin({
          img: staticUrl('/static/images/icon/icon-eye.png'),
          size: '100%',
        })};
      }
  
      img {
        right: 10px;
      }
    `)};
    img {
      margin-left: 8px;
      right: auto;
    }
  }
  
  ul {
    left: -2px;
    margin-top: 0;
    ${({field}) => field === 'menu_tag_id' && 'max-height: 410px;'}

    li {
      background-color: #fff;
      border-top-width: 0;
      box-sizing: border-box;
      margin-top: 0px;
      overflow: hidden;
      ${({field}) => field === 'menu_tag_id' && 'padding: 0 21px 0 14px;'}
      text-overflow: ellipsis;
      white-space: nowrap;

      &:first-child {
        border-top: 1px solid ${$BORDER_COLOR};
      }
    }
  }

  &::-ms-expand {
    display: none;
  }
`;

export interface ISelectBoxOption {
  label: string;
  value: string;
}

interface Props {
  selectBox?: {
    field: 'menu_tag_id' | 'open_range',
    options: ISelectBoxOption
  };
}

const EditorTitleOptions: React.FC<Props> = (({
  selectBox
}) => {
  const {field, options} = selectBox;
  const {setValue, watch} = useFormContext();

  const field_value = watch(field);

  return (
    <div>
      {!isEmpty(selectBox) && (
        <StyledSelectBox
          field={field}
          option={options}
          value={field_value}
          onChange={value => setValue(field, value)}
        />
      )}
    </div>
  )
});

export default EditorTitleOptions;
