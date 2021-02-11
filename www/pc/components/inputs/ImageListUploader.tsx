import * as React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import FileUploader from './FileUploader';
import {staticUrl} from '../../src/constants/env';
import {$BORDER_COLOR} from '../../styles/variables.types';
import isEmpty from 'lodash/isEmpty';
import {useDispatch} from 'react-redux';
import {pushPopup} from '../../src/reducers/popup';
import AddImagesPopup from '../hospital/AddImagesPopup';


const ImageList = styled.ul`
  li {
    position: relative;
    border: 1px solid ${$BORDER_COLOR};
    display: inline-block;
    box-sizing: border-box;

    &.imgs-explain {
      width: 100%;
      height: 100%;
      border: none;
    }

    img.delete-btn {
      position: absolute;
      top: 3px;
      right: 3px;
      width: 25px;
      height: 25px;
    }

    img.add-btn {
      position: absolute;
      top: calc(50% - 26px);
      left: calc(50% - 26px);
      width: 52px;
    }

    .title-img-box {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: 50%;
      background-repeat: no-repeat;
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
  initialImg?: React.ReactNode;
}

const ImageListUploader = React.memo<Props>(({
  className,
  maxLength,
  onChange,
  defaultStatus,
  deleteCallback,
  initialImg
}) => {
    const [images, setImages] = React.useState<IImageItem[]>([]);
    const dispatch = useDispatch();

    React.useEffect(() => {
      if (!isEmpty(defaultStatus)) {
        setImages(defaultStatus as any);
      }
    }, [defaultStatus]);

    return (
      <ImageList className={cn(className, 'image-list-uploader')}>
        {!isEmpty(images) && images.map(({id, result}) => (
          <li key={id}>
            <img
              className="delete-btn"
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
          </li>
        ))}
        {(isEmpty(images) && !!initialImg)
          ? <li
              className="imgs-explain pointer"
              onClick={() => dispatch(pushPopup(AddImagesPopup,{
                images,
                maxLength,
                onChange
              }))}
            >
              {initialImg}
            </li>
          : (images.length <= maxLength) && (
            <li
              onClick={() => dispatch(pushPopup(AddImagesPopup,{
                images,
                maxLength,
                onChange
              }))}
            >
              <img
                className="add-btn"
                src={staticUrl("/static/images/icon/icon-add-image2.png")}
                alt="추가하기"
              />
            </li>
        )}
      </ImageList>
    );
  }
);

export default ImageListUploader;
