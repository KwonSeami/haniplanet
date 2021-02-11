import * as React from 'react';
import cn from 'classnames';
import isEmpty from 'lodash/isEmpty';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import ClearButtonGroup from '../../ClearButtonGroup';
import HospitalCategoryModalDiv from './HospitalCategoryModalDiv';
import {RootState} from '../../../../../src/reducers';
import {fetchMedicalField} from '../../../../../src/reducers/medicalField';
import {MedicalFieldLi} from '../../../style/styleCompPC';

export interface IMedicalField {
  id: HashId;
  name: string;
}

interface Props {
  title?: React.ReactNode;
  maxLength?: number;
  defaultCategories?: IMedicalField[];
  onChange?: (medicalFields: IMedicalField[]) => void;
}

const HospitalCategoryModal: React.FC<Props> = ({
  title,
  maxLength,
  defaultCategories,
  onChange,
}) => {
  // State
  const [medicalFields, setMedicalFields] = React.useState({});

  // Redux
  const medicalField = useSelector(
    ({medicalField}: RootState) => medicalField,
    shallowEqual
  );

  const medicalFieldsApplyForm = Object.values<IMedicalField>(medicalFields);

  React.useEffect(() => {
    if (!isEmpty(defaultCategories)) {
      setMedicalFields(defaultCategories.reduce((prev, curr) => ({
        ...prev,
        [curr.id]: curr,
      }), {}));
    }
  }, [defaultCategories]);

  return (
    <HospitalCategoryModalDiv className="medical-field-wrapper">
      <ClearButtonGroup
        rightBtnText="적용"
        onClickRightBtn={() => onChange && onChange(medicalFieldsApplyForm)}
      >
        <div className="category-container">
          {title ? title : (
            <h3>
              <span>{medicalFieldsApplyForm.length}</span> 개 선택
            </h3>
          )}
          {!isEmpty(medicalField) && (
            <ul>
              {Object.values(medicalField).map(({id, name, icons}) => (
                <MedicalFieldLi
                  key={id}
                  className={cn({on: medicalFields[id]})}
                  onClick={() => {
                    const medicalFieldLength = Object.keys(medicalFields).length;

                    if (!!maxLength && medicalFieldLength > maxLength) {
                      // maxLength가 제한되어 있으면서, FieldLength가 maxLength를 넘긴 경우 예외처리
                      return null;
                    }

                    setMedicalFields(curr => {
                      const changedMedicalFields = {...curr};

                      if (changedMedicalFields[id]) {
                        delete changedMedicalFields[id];
                      } else if (!maxLength || medicalFieldLength < maxLength) {
                        changedMedicalFields[id] = {id, name};
                      }

                      return changedMedicalFields;
                    });
                  }}
                >
                  <img
                    src={medicalFields[id] ? icons.white : icons.normal}
                    alt={name}
                  />
                  <p>{name}</p>
                </MedicalFieldLi>
              ))}
            </ul>
          )}
        </div>
      </ClearButtonGroup>
    </HospitalCategoryModalDiv>
  );
};

export default React.memo(HospitalCategoryModal);
