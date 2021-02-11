import * as React from 'react';
import styled from 'styled-components';
import MoaListMobile from '../list/moaList/MoaList/MoaListMobile';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import BandApi from '../../../src/apis/BandApi';
import {staticUrl} from '../../../src/constants/env';
import useSaveApiResult from '../../../src/hooks/useSaveApiResult';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';

const Section = styled.section`
  .consultant-banner {
    background-color: #f8f6ee;
  }

  .banner-box {
    max-width: 680px;
    height: 185px;
    margin: auto;
    box-sizing: border-box;
    padding-top: 15px;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/graphic/icon-consultant-bg.png'),
      size: '187px',
      position: '100% 100%'
    })}

    li {
      display: inline-block;
      vertical-align: middle;
      padding-right: 4px;
      font-size: 14px;
    }

    h2 {
      padding-top: 38px;
      ${fontStyleMixin({
        size: 21, 
        weight: '300', 
        color: '#6d6660'
      })}
    }
  }
`;

const ConsultantMobile = React.memo(() => {
  const bandApi: BandApi = useCallAccessFunc(access => access ? new BandApi(access) : null);
  const {resData: categoryList} = useSaveApiResult(() => bandApi && bandApi.category({band_type: 'consultant'}));

  return (
    <Section>
      <div className="consultant-banner">
        <div className="banner-box">
          <ul>
            {categoryList && categoryList.map(({id, name}) => (
              <li key={`consultant-list-${id}`}>#{name}</li>
            ))}
          </ul>
          <h2>다양한 분야별 맞춤 전문가<br />MOA입니다.</h2>
        </div>
      </div>
      <MoaListMobile
        title="전문가MOA"
        bandType="consultant"
        showMoaLength
      />
    </Section>
  );
});

ConsultantMobile.displayName = 'ConsultantMobile';
export default ConsultantMobile;
