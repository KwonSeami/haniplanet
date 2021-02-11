import * as React from 'react';
import styled from 'styled-components';
import {IBlockFormProps} from './blockTypes';
import {fontStyleMixin} from '../../../styles/mixins.styles';
import {$WHITE} from '../../../styles/variables.types';

const BlockSectionInputDiv = styled.div`
  height: 100%;

  &.cancel input {
    padding-right: 110px;
  }

  input {
    width: 100%;
    height: 100%;
    padding-right: 55px;
    ${fontStyleMixin({
      size: 15,
      weight: '600',
    })};
  }

  .button-group {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    font-size:0; 
  }

  button {
    height: 100%;
    padding: 0 15px;
    font-weight: 600;
    color: #999;
    background-color: #e7e9ec;
    border: 0;

    &.save {
      color: ${$WHITE};
      background-color: #499aff;
    }
  }
`;

const BlockSectionForm = React.memo<IBlockFormProps>(({
  head, 
  onSave,
  addBtn,
  className
}) => {
  const [value, setValue] = React.useState(head || '');
  const inputRef = React.useRef(null);
  const submit = () => {
    if(!value) return alert('내용을 입력해주세요.');
    onSave && onSave(value);
    setValue('');
  };

  setTimeout(() => {
    inputRef.current && inputRef.current.focus();
  },300)
  return (
    <BlockSectionInputDiv className={className}>
      <input
        type="text"
        value={value}
        ref={inputRef}
        placeholder="항목을 입력해주세요."
        onChange={({target: {value}}) => {
          setValue(value);
        }}
        onKeyDown={(e) => {
          const keycode = e.which || e.keyCode;
          keycode === 13 && submit();
        }}
      />
      <div className="button-group">
        {addBtn}
        <button
          className="save"
          type="button"
          onClick={() => submit()}
        >
          {head ? '수정완료' : '등록'}
        </button>
      </div>
    </BlockSectionInputDiv>
  )
});

BlockSectionForm.displayName = 'BlockSectionForm';
export default BlockSectionForm;
