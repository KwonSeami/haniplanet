import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import range from 'lodash/range';
import HospitalCategoryUl from './HospitalCategoryUl';
import HospitalCategoryModal, {IMedicalField} from '../HospitalCategoryModal';
import {staticUrl} from '../../../../../src/constants/env';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../src/reducers";
import {fetchMedicalField} from "../../../../../src/reducers/medicalField";

const FILED_MAX_SELECT = 5;

interface Props {
  defaultMedicalField: any[];
  callback: (medicalField: IMedicalField[]) => void;
}

const HospitalCategory: React.FC<Props> = ({defaultMedicalField, callback}) => {
  // State
  const [openField, setOpenField] = React.useState(false);
  const [medicalField, setMedicalField] = React.useState<IMedicalField[]>(defaultMedicalField || []);

  // Redux
  const dispatch = useDispatch();
  const medicalFieldStore = useSelector(
    ({medicalField}: RootState) => medicalField,
    shallowEqual
  );

  React.useEffect(() => {
    dispatch(fetchMedicalField());
  }, []);

  const handleOnChangeCategory = category => {
    setMedicalField(category);
    setOpenField(false);
  };

  React.useEffect(() => {
    callback && callback(medicalField);
  }, [callback, medicalField]);

  return (
    <HospitalCategoryUl className="hospital-category">
      {!isEmpty(medicalFieldStore) && (
        range(FILED_MAX_SELECT).map(index =>
          (index < medicalField.length)
            ? (
              <li className="on">
                <img
                  src={medicalFieldStore[medicalField[index].name].icons['normal']}
                  alt={medicalField[index].name}
                />
                <p>{medicalField[index].name}</p>
                <button
                  type="button"
                  className="pointer"
                  onClick={() => setMedicalField(curr => (
                    curr.filter(item => item.id !== medicalField[index].id)
                  ))}
                >
                  <img
                    src={staticUrl('/static/images/icon/icon-delete-picture.png')}
                    alt="대표 진료분야 삭제하기"
                  />
                </button>
              </li>
            ) : (
              <li
                className="pointer"
                onClick={() => setOpenField(true)}
              >
                <img
                  src={staticUrl('/static/images/icon/check/icon-mini-plus.png')}
                  alt="대표 진료분야 추가하기"
                />
              </li>
            )
        )
      )}
      {openField && (
        <HospitalCategoryModal
          title={<h3>대표 분야 선택</h3>}
          maxLength={FILED_MAX_SELECT}
          defaultCategories={medicalField}
          onChange={handleOnChangeCategory}
        />
      )}
    </HospitalCategoryUl>
  );
};

export default HospitalCategory;
