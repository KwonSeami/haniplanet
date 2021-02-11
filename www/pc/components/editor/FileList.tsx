import * as React from 'react';
import styled from 'styled-components';
import {staticUrl} from '../../src/constants/env';
import {formatBytes} from '../../src/lib/numbers';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {$TEXT_GRAY} from '../../styles/variables.types';
import A from '../UI/A';

const FileLi = styled.li`
  padding: 0 6px 7px 0;
  display: inline-block;
  vertical-align: middle;

  div {
    position: relative;
    min-width: 220px;
    max-width: 362px;
    ${heightMixin(29)}
    box-sizing: border-box;
    background-color: #f6f7f9;
    border-radius: 17px;
    padding: 0 80px 0 10px;
  }

  img {
    display: inline-block;
    vertical-align: middle;
  }

  p {
    width: 100%;
    ${fontStyleMixin({
      size: 12,
      weight: '500',
      color: $TEXT_GRAY
    })}

    img {
      width: 13px;
      margin: -2px 3px 0 0;
    }
  }

  span {
    position: absolute;
    right: 11px;
    top: 0;
    ${fontStyleMixin({
      size: 12,
      weight: '500',
      color: $TEXT_GRAY
    })}

    img {
      width: 16px;
      margin: -2px 0 0 6px;
    }
  }
`;

export interface IFile {
  file: string;
  id: string;
  name: string;
  size: number;
  uid: HashId;
}

interface Props {
  fileList: IFile[];
  deleteFile?: (uid: HashId, rest: any) => void;
}

const FileList = React.memo<Props>(({fileList, deleteFile}) => (
  <ul className="file">
    {fileList.map(({file, name, size, uid, ...rest}) => (
      <FileLi key={uid}>
        <div>
          <A to={file} download newTab>
            <p className="ellipsis">
              <img
                src={staticUrl('/static/images/icon/icon-file.png')}
                alt="파일"
              />
              {name || file}
            </p>
          </A>
          <span>
            {size && formatBytes(size)}
            {deleteFile && (
              <img
                className="pointer"
                onClick={() => deleteFile(uid, rest)}
                src={staticUrl('/static/images/icon/icon-file-close.png')}
                alt="닫기"
              />
            )}
          </span>
        </div>
      </FileLi>
    ))}
  </ul>
));

FileList.displayName = 'FileList';
export default FileList;
