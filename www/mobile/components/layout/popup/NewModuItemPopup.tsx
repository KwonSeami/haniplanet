import * as React from 'react';
import {useDispatch} from 'react-redux';
import {useRouter} from 'next/router';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import StyledNewRatingAlert from './StyledNewRatingAlert';
import SelectBox from '../../inputs/SelectBox/SelectBoxDynamic';
import Input from '../../inputs/Input/InputDynamic';
import RegisterNewItemPopup from './RegisterNewItemPopup';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import ModuApi from '../../../src/apis/ModuApi';
import {TAG_LIST} from '../../../pages/modunawa';
import {PopupProps} from '../../common/popup/base/Popup';
import {pushPopup} from '../../../src/reducers/popup';

const selectTagIdx = (tagName: string | string[]) => findIndex(TAG_LIST, ['value', tagName]);

const newModuItemPopup = React.memo<PopupProps>(({id, closePop,}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [disabled, setDisabled] = React.useState(true);
  const moduApi: ModuApi = useCallAccessFunc(access => access && new ModuApi(access));
  const [isSubChildExist, setIsSubChildExist] = React.useState(false);

  const [newModuItem, setNewModuItem] = React.useState({
    tag: TAG_LIST[0].value,
    subTag: '',
    name: '',
  });

  React.useEffect(() => {
    const checkSubChildExist = !isEmpty(TAG_LIST[selectTagIdx(newModuItem.tag)].subTags);

    checkSubChildExist && (
      setNewModuItem(curr => ({
        ...curr,
        subTag: TAG_LIST[selectTagIdx(newModuItem.tag)].subTags[0],
      }))
    );
    setIsSubChildExist(checkSubChildExist);
    setDisabled(
      !newModuItem.name
      || (checkSubChildExist && newModuItem.subTag === '')
    );
  }, [newModuItem.name, newModuItem.tag, newModuItem.subTag]);

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
                  moduApi && moduApi.create({
                    title: newModuItem.name,
                    tags: [
                      newModuItem.tag,
                      ...(isSubChildExist ? [newModuItem.subTag] : []),
                    ],
                  }).then(({status}) => {
                    if (status === 201) {
                      router.reload();
                    }
                  });
                },
              },
            },
          }));
        }
      }}
    >
      <p>
        카테고리 및 아래 내용을 입력해주세요.
      </p>
      <div className="inner-add-popup">
        <SelectBox
          value={newModuItem.tag}
          option={TAG_LIST}
          onChange={(tag) => {
            setNewModuItem(curr => ({
              ...curr,
              tag,
            }));
          }}
        />
        {isSubChildExist && (
          <SelectBox
            value={newModuItem.subTag}
            option={TAG_LIST[selectTagIdx(newModuItem.tag)].subTags.map(value => ({value}))}
            onChange={(subTag) => {
              setNewModuItem(curr => ({...curr, subTag}));
            }}
          />
        )}
        <Input
          name="name"
          onChange={({target: {name, value}}) => {
            setNewModuItem(curr => ({
              ...curr,
              [name]: value,
            }));
          }}
          placeholder="명칭을 입력해주세요. (20자 이내)"
          maxLength={20}
        />
      </div>
    </StyledNewRatingAlert>
  )
});

export default newModuItemPopup