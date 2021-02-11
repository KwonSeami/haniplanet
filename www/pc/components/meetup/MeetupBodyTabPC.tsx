import * as React from 'react';
import styled from 'styled-components';
import ButtonGroup from '../inputs/ButtonGroup';
import FileList from '../editor/external/FileList';
import useEditorHandler from '../../src/hooks/element/editor/useEditorHandler';
import {fontStyleMixin, heightMixin} from '../../styles/mixins.styles';
import {Div, Responsiveli, StyledInput, SeminarBanner} from './pcStyledComp';
import {$TEXT_GRAY, $POINT_BLUE, $THIN_GRAY, $FONT_COLOR} from '../../styles/variables.types';
import DynamicHaniEditorCore from '../editor/core/DynamicHaniEditorCore';
import Radio from '../UI/Radio/Radio';
import CheckBox from '../UI/Checkbox1/CheckBox';
import isEmpty from 'lodash/isEmpty';
import {MEETUP_DEFAULT_IMAGE, MEETUP_TYPE_LIST} from "../../src/constants/meetup";
import {staticUrl} from '../../src/constants/env';
import FileUploader from '../inputs/FileUploader';
import {$BORDER_COLOR} from '../../styles/variables.types';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import Button from "../inputs/Button";
import {string, object} from 'yup';
import {MeetupBasicInfoTextarea} from "./meetupBasicInfoTab/MeetupBasicInfoTabPC";
import useCallAccessFunc from '../../src/hooks/session/useCallAccessFunc';
import StoryApi from '../../src/apis/StoryApi';

const StyledResponsiveLi = styled(Responsiveli)`
  .registration-box {
    position: relative;
    height: 123px;
    padding-left: 200px;
    margin-bottom: 12px;

    > p {
      ${fontStyleMixin({
        size: 15,
        color: $FONT_COLOR
      })};
    }

    > span {
      display: block;
      padding-top: 6px;
      letter-spacing: -0.21px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })};
    }
    
    > div.preview {
      top: 0;
      left: 0;
      width: 185px;
      height: 123px;
      border: 1px dashed ${$BORDER_COLOR};
      position: absolute;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      cursor: pointer;
      
      & > img.default {
        width: 52px;
        height: auto;
        padding-top: 38px;
        display: block;
        margin: auto;
      }
      
      & > img.preview-delete {
        top: 9px;
        right: 9px;
        width: 22px;
        height: auto;
        position: absolute;
        cursor: pointer;
      }
    }
    > img {
      width: 185px;
      height: 123px;
      top: 1px;
      left: 1px;
      position: absolute;
      z-index: 1;
    }
  }

  .border-box {
    position: relative;
    padding-left: 12px;

    &::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 0;
      height: 35px;
      border-left: 4px solid #ecedef;
    }
    
    p {
      position: relative;
      line-height: 21px;
      margin-left: 15px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY
      })};

      &::before {
        content: '※';
        display: block;
        position: absolute;
        left: -15px;
      }
    }
  }

  .input-text-box {
    .input{
      margin-left: 5px;
    }

    span {
      display: block;
      margin-top: 9px;
      ${fontStyleMixin({
        size: 12,
        color: $TEXT_GRAY,
      })};
    }
  }

  .ak-editor-content-area {
    height: 350px;
  }
`;

const StyledButton = styled(Button)`
  margin-top: 15px;
  position: absolute;
  right: 0;
`;

const StyledButtonGroup = styled(ButtonGroup)`
  padding: 30px 0 50px;
  text-align: right;

  li {
    padding: 0 5px;

    &:last-child {
      padding-right: 0;
    }
  }

  button {
    width: 138px;
    ${heightMixin(39)};
    border-radius: 19.5px;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid ${$THIN_GRAY};
    ${fontStyleMixin({
      size: 15,
      color: '#999'
    })};

    &.right-button {
      border-color: ${$POINT_BLUE};
      color: ${$POINT_BLUE};
    }
  }
`;

interface Props {
  className: string;
  edit?: boolean;
  prev: () => void;
  next: () => void;
}

const MeetupBodyTabPC = React.memo<Props>(({
  className,
  edit,
  next,
  prev
}) => {
  const methods = useFormContext();
  const {getValues, setValue, watch} = methods;

  const avatar = watch('avatar');
  const body_type = watch('body_type');
  const body = watch('body');
  const category = watch('category');
  const title = watch('title');
  const questions = watch('questions');
  const teacher_info = watch('teacher_info');
  const payment_info = watch('payment_info');
  const seminarAvatarRef = React.useRef();

  const uploadApi = useCallAccessFunc(access =>
    (type: 'file' | 'image', file) => new StoryApi(access).upload(type, file));

  // Custom Hooks
  const {fileConvertHandler, attachListState} = useEditorHandler();
  const {attachList: {file}, setAttachList} = attachListState;

  const [allowDefaultImage, setAllowDefaultImage] = React.useState(!getValues().avatar);

  const handleUploadImage = () => {
    seminarAvatarRef.current.click();
  };

  const handleClearImage = () => {
    setAllowDefaultImage(false);
    setValue('avatar', null);
  };

  // 데이터의 형식이 올바른지 확인
  const isValidBodyForm = object().shape({
    avatar: string().test('imageExistence',
      '대표 이미지를 업로드 하거나 기본 한의플래닛 세미나 이미지 사용을 체크해 주세요.',
      v => v || allowDefaultImage,
    ).nullable(),
    title: string().required('제목을 입력해 주세요.')
  });

  return React.useMemo(() => (
    <>
      <SeminarBanner>
        <h2>세미나/모임모집 내용</h2>
      </SeminarBanner>
      <Div className={className}>
        <ul>
          <Responsiveli>
            <h3>유형</h3>
            <div>
              <ul>
                {MEETUP_TYPE_LIST.map(({label}) => (
                  <li
                    key={`category-${label}`}
                    className="type-li"
                  >
                    <Radio
                      checked={getValues().category === label}
                      onClick={() => setValue('category', label)}
                    >
                      {label}
                    </Radio>
                  </li>
                ))}
              </ul>
            </div>
          </Responsiveli>
          <Responsiveli>
            <h3 className="title-h3">제목</h3>
            <div className="input-box">
              <StyledInput
                maxlength={30}
                name="title"
                placeholder="제목을 입력해주세요 (30자 이내)"
                style={{ width: '100%' }}
                defaultValue={title}
                onBlur={({target: {value}}) => setValue('title', value)}
              />
            </div>
          </Responsiveli>
          <StyledResponsiveLi>
            <h3>대표 이미지</h3>
            <div>
              <div className="registration-box">
                <div
                  className="preview"
                  onClick={(!avatar && !allowDefaultImage) && handleUploadImage}
                  style={{backgroundImage: `url("${
                      (allowDefaultImage && category)
                        ? MEETUP_DEFAULT_IMAGE(
                            MEETUP_TYPE_LIST[MEETUP_TYPE_LIST.findIndex(i => i.label === category)].value)
                        : typeof(avatar) === 'string'
                          ? avatar
                          : isEmpty(avatar) ? null : avatar.result
                    }")`}
                  }
                >
                  {(isEmpty(avatar) && !allowDefaultImage) && (
                    <img
                    className="default"
                    src={staticUrl('/static/images/icon/icon-add-image.png')}
                    />
                  )}
                  {(!isEmpty(avatar) || allowDefaultImage) && (
                    <img
                      className="preview-delete"
                      onClick={handleClearImage}
                      src={staticUrl('/static/images/icon/icon-delete-picture.png')}
                      alt="삭제하기"
                    />
                  )}
                </div>
                <FileUploader
                  ref={seminarAvatarRef}
                  onChange={(file, result) => {
                    setValue('avatar', ({file, result}));
                  }}
                />
                <CheckBox
                  checked={allowDefaultImage}
                  onChange={() => {
                    setValue('avatar', null);
                    setAllowDefaultImage(curr => !curr);
                  }}
                >
                  한의플래닛 세미나 이미지 사용하기
                </CheckBox>
                <span>선택하신 세미나/모임 유형에 따라 제공하는 이미지가 업로드됩니다.</span>
              </div>
              <div className="border-box">
                <p>이미지 비율은 3:2를 권장합니다. (픽셀720*480 권장)</p>
                <p>파일은 이미지 파일 형식인 (JPG, JPEG, GIF, PNG)만 가능합니다.</p>
              </div>
            </div>
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <h3>강사정보</h3>
            <div>
              <MeetupBasicInfoTextarea
                name="teacher_info"
                placeholder="강사 정보를 입력해주세요 ( 0/30자 )"
                rows="5"
                defaultValue={teacher_info}
                onBlur={({target: {value}}) => setValue('teacher_info', value)}
              />
            </div>
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <h3>세미나 문의</h3>
            <div>
              <MeetupBasicInfoTextarea
                name="payment_info"
                placeholder="세미나 관련 문의 사항 안내를 위한 안내자 정보 및 연략처&#13;&#10;( 개설자의 정보를 입력해 주세요 )"
                rows="5"
                defaultValue={payment_info}
                onBlur={({target: {value}}) => setValue('payment_info', value)}
              />
            </div>
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <h3>내용</h3>
            {body_type === 'froala' ? (
              <div>
                {/*
                  TODO: 에디터에 placeholder 추가해야합니다. 하단 텍스트 넣어주세요.
                  개설하는 세미나/모임에 대한 자세한 내용을 작성해주세요.
                  (세미나/모임 진행 안내 / 주차 관련 안내)
                */}
                <DynamicHaniEditorCore
                  isUpload={false}
                  defaultValue={body}
                  onChange={value => setValue('body', value)}
                />
                <FileList
                  fileList={file}
                  deleteFile={(uid) => {
                    setAttachList(curr => ({
                      ...curr,
                      file: curr.file.filter(({uid: currUid}) => currUid !== uid)
                    }));
                  }}
                />
              </div>
            ) : (
              <div>
                <p>에디터를 통해 작성된 글이 아닙니다.</p>
                <p>관리자에게 문의해주세요.</p>
              </div>
            )}
          </StyledResponsiveLi>
          <StyledResponsiveLi>
            <h3>신청 질문</h3>
            <div className="input-text-box">
              <ul>
                {questions.map(({id, question}, idx) => (
                  <li>
                    {idx + 1}.
                    <StyledInput
                      type="text"
                      placeholder="30자이내로 입력해주세요."
                      name={`questions[${idx}]`}
                      style={{width: '513px'}}
                      value={question || ''}
                      onChange={({target: {value}}) => {
                        const {questions} = getValues();

                        setValue(
                          'questions',
                          questions.map((item, itemIdx) => itemIdx === idx ? {...item, question: value} : item)
                        );
                      }}
                    />
                    {(!!question) && (
                      <StyledButton
                        type="button"
                        className="question-delete"
                        border={{width: '0', radius: '50%'}}
                        size={{width: '16px', height: '17px'}}
                        onClick={() => {
                          const {questions} = getValues();
                          setValue(
                            'questions',
                            questions.map((item, itemIdx) => itemIdx === idx
                              ? item.id ? {id: item.id} : {}
                              : item)
                          );
                        }}
                      >
                        <img
                          src={staticUrl('/static/images/icon/icon-tag-delete.png')}
                          alt="질문 삭제"
                        />
                      </StyledButton>
                    )}
                  </li>
                ))}
              </ul>
              <span className="question-span">신청자에게 세미나/모임 진행에 필요한 정보에 대한 질문을 입력해주세요.</span>
            </div>
          </StyledResponsiveLi>
        </ul>
        <StyledButtonGroup
          leftButton={{
            children: '이전',
            onClick: () => prev()
          }}
          rightButton={{
            children: edit ? '수정' : '다음',
            type: edit && (avatar || allowDefaultImage) ? 'submit' : 'button',
            onClick: () => isValidBodyForm.validate(getValues())
              .then(() => !edit && next())
              .catch(({errors}) => alert(errors[0]))
          }}
        />
      </Div>
    </>
  ), [methods, allowDefaultImage]);
});

MeetupBodyTabPC.displayName = 'MeetupBodyTabPC';
export default MeetupBodyTabPC;
