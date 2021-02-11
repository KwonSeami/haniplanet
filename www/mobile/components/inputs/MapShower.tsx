import * as React from 'react';
import Helmet from 'react-helmet';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import Loading from '../common/Loading';

const MapBox = styled.div`
  width: 680px;
  height: 360px;
`;

interface IPos {
  x: string;
  y: string;
}

interface Props {
  className?: string;
  address?: string;
  position?: IPos;
  onChangePosition?: (position: IPos) => void;
}

const isDefaultPosition = (position: IPos) => {
  const emptyPos = {x: null, y: null};
  
  if (!position) {
    // TODO: 조건 세부적으로 추가
    return emptyPos;
  }

  return position;
};

const MapShower = React.memo<Props>(
  ({className, address, position, onChangePosition}) => {
    const [pos, setPos] = React.useState(isDefaultPosition(position));
    const map = React.useRef(null);

    // map 위치 지정
    const setMap = React.useCallback(() => {
      try {
        console.log('setMap');
        map.current = new window.naver.maps.Map('map', {
          useStyleMap: true
        });
      } catch (err) {
        // map 스크립트가 로드되지 않아 에러 발생시, 함수 실행 시간을 늦춤
        console.error(err);
        setTimeout(setMap, 500);
      }
    }, []);

    // map 위치를 지정하는 함수
    const initMapPosition = React.useCallback((positionX: string, positionY: string) => {
      try {
        const position = new window.naver.maps.Point(positionX, positionY);
    
        map.current.setCenter(position);
        new window.naver.maps.Marker({position, map: map.current});
      } catch(err) {
        console.error(err);
        setTimeout(() => initMapPosition(positionX, positionY), 500);
      }
    }, [map]);

    const initMapAddress = React.useCallback((address: string) => {
      if (!address) return <Loading />;

      try {
        window.naver.maps.Service.geocode(
          {address},
          (status, response) => {
            if (status === window.naver.maps.Service.Status.ERROR) {
              return 'Something Wrong!';
            }

            const {result: {items}} = response;

            if (!isEmpty(items)) {
              const point = items[0].point;

              setPos({x: point.x, y: point.y});
              initMapPosition(point.x, point.y);
            }
          },
        );
      } catch(err) {
        console.error(err);
        setTimeout(() => initMapAddress(address), 500);
      }
    }, [map]);

    React.useEffect(() => {
      setMap();
    }, [setMap]);

    React.useEffect(() => {
      onChangePosition && onChangePosition(pos);
    }, [onChangePosition, pos]);

    React.useEffect(() => {
      if (!!address) {
        if (!position) {
          // 충돌을 막기 위해, address와 position이 동시에 지정된 경우, 실행하지 않습니다.
          initMapAddress(address);
        } else {
          console.error('position과 address 값 중 하나만 지정해주세요.');
        }
      }
    }, [address, position, initMapAddress]);

    React.useEffect(() => {
      if (!!position) {
        if (!address) {
          // 충돌을 막기 위해, address와 position이 동시에 지정된 경우, 실행하지 않습니다.
          const {x, y} = position;
          initMapPosition(x, y);
        } else {
          console.error('position과 address 값 중 하나만 지정해주세요.');
        }
      }
    }, [position, address, initMapPosition]);

    return (
      <div>
        <Helmet
          script={[{src: 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=83kvp4b50e&submodules=geocoder'}]}
        />
        <MapBox
          id="map"
          className={className}
        />
      </div>
    );
  }
);

export default MapShower;
