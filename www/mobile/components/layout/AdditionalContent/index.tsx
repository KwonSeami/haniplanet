import * as React from 'react';
import RecommendUser from './RecommendUser';
import MyMoaMobile from './MyMoa/index.mobile';

class AdditionalContent extends React.Component {
  render() {
    return (
      <>
        {/* TODO: PC가 컴포넌트로 따로 분리되어있기때문에 이 부분 또한 분리하였습니다
            혹시 이 부분이 필요없으시면 컴포넌트만 옮겨주시고 삭제 부탁드립니다 :) 
        */}
        <RecommendUser name="main"/>
        <MyMoaMobile />
      </>
    );
  }
}

export default AdditionalContent;
