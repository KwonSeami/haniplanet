import React from 'react';
import styled from 'styled-components';
import HospitalButtonGroupWrapper from './ButtonGroupWrapper';
import {MedicalFieldLi} from './style/styleCompPC';
import {fontStyleMixin} from '../../styles/mixins.styles';
import {$POINT_BLUE} from '../../styles/variables.types';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {fetchMedicalField} from '../../src/reducers/medicalField';
import isEmpty from 'lodash/isEmpty';
import cn from 'classnames';
import {RootState} from '../../src/reducers';

const Div = styled.div`
  .category-container {
    h3 {
      ${fontStyleMixin({
        size: 12,
        weight: 'bold'
      })};
  
      span {
        ${fontStyleMixin({
          size: 12,
          weight: 'bold',
          color: $POINT_BLUE
        })};
      }
    }

    ul {
      width: 430px;
      margin: 3px 0 0 -3px;
    }
  }
`;

interface IMedicalField {
  id: HashId;
  name: string;
}

interface Props {
  onApply: (medicalFields: IMedicalField[]) => void;
  categories: IMedicalField[];
  hasResetBtn?: boolean;
  maxLength?: number;
  isRegister?: boolean;
}

const HospitalMedicalFieldSelect = React.memo<Props>(({
  onApply,
  categories,
  hasResetBtn,
  maxLength,
  isRegister = false
}) => {
  const medicalField = useSelector(
    ({medicalField}: RootState) => medicalField,
    shallowEqual
  );

  const [medicalFields, setMedicalFields] = React.useState({});
  const medicalFieldsApplyForm = Object.values(medicalFields);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchMedicalField());
  }, []);

  React.useEffect(() => { 
    if (!isEmpty(categories)) {
      const reducedCategories = categories.reduce((prev, curr) => {
        prev[curr.id] = curr;
        return prev;
      }, {});
      setMedicalFields(reducedCategories);
    }
  }, [categories]);

  return (
    <Div className="medical-field-wrapper">
      <HospitalButtonGroupWrapper
        hasResetBtn={hasResetBtn}
        onClickResetBtn={() => setMedicalFields({})}
        rightBtnText="적용"
        onClickRightBtn={() => onApply(medicalFieldsApplyForm as IMedicalField[])}
      >
        <div className="category-container">
          {isRegister ? (
            <h3>대표 분야 선택</h3>
          ) : (
            <h3>
              <span>{medicalFieldsApplyForm.length}</span> 개 선택
            </h3>
          )}
          <ul>
            {!isEmpty(medicalField) && (
              Object.values(medicalField).map(({id, name, icons}) => (
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
              ))
            )}
          </ul>
        </div>
      </HospitalButtonGroupWrapper>
    </Div>
  );
});

export default HospitalMedicalFieldSelect;
