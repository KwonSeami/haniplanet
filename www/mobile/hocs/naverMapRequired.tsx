import React from 'react';
import Helmet from 'react-helmet';

const naverMapRequired = (Target: React.ComponentType) => {
  const NaverMapRequired = (props) => {
    return (
      <>
        <Helmet
          script={[{src: 'https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=83kvp4b50e&submodules=geocoder'}]}
        />
        <Target {...props}/>
      </>
    );
  };

  NaverMapRequired.displayName = 'NaverMapRequired';
  NaverMapRequired.getInitialProps = Target.getInitialProps;

  return NaverMapRequired;
};

export default naverMapRequired;
