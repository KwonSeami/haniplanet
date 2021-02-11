import * as React from 'react';
import Confirm from "../common/popup/Confirm";
import styled from "styled-components";
import {Close, TitleDiv} from "../common/popup/base/TitlePopup";
import {$BORDER_COLOR, $TEXT_GRAY, $POINT_BLUE, $WHITE, $FONT_COLOR} from "../../styles/variables.types";
import {fontStyleMixin} from "../../styles/mixins.styles";
import {staticUrl} from "../../src/constants/env";
import Button from "../inputs/Button";
import FileUploader from '../inputs/FileUploader';
import {IImageItem} from '../inputs/ImageListUploader';
import {PopupProps} from '../common/popup/base/Popup';

// 파일 따로 빼는 과정에서 누락되거나 꼬인 스타일이 있을 수 있습니다. 이상한 부분 있으면 말씀해주세요!
const StyledConfirm = styled(Confirm)`
  .modal-body {
    width: 420px;
    padding: 0 20px;

    ${TitleDiv} {
      padding: 30px 0 27px;
      border: none;

      h2 {
        text-align: center;
        ${fontStyleMixin({
          size: 21,
          weight: '300'
        })};
      }
    }

    ${Close} {
      top: 12px;
      right: -8px;
    }

    .button-group {
      padding: 25px 0 30px;
    }
  }
`;

const AddImgsArea = styled.div`
  div {
    position: relative;
    width: 100%;
    height: 150px;
    border: 1px solid ${$BORDER_COLOR};
    box-sizing: border-box;

    p {
      position: absolute;
      top: -25px;
      left: 0;
      ${fontStyleMixin({
        size: 14,
        family: 'Montserrat',
        color: $TEXT_GRAY
      })};
  
      span {
        ${fontStyleMixin({
          size: 14,
          weight: '600',
          family: 'Montserrat',
          color: $POINT_BLUE
        })};
      }
    }

    ul {
      height: 100%;
      overflow-y: auto;

      li {
        position: relative;
        height: 42px;
        padding: 11px 30px 11px 11px;
        box-sizing: border-box;
        cursor: default;
        ${fontStyleMixin({
          size: 14,
        })};

        &:hover {
          background-color: #f9f9f9;
        }

        .clear-button {
          position: absolute;
          top: 13px;
          right: 11px;
          width: 16px;
        }
      }
    }

    > img {
      position: absolute;
      top: calc(50% - 26px);
      left: calc(50% - 26px);
      width: 52px;
    }
  }

  button {
    img {
      width: 12px;
      margin-left: 2px;
    }
  }

  > p {
    position: static;
    line-height: 21px;
    margin-top: 9px;
    padding-left: 12px;
    border-left: 4px solid #ecedef;
    ${fontStyleMixin({
      size: 12,
      color: $TEXT_GRAY
    })};
  }
`;

interface IAddImagePopProps extends PopupProps {
  currLength?: number;
  maxLength?: number;
  setImages?: React.Dispatch<React.SetStateAction<Array<{id: HashId; result: string;}>>>;
  onChange: (images: IImageItem[]) => void;
}

const AddImagesPopup = React.memo<IAddImagePopProps>(({currLength, id, closePop, maxLength, onChange}) => {
  const fileUploaderRef = React.useRef<HTMLInputElement>(null);
  const [addList, setAddList] = React.useState([]);

  const handleClickImageUpload = React.useCallback(() => {
    fileUploaderRef.current.click();
  }, []);

  return (
    <StyledConfirm
      id={id}
      closePop={closePop}
      title="사진 첨부하기"
      buttonGroupProps={{
        leftButton: {onClick: () => closePop(id)},
        rightButton: {onClick: () => {
          onChange(addList);
          setAddList([]);
        }},
      }}
    >
      <FileUploader
        maxLength={maxLength}
        currLength={currLength}
        validate='VALIDATE_IMAGE'
        ref={fileUploaderRef}
        onChange={(file, result) => {
          setAddList(curr => [...curr, {file, result}]);
        }}
      />
      <AddImgsArea>
        <div>
          <p>
            <span>{currLength + addList.length}</span> /{maxLength}
          </p>
          {addList.length > 0 ? (
            <ul>
              {addList.map(({file}) => (
                <li className="ellipsis">
                  {file.name}
                  <img
                    src={staticUrl("/static/images/icon/icon-clear-btn.png")}
                    alt="지우기"
                    className="clear-button pointer"
                    onClick={() => setAddList(curr => (
                      curr.filter(({file: {name}}) => name !== file.name)
                    ))}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <img
              src={staticUrl('/static/images/icon/icon-add-image2.png')}
              alt="사진 첨부하기"
            />
          )}
        </div>
        <Button
          size={{width: '100%', height: '40px'}}
          font={{size: '15px', color: $WHITE}}
          border={{radius: '0'}}
          backgroundColor={$FONT_COLOR}
          onClick={() => handleClickImageUpload()}
        >
          첨부하기
          <img
            src={staticUrl('/static/images/icon/icon-add-images.png')}
            alt="사진 첨부하기"
          />
        </Button>
        <p>
          ※ 한의원의 추가 이미지를 등록해주세요.<br />
          ※ Image 크기는 가로 사이즈 기준으로 자동확대/축소 됩니다.<br />
          ※ 이미지 비율은 3:2를 권장합니다. (픽셀 1000*600 권장)<br />
          ※ 파일은 이미지 파일 형식인 JPG, JPEG, GIF, PNP만 가능합니다.
        </p>
      </AddImgsArea>
    </StyledConfirm>
  )
  },);

export default AddImagesPopup;