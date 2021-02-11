import * as React from 'react';
import styled from 'styled-components';
import Button from './Button/ButtonDynamic';
import {isValid} from '../../src/lib/validates';
import {IValidateRegex, VALIDATE_REGEX} from '../../src/constants/validates';
import {$BORDER_COLOR, $POINT_BLUE} from '../../styles/variables.types';
import {staticUrl} from '../../src/constants/env';

interface Props {
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
  fileNameDisabled?: boolean;
  maxLength?: number;
  maxLengthMessage?: string;
  validate?: keyof IValidateRegex;
  onChange: (file: any) => void;
}

const uploadFile = (
  files: FileList,
  multiple: boolean,
  onChange: (fileList: File | File[]) => void,
) => {
  const fileList: File[] = [];

  Object.keys(files).forEach(idx => {
    const _idx = Number(idx);
    const file = files[_idx];

    if (!isNaN(_idx)) {
      if (multiple) {
        fileList.push(file);
      } else {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
          onChange && onChange(file);
        };
      }
    }
  });

  if (multiple) {
    onChange && onChange(fileList);
  }
};

const Div = styled.div`
  .file-input {
    display: none;
  }

  .file-button {
    &:active {
      opacity: 0.5;
    }
    
    img {
      margin: -2px 5px 0 -6px;
      display: inline-block;
      vertical-align: middle;
      width: 15px;
    }
  }
`;


const FileInput: React.FC<Props> = React.memo(
  ({
    className,
    disabled,
    multiple,
    fileNameDisabled,
    maxLength,
    maxLengthMessage,
    validate,
    onChange
  }) => {
    const fileRef = React.useRef<HTMLInputElement>();
    const [file, setFile] = React.useState(null);

    const fileOnChange = ({target: {files}}: React.ChangeEvent<HTMLInputElement>) => {
      const file = files[0];

      if (!files.length) {
        return null;
      } else if (files.length > maxLength) {
        alert(maxLengthMessage || `한번에 선택 가능한 파일 개수(${maxLength})를 초과합니다.`);
        return null;
      }
    
      if (validate && !isValid(file.type, validate)) {
        alert('잘못된 파일 양식입니다.' + VALIDATE_REGEX[validate][1]);
        return null;
      }

      uploadFile(files, multiple, onChange);
      setFile(file);
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.stopPropagation();
      fileRef.current.value = '';
      fileRef.current.click();
    };

    return (
      <Div className={className}>
        <input
          type="file"
          className="file-input"
          ref={fileRef}
          disabled={disabled}
          multiple={multiple}
          onChange={fileOnChange}
        />
        <Button
          className="file-button"
          size={{width: '138px', height: '40px'}}
          font={{size: '13px', weight: '600', color: $POINT_BLUE}}
          border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
          onClick={handleButtonClick}
        >
          <img
            src={staticUrl('/static/images/icon/icon-link.png')}
            alt="파일첨부"
          />
          파일첨부
        </Button>
        {!fileNameDisabled && (
          <p className="file-name">
            {file ? file.name : '선택된 파일 없음.'}
          </p>
        )}
      </Div>
    );
  }
);

export default FileInput;
