import * as React from 'react';
import styled from 'styled-components';
import Router, {useRouter} from 'next/router';
import {useForm, FormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import HospitalInfoForm from '../form/HospitalInfoForm';
import HospitalBannerDiv from './HospitalBannerDiv';
import HospitalImageForm from '../form/HospitalImageForm';
import HospitalFormDiv from './HospitalFormDiv';
import HospitalMedicalForm from '../form/HospitalMedicalForm';
import TextArea from '../../common/TextArea';
import OGMetaHead from '../../../OGMetaHead';
import Loading from '../../../common/Loading';
import WaypointHeader from '../../../layout/header/WaypointHeader';
import FloatingMenu from "../../../common/FloatingMenu";
import {floatMenuList} from '../../detail.pc';

const HospitalRegisterDiv = styled.div`
  width: 1280px;
  margin: auto;
`;

interface Props {
  defaultData?: any;
}

const HospitalRegister: React.FC<Props> = ({defaultData}) => {
  const {query: {slug}} = useRouter();

  const methods = useForm();
  const {register, unregister, setValue} = methods;
  const [loading, setLoading] = React.useState(true);
  const [{isOnBeforeUnload, replaceUrl}, setIsOnBeforeunload] = React.useState({
    isOnBeforeUnload: true,
    replaceUrl: `/band/${slug}`
  });

  const hospitalRegisterHeader = React.useMemo(() => {
    const title = defaultData ? '한의원 개설' : '한의원 수정';
    const {banners} = defaultData || {} as any;
    const bannerImg = banners ? banners[0].image : '';

    return (
      <div>
        <OGMetaHead title={title}/>
        <HospitalBannerDiv bannerImg={bannerImg} />
      </div>
    );
  }, [defaultData]);

  const {categories, extension: {work_day}} = defaultData || {extension: {}};

  React.useEffect(() => {
    window.onbeforeunload = () => isOnBeforeUnload || null;
    !isOnBeforeUnload && Router.replace(replaceUrl);

    return () => window.onbeforeunload = () => null;
  }, [isOnBeforeUnload, replaceUrl]);

  React.useEffect(() => {
    register({name: 'tags', value: []});
    register({name: 'mainImg', value: {}});
    register({name: 'banners', value: []});
    register({name: 'can_park', value: true});
    register({name: 'category_ids', value: []});
    register({name: 'map_location', value: []});
    register({name: 'timeList', value: {}});
    setLoading(false);

    return () => {
      unregister('tags');
      unregister('mainImg');
      unregister('banners');
      unregister('can_park');
      unregister('category_ids');
      unregister('map_location');
      unregister('timeList');
    };
  }, [register]);

  React.useEffect(() => {
    if (!loading && defaultData) {
      const {
        name,
        body,
        banners,
        tags,
        extension: {
          telephone,
          work_day,
          address,
          detail_address,
          link,
          subject_text,
          expertise,
          no_accept_text,
          reservation_text,
          directions,
        },
      } = defaultData;

      setValue('name', name);
      setValue('body', body);
      setValue('mainImg', banners[0]);
      setValue('banners', banners.slice(1));
      setValue('tags', tags.map(({tag})=> tag));
      setValue(
        'telephone',
        telephone.replace(/[^0-9]/g, "")
          .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/,"$1-$2-$3")
          .replace("--", "-")
      );
      setValue('timeList', work_day);
      setValue('address', address);
      setValue('detail_address', detail_address);
      setValue('link', link);
      setValue('subject_text', subject_text);
      setValue('expertise', expertise);
      setValue('no_accept_text', no_accept_text);
      setValue('reservation_text', reservation_text);
      setValue('directions', directions);
    }
  }, [loading, defaultData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <WaypointHeader
      themetype="white"
      headerComp={hospitalRegisterHeader}
    >
      <FormContext {...methods}>
        {!loading && (
          <HospitalRegisterDiv>
            <FloatingMenu
              menuList={floatMenuList}
              canShare
            />
            <HospitalFormDiv>
              <HospitalInfoForm
                defaultMedicalField={(categories || []).map(({category: {id, name}}) => ({id, name}))}
              />
              <HospitalImageForm />
              <div className="hospital-introduction">
                <h3>한의원 소개</h3>
                <TextArea
                  ref={register}
                  name="body"
                  className="intro"
                  placeholder="한의원 소개를 입력해 주세요."
                />
              </div>
              <HospitalMedicalForm
                type={defaultData ? 'EDIT' : 'ADD'}
                defaultTimeList={work_day}
                setIsOnBeforeunload={setIsOnBeforeunload}
              />
            </HospitalFormDiv>
          </HospitalRegisterDiv>
        )}
      </FormContext>
    </WaypointHeader>
  )
};

export default React.memo(HospitalRegister);
