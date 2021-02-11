import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import xorBy from 'lodash/xorBy';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import EditorTagList from '../external/EditorTagList';
import EditorDictList from '../external/EditorDictList';
import EditorFileList from '../external/EditorFileList';
import {UrlCard} from '../../story/embeds';
import {embedUrlCard} from '../../../src/lib/editor/utils';

const HaniEditorFooter = ({storyPK}) => {
  const methods = useFormContext();
  const {watch, getValues, setValue} = methods;
  const {url_card} = watch('externalData');

  const deleteUrlCard = React.useCallback(() => {
    const {externalData} = getValues();

    setValue('externalData', {
      ...externalData,
      url_card: {},
    });
    embedUrlCard(methods);
  }, [methods]);

  const xorByExternalData = React.useCallback((key: string, value: any, iteratee = 'id') => {
    const {externalData} = getValues();

    setValue('externalData', {
      ...externalData,
      [key]: xorBy(externalData[key], value, iteratee),
    });
  }, []);

  return (
    <div className="editor-bot-wrapper">
      {!isEmpty(url_card) && (
        <UrlCard
          url_card={url_card}
          deleteUrlCard={deleteUrlCard}
        />
      )}
      <EditorDictList xorByExternalData={xorByExternalData} />
      <EditorFileList storyPK={storyPK} />
      <EditorTagList storyPK={storyPK} xorByExternalData={xorByExternalData} />
    </div>
  );
};

export default HaniEditorFooter;
