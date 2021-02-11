import * as React from 'react';
import styled from 'styled-components';
import Input from '../../components/inputs/Input/InputDynamic';
import Button from '../../components/inputs/Button/ButtonDynamic';
import MapShower from '../../components/inputs/MapShower';
import {$BORDER_COLOR, $LIGHT_GRAY, $WHITE} from '../../styles/variables.types';
import {fontStyleMixin} from '../../styles/mixins.styles';

const Div = styled.div`
  height: 600px;
  input {
    width: 350px;
    height: 50px;
    border: 1px solid ${$BORDER_COLOR};
    font-size: 16px;
  }
  button {
    width: 50px;
    height: 50px;
    display: inline-block;
    background-color: ${$LIGHT_GRAY};
    ${fontStyleMixin({
      size: 16,
      color: $WHITE
    })};
  }
  .address-box input {
    display: inline-block;
  }
`;

const Test = React.memo(() => {
  const [address, setAddress] = React.useState('');
  const [location, setLocation] = React.useState([]);

  const locationRef = React.useRef(null);

  const searchAddress = React.useCallback(() => {
    window.daum.postcode.load(() => {
      new daum.Postcode({
        oncomplete: ({roadAddress, jibunAddress}) => {
          setAddress(roadAddress || jibunAddress);
        }
      }).open();
    });
  }, []);

  const copyToClipboard = React.useCallback((e) => {
    locationRef.current.select();
    document.execCommand('copy');
    e.target.focus();
  }, []);

  return (
    <Div>
      <div className="address-box">
        <Input
          placeholder="주소가 여기 나타나요!"
          readOnly
          value={address}
        />
        <Button onClick={searchAddress}>
          검색
        </Button>
      </div>
      {address && (
        <MapShower
          address={address}
          onChangePosition={({x, y}) => {
            setLocation([parseFloat(x), parseFloat(y)]);
          }}
        />
      )}
      <Input
        ref={locationRef}
        placeholder="주소의 x, y 좌표 (클릭하면 복사됩니다!)"
        readOnly
        value={location.join(', ')}
        onClick={copyToClipboard}
      />
    </Div>
  ); 
});

export default Test;
