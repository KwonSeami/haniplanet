import * as React from 'react';
import SelectBox from '../../inputs/SelectBox/SelectBoxDynamic';
import Input from '../../inputs/Input/InputDynamic';
import {useDispatch} from 'react-redux';
import {SCHOOL_DICT} from '../../signup/currentComponent/form/basicInfo/BasicInfoMobile';
import {PopupProps} from '../../common/popup/base/Popup';
import {pushPopup} from '../../../src/reducers/popup';
import {useRouter} from 'next/router';
import RegisterNewItemPopup from './RegisterNewItemPopup';
import ProfessorApi from '../../../src/apis/ProfessorApi';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import useChangeInputAtName from '../../../src/hooks/input/useChangeInputAtName';
import StyledNewRatingAlert from './StyledNewRatingAlert';

const SCHOOL_LIST = SCHOOL_DICT.map((curr) => ({value: curr.label.slice(0,-2), label: curr.label}));

const newRatingItem = React.memo<PopupProps>(({id, closePop,}) => {
  // Router
  const router = useRouter();

  //API
  const professorApi: ProfessorApi = useCallAccessFunc(access => access && new ProfessorApi(access));

  // State
  const [disabled, setDisabled] = React.useState(false);
  const [newProfessor, setNewProfessor] = React.useState({
    school: SCHOOL_LIST[0].value,
    name: '',
    major: '',
  });

  // Redux
  const dispatch = useDispatch();

  // Hooks
  const inputValue = useChangeInputAtName(setNewProfessor);

  React.useEffect(() => {
    setDisabled(!newProfessor.name)
  },[newProfessor.name]);

  return (
    <StyledNewRatingAlert
      id={id}
      title="항목 등록"
      buttonText="등록"
      closePop={closePop}
      buttonProps={{
        disabled,
        onClick: () => {
          dispatch(pushPopup(RegisterNewItemPopup, {
            buttonGroupProps: {
              rightButton: {
                onClick: () => {
                  professorApi && professorApi.create({
                    title: newProfessor.name,
                    tags: [
                      newProfessor.school,
                      ...newProfessor.major !== '' ? [newProfessor.major] : []
                    ]
                  }).then(({status}) => {
                    if (status === 201) {
                      router.reload();
                    }
                  })
                }
              }
            }
          }));
        }
      }}
    >
      <p>
        학교 선택 및 아래 내용을 입력해주세요.
      </p>
      <div className="inner-add-popup">
        <SelectBox
          option={SCHOOL_LIST}
          value={newProfessor.school}
          onChange={(school) => {
            setNewProfessor(curr => ({
              ...curr,
              school,
            }));
          }}
        />
        <Input
          name="name"
          onChange={inputValue}
          placeholder="교수명을 입력해주세요. (20자 이내)"
          maxLength={20}
        />
        <Input
          name='major'
          onBlur={inputValue}
          placeholder="학과명을 입력해주세요. (20자 이내)"
          maxLength={20}
        />
      </div>
    </StyledNewRatingAlert>
  )
});

export default newRatingItem