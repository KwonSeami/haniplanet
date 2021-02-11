import * as React from 'react';
import cn from 'classnames';
import isEqual from 'lodash/isEqual';
import styled from 'styled-components';
import Input from './InputDynamic';
import Button from '../Button/ButtonDynamic';
import {$BORDER_COLOR} from '../../../styles/variables.types';

const AddressInputBox = styled.div`
  .input {
    display: inline-block;
    height: 44px !important;

    &:first-child {
      width: calc(100% - 120px) !important;
    }
  }
`;

interface IAddress {
  jibunAddress: string;
  roadAddress: string;
  zonecode: string;
  addressDetail: string;
}

interface Props {
  className?: string;
  defaultAddress?: IAddress;
  isErrMsg?: boolean;
  onChange: (address: IAddress) => void;
}

// defaultAddress로 받은 address 데이터를 검증
const isValid = (address) => {
  const initalAddress = {jibunAddress: '', roadAddress: '', zonecode: '', addressDetail: ''};

  if (typeof address !== 'object') { return initalAddress; }

  if (!isEqual(
    ['jibunAddress', 'roadAddress', 'zonecode', 'addressDetail'],
    Object.keys(address)
  )) { return initalAddress; }

  for (const item of Object.values(address)) {
    if (typeof item !== 'string') { return initalAddress; }
  }

  return address;
};

const AddressInput = React.memo<Props>(
  ({className, defaultAddress, isErrMsg, onChange}) => {
    const [address, setAddress] = React.useState<IAddress>(isValid(defaultAddress));
    const {jibunAddress, roadAddress, addressDetail} = address;

    React.useEffect(() => {
      onChange && onChange(address);
    }, [onChange, address]);

    return (
      <AddressInputBox className={cn(className, 'address-input')}>
        <Input
          value={jibunAddress || roadAddress}
          onChange={() => null}
          readOnly
        />
        <Button
          size={{width: '110px', height: '44px'}}
          font={{size: '13px', weight: '600'}}
          border={{radius: '0', width: '1px', color: $BORDER_COLOR}}
          onClick={() => {
            window.daum.postcode.load(() => {
              new daum.Postcode({
                oncomplete: ({jibunAddress, roadAddress, zonecode}) => {
                  setAddress(curr => ({...curr, jibunAddress, roadAddress, zonecode}));
                }
              }).open();
            });
          }}
        >
          변경
        </Button>
        <Input
          placeholder="상세주소"
          value={addressDetail}
          onChange={({target: {value: addressDetail}}) => {
            setAddress(curr => ({...curr, addressDetail}));
          }}
        />
        {isErrMsg && (
          <span className="error">주소를 입력해주세요.</span>
        )}
      </AddressInputBox>
    );
  }
);

export default AddressInput;
