import React from 'react';
import styled from 'styled-components';
import OGMetaHead from '../../components/OGMetaHead';
import HospitalInfoTabMobile from './HospitalInfoTabMobile';
import useHospitalRegister, {THospitalRegisterStatus} from '../../src/hooks/hospital/useHospitalRegister';

const Section = styled.section`
  width: 100%;
  padding: 6px 0 100px;
  box-sizing: border-box;
  background-color: #f6f7f9;

  @media screen and (max-width: 680px) {
    padding-top: 0;
  }
`;

interface Props {
  type: THospitalRegisterStatus;
}

const HospitalRegister: React.FC<Props> = React.memo(({type}) => {
  const {
    hospital,
    setHospital,
    setIsOnBeforeunload,
    isValidForm,
    registerHospital,
    image_ids_to_delete,
    setImgIdsToDelete,
    responseForm
  } = useHospitalRegister(type);
  
  return (
    <Section>
      <OGMetaHead title={`한의원 ${type === 'ADD' ? '개설' : '수정'}`}/>
      <HospitalInfoTabMobile
        type={type}
        hospital={hospital}
        registerHospital={registerHospital}
        setHospital={setHospital}
        setIsOnBeforeunload={setIsOnBeforeunload}
        isValidForm={isValidForm}
        image_ids_to_delete={image_ids_to_delete}
        setImgIdsToDelete={setImgIdsToDelete}
        responseForm={responseForm}
      />
    </Section>
  ); 
});

HospitalRegister.displayName = 'HospitalRegister';
export default HospitalRegister;
