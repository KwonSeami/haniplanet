import React from 'react';
import isEmpty from 'lodash/isEmpty';

interface ICoordinatesState {
  lat: string;
  lng: string;
}

// naverMapRequired HOC와 함께 사용해야 합니다.
const useCoordinates = (address: string) => {
  const [coordinates, setCoordinates] = React.useState<ICoordinatesState>({
    lat: '',
    lng: ''
  });

  const _window = typeof window === 'undefined'
    ? ({} as typeof window)
    : window;

  React.useEffect(() => {
    if (address && typeof _window !== 'undefined') {
      setTimeout(() => {
        try {
          _window.naver.maps.Service.geocode(
            {address},
            (status, response) => {
              if (status === _window.naver.maps.Service.Status.OK) {
                const {result: {items}} = response;
  
                if (!isEmpty(items)) {
                  const [{point: {x, y}}] = items;
                  setCoordinates({
                    lat: y,
                    lng: x
                  });
                }
              }
            }
          );
        } catch(err) {
          console.dir(err);
          // Error concurred
        }
      }, 0);
    }
  }, [address]);

  return coordinates;
};

export default useCoordinates;
