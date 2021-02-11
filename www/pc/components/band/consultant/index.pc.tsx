import * as React from 'react';
import styled from 'styled-components';
import {backgroundImgMixin, fontStyleMixin} from '../../../styles/mixins.styles';
import BandList from '../common/list/BandList';
import BandApi from '../../../src/apis/BandApi';
import {staticUrl} from '../../../src/constants/env';
import useSaveApiResult from '../../../src/hooks/useSaveApiResult';
import useCallAccessFunc from '../../../src/hooks/session/useCallAccessFunc';
import {useDispatch} from 'react-redux';
import {setLayout, clearLayout} from '../../../src/reducers/system/style/styleReducer';

const Section = styled.section`
  .consultant-banner {
    background-color: #f8f6ee;
  }

  .banner-box {
    width: 1090px;
    height: 334px;
    margin: auto;
    box-sizing: border-box;
    padding-top: 56px;
    ${backgroundImgMixin({
      img: staticUrl('/static/images/icon/icon-consultant-bg.png'),
      size: '337px',
      position: '100% 100%'
    })}

    li {
      display: inline-block;
      vertical-align: middle;
      padding-right: 10px;
      font-size: 14px;
    }

    h2 {
      padding-top: 24px;
      ${fontStyleMixin({size: 33, weight: '300', color: '#6d6660'})}
    }
  }

  .moa-list-pc {
    padding: 35px 0 154px;
    width: 1090px;
    margin: auto;
    box-sizing: border-box;

    h2 {
      padding-bottom: 25px;
      ${fontStyleMixin({size: 23, weight: '300'})}
    }
  }
`;

const ConsultantPC = React.memo(() => {

  const dispatch = useDispatch();

  // Api
  const categoryApi: BandApi['category'] = useCallAccessFunc(access => (
    access ? form => new BandApi(access).category(form) : null
  ));
  const {resData: categoryList} = useSaveApiResult(
    () => categoryApi && categoryApi({band_type: 'consultant'})
  );

  React.useEffect(() => {
    dispatch(setLayout({fakeHeight: false, position: 'static'}));

    return () => {
      dispatch(clearLayout());
    };
  }, []);

  return (
    <Section>
      <div className="consultant-banner">
        <div className="banner-box">
          <ul>
            {categoryList && categoryList.map(({id, name}) => (
              <li key={`consultant-list-${id}`}>#{name}</li>
            ))}
          </ul>
          <h2>다양한 분야별<br />맞춤 전문가 MOA입니다.</h2>
        </div>
      </div>
      <BandList
        title="전문가MOA"
        bandType="consultant"
        showMoaLength
      />
    </Section>
  );
});

ConsultantPC.displayName = 'ConsultantPC';
export default ConsultantPC;
