import React from 'react';
import styled from 'styled-components';
import HospitalButtonGroupWrapper from './ButtonGroupWrapper';
import {shallowEqual, useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../src/reducers';
import {fetchMedicalField} from '../../src/reducers/medicalField';
import isEmpty from 'lodash/isEmpty';
import cn from 'classnames';
import {MedicalFieldLi} from './style/styleCompMobile';
import {fontStyleMixin, radiusMixin} from '../../styles/mixins.styles';
import {$WHITE, $POINT_BLUE, $TEXT_GRAY} from '../../styles/variables.types';

const Div = styled.div`
  position: relative;
  z-index: 1;

  .category-container {
    padding: 12px 0 0;
    margin-bottom: 2px;

    h3 {
      margin-bottom: 11px;
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

      p {
        margin-left: 10px;
        display: inline-block;
        ${fontStyleMixin({
          size: 10,
          color: $TEXT_GRAY
        })};
      }
    }
  
    ul {
      margin-left: -3px;
  
      li {
        display: inline-block;
        width: 78px;
        height: 78px;
        padding: 10px 0;
        margin: 3px;
        ${radiusMixin('15px', '#eee')};
        background-color: ${$WHITE};
        box-sizing: border-box;
        text-align: center;
        vertical-align: middle;
        
        transition: 0.3s;
  
        &.on {
          background-color: #499aff;
  
          p {
            ${fontStyleMixin({
              size: 12,
              color: $WHITE
            })};
          }
        }
  
        img {
          width: 38px;
        }
  
        p {
          ${fontStyleMixin({
            size: 12,
            color: '#999'
          })};
        }
      }
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
  maxLength?: number;
  isRegister: boolean;
}

const HospitalMedicalFieldSelect = React.memo<Props>(({
  onApply,
  categories,
  maxLength,
  isRegister = false,
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
        hasResetBtn
        onClickResetBtn={() => setMedicalFields({})}
        rightBtnText="적용"
        onClickRightBtn={() => onApply(medicalFieldsApplyForm as IMedicalField[])}
      >
        <div className="category-container">
          <h3>
            <span>{medicalFieldsApplyForm.length}</span> 개 선택
            {isRegister && (
              <p>
                ※ 대표 진료분야는 최대 5개까지 선택이 가능합니다.
              </p>
            )}
          </h3>
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
