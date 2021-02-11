import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import FileUploader from './FileUploader';
import {staticUrl} from '../../src/constants/env';
import {$BORDER_COLOR, $POINT_BLUE, $WHITE} from '../../styles/variables.types';
import isEmpty from 'lodash/isEmpty';
import { heightMixin, fontStyleMixin } from '../../styles/mixins.styles';

export const ImageList = styled.ul`
  li {
    position: relative;
    width: 72px;
    ${heightMixin(68)};
    border-radius: 2px;
    margin: 0 4px 4px 0;
    border: 1px solid ${$BORDER_COLOR};
    
    display: inline-block;
    vertical-align: top;
    text-align: center;

    &.add-btn {
      border: 1px dashed ${$BORDER_COLOR};
    }

    img {
      width: 15px;
      position: absolute;
      right: 3px;
      top: 3px;

      &.add-btn-img {
        position: static;
        width: 34px;
        vertical-align: middle;
      }
    }

    .title-img-box {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: 50%;
      background-repeat: no-repeat;
    }

    > span {
      position: absolute;
      z-index: 1;
      bottom: 0;
      left: 0;
      width: 25px;
      ${heightMixin(20)};
      background-color: ${$POINT_BLUE};
      ${fontStyleMixin({
        size: 10,
        color: $WHITE,
      })};
    }
  }
`;

export interface IImageItem {
  file: File;
  result: string | ArrayBuffer;
}

interface Props {
  className?: string;
  maxLength?: number;
  onChange: (images: IImageItem[]) => void;
  defaultStatus: Array<{id: HashId; result: string;}>;
  deleteCallback?: (id: HashId) => void;
  text?: string;
}

const NOT_CLICK = -2;
const ADD_IMAGE = -1;

const ImageListUploader = React.memo<Props>(
  ({className, maxLength, onChange, defaultStatus, deleteCallback, text}) => {
    const [images, setImages] = React.useState<IImageItem[]>([]);
    const fileUploaderRef = React.useRef<HTMLInputElement>(null);
    const clickListIdx = React.useRef(NOT_CLICK);

    const possibleUpload = React.useMemo<boolean>(() => (
      // 이미지가 하나도 업로드되지 않았거나,maxLength보다 적게 업로드 되었을 때 추가로 업로드 가능
      !images.length || !!maxLength && maxLength > images.length
    ), [images, maxLength]);

    const handleClickImageUpload = React.useCallback((imgIdx: number) => {
      clickListIdx.current = imgIdx;
      fileUploaderRef.current.click();
    }, []);

    React.useEffect(() => {
      onChange && onChange(images);
    }, [onChange, images]);

    React.useEffect(() => {
      if (!isEmpty(defaultStatus)) {
        setImages(defaultStatus as any);
      }
    }, [defaultStatus]);

    return (
      <ImageList className={cn(className, 'image-list-uploader')}>
        <FileUploader
          ref={fileUploaderRef}
          onChange={(file, result) => {
            switch(clickListIdx.current) {
            case NOT_CLICK:
              console.error('ImageListUploader: 잘못된 클릭 이벤트입니다.');
              break;
            case ADD_IMAGE:
              setImages(curr => ([...curr, {file, result}]));
              break;
            default:
              // 이미지 수정 기능이 현재 필요하지 않아 현재 추가하지 않았습니다.
            }

            clickListIdx.current = NOT_CLICK;
          }}
        />
        {images.map(({id, result}, index) => (
          <li key={result.toString()}>
            <img
              src={staticUrl("/static/images/icon/icon-delete-picture.png")}
              alt="삭제하기"
              onClick={() => {
                setImages(curr => curr.filter(item => item.result !== result));

                if (id && deleteCallback) {
                  deleteCallback(id);
                }
              }}
            />
            <div
              className="title-img-box"
              style={{backgroundImage: `url("${result}")`}}
            />
            <span>대표</span>
          </li>
        ))}
        {possibleUpload && (
          <li
            className="add-btn"
            onClick={() => handleClickImageUpload(ADD_IMAGE)}
          >
            <img
              className="add-btn-img"
              src={staticUrl('/static/images/icon/icon-add-image.png')}
              alt="추가하기"
            />
          </li>
        )}
      </ImageList>
    );
  }
);

export default ImageListUploader;
