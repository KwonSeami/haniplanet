import * as React from 'react';
import styled from 'styled-components';
import cn from 'classnames';
import {IBlockFormProps} from './blockTypes';
import {radiusMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import {$WHITE, $BORDER_COLOR, $THIN_GRAY, $FONT_COLOR} from '../../../styles/variables.types';

const BlockFormWrapper = styled.div`
  .container {
    position: relative;
    overflow: hidden;

    &.textarea {
      background-color: ${$WHITE};
      ${radiusMixin('17px', $BORDER_COLOR)};
      padding: 10px 15px;
    }
  }

  .button-group {
    position: relative;
    font-size: 0;
    text-align: right;

    button {
      & ~ button {
        margin-left: 10px;
      }
    }
  }

  .input .button-group {
    position: absolute;
    top: 50%;
    right: 14px;
    transform: translateY(-50%);
  }

  textarea {
    display: block;
    margin-right: -40px;
    padding-right: 40px;
    min-height: 54px;

    &::placeholder {
      color: ${$THIN_GRAY};
    }
  }

  input {
    display: block;
    width: 100%;
    height: 40px;
    padding: 0 15px;
    background-color: ${$WHITE};
    ${radiusMixin('20px', $BORDER_COLOR)};
  }

  button {
    height: 23px;
    ${fontStyleMixin({
      size: 13,
      weight: '600',
      color: $FONT_COLOR,
    })}
    vertical-align: middle;
    cursor: pointer;
  }
`;

const BlockTextForm = React.memo<IBlockFormProps>(({
  onSave, 
  text,
  isActive: _isActive,
  addBtn: AddBtn
}) => {
  const [value, setValue] = React.useState(text || '');
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [isActive, setIsActive]  = React.useState<Boolean>(_isActive || false);
  

  return (
    <BlockFormWrapper className="form">
      <div className={cn('container',{
        'textarea': isActive,
        'input': !isActive
      })}>
        {isActive ? (
          <>
            <textarea
              value={value}
              placeholder="추가하실 내용을 입력해주세요."
              ref={textareaRef}
              onChange={({target: {value}}) => {
                setValue(value);
              }}
            />
            <div className="button-group">
              <button
                className="button"
                type="button"
                onClick={() => {
                  if(!value) return alert('내용을 입력해주세요.');
                  onSave && onSave(value);
                  setValue('');
                }}
              >
                등록
              </button>
              {AddBtn && AddBtn}
            </div>
          </>
        ) : (
          <>
            <input
              value={value}
              placeholder="추가하실 내용을 입력해주세요."
              onClick={() => {
                setIsActive(true);
                setTimeout(() => {
                  if(textareaRef.current) textareaRef.current.focus();
                },300)
              }}
            />
            <div className="button-group">
              <button
                className="input-button"
                type="button"
                onClick={() => {
                  if(!value) return alert('내용을 입력해주세요.');
                  onSave && onSave(value);
                  setValue('');
                }}
              >
                등록
              </button>
            </div>
          </>
        )}
      </div>
    </BlockFormWrapper>
  )
})

BlockTextForm.displayName = 'BlockTextForm';
export default BlockTextForm;
