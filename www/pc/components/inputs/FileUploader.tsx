import * as React from 'react';
import {isValid} from '../../src/lib/validates';
import {IValidateRegex, VALIDATE_REGEX} from '../../src/constants/validates';

interface Props {
  className?: string;
  validate?: keyof IValidateRegex;
  maxLength?: number;
  currLength?: number;
  onChange: (file: File, result: string | ArrayBuffer) => void;
}

const FileUploader = React.memo(
  React.forwardRef<HTMLInputElement, Props>((
    {
      className,
      validate,
      maxLength,
      currLength,
      onChange
    }, ref
    ) => {
      const uploadFile = React.useCallback(
        (files: FileList) => {
          Object.keys(files).forEach(idx => {
            const _idx = Number(idx);
  
            if (!isNaN(_idx)) {
              const file = files[_idx];
  
              const reader = new FileReader();
  
              reader.readAsDataURL(file);
              reader.onload = () => {
                onChange(file, reader.result);
              };
            }
          });
        }, [onChange]
      );
  
      const handleFileChange = React.useCallback(
        ({target: {files}}: React.ChangeEvent<HTMLInputElement>) => {
          if (!files.length) {
            return null;
          } else if (!maxLength && files.length > 1) {
            alert('하나의 파일만 선택할 수 있습니다.');
            return null;
          } else if (!!maxLength && files.length > maxLength) {
            alert(`한번에 선택 가능한 파일 개수(${maxLength})를 초과합니다.`);
            return null;
          } else if (!!maxLength && (files.length + currLength) > maxLength) {
            alert(`총 선택 가능한 파일 개수(${maxLength})를 초과합니다.`);
            return null;
          }
  
          for (const idx of Object.keys(files)) {
            if (validate && !isValid(files[idx].type, validate)) {
              alert('잘못된 파일 양식입니다.' + VALIDATE_REGEX[validate][1]);
              return null;
            }
          }
  
          uploadFile(files);
        }, [uploadFile, maxLength, validate]
      );
  
      return (
        <input
          type="file"
          ref={ref}
          className={className}
          style={{display: 'none'}}
          multiple={maxLength && maxLength > 1}
          onChange={handleFileChange}
        />
      );
    }
  )
);

export default FileUploader;
