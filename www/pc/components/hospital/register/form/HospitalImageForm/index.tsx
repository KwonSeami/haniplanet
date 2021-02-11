import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import {useDispatch} from 'react-redux';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import ImageList from './ImageList';
import HospitalImageFormDiv from './HospitalImageFormDiv';
import AddImagesPopup from '../../../AddImagesPopup';
import BandApi from '../../../../../src/apis/BandApi';
import useCallAccessFunc from '../../../../../src/hooks/session/useCallAccessFunc';
import {staticUrl} from '../../../../../src/constants/env';
import {pushPopup} from '../../../../../src/reducers/popup';

const IMAGE_MAX_ADD = 10;

const HospitalImageForm = () => {
  const {getValues, setValue, watch} = useFormContext();
  const banners = watch('banners') || [];

  const dispatch = useDispatch();
  const bandApi: BandApi = useCallAccessFunc(access => new BandApi(access));

  const handleChangeFileUpload = React.useCallback(images => {
    images.forEach(({file}) => {
      const form = new FormData();

      form.append('banners', file);
      bandApi.imageUpload(form)
        .then(({data, status}) => {
          if (status !== 201) {
            alert('선택한 이미지는 최대 크기를 초과했습니다.');
          } else {
            const {result: {banners}} = data;
            const {banners: hospitalBanner} = getValues();

            setValue('banners', [...hospitalBanner, ...banners]);
          }
        });
    });
  }, [getValues, setValue]);

  const handleImageUpload = React.useCallback(() => {
    const {banners} = getValues();

    dispatch(pushPopup(AddImagesPopup, {
      currLength: banners.slice(1).length,
      maxLength: IMAGE_MAX_ADD,
      onChange: handleChangeFileUpload,
    }))
  }, [getValues, handleChangeFileUpload]);

  return (
    <HospitalImageFormDiv>
      <p>
        <span>{banners.length}</span>/{IMAGE_MAX_ADD}
      </p>
      <div className="imgs-content">
        {isEmpty(banners) ? (
          <ImageList>
            <li
              className="imgs-explain pointer"
              onClick={handleImageUpload}
            >
              <img
                src={staticUrl('/static/images/icon/icon-add-image.png')}
                alt="한의원 추가 이미지 등록하기"
              />
              <span>한의원 이미지를 추가로 등록해 주세요.</span>
            </li>
          </ImageList>
        ) : (
          <ImageList>
            {banners.map(({id, image}) => (
              <li key={id}>
                <img
                  className="delete-btn pointer"
                  src={staticUrl('/static/images/icon/icon-delete-picture.png')}
                  alt="삭제하기"
                  onClick={() => {
                    setValue(
                      'banners',
                      banners.filter(({id: itemId}) => itemId !== id),
                    );
                  }}
                />
                <div
                  className="title-img-box"
                  style={{backgroundImage: `url(${image})`}}
                />
              </li>
            ))}
            {(banners.slice(1).length < IMAGE_MAX_ADD) && (
              <li
                className="pointer"
                onClick={handleImageUpload}
              >
                <img
                  className="add-btn"
                  src={staticUrl('/static/images/icon/icon-add-image2.png')}
                  alt="추가하기"
                />
              </li>
            )}
          </ImageList>
        )}
      </div>
    </HospitalImageFormDiv>
  );
};

export default HospitalImageForm;
