import * as React from 'react';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import Loading from '../../common/Loading';
import DynamicHaniEditorCore from '../core/DynamicHaniEditorCore';
import {embedUrlCard} from '../../../src/lib/editor/utils';
import {IHaniEditorCoreProps} from '../core/HaniEditorCore';

interface Props extends IHaniEditorCoreProps {
  loading: boolean;
}

const HaniEditorBody: React.FC<Props> = ({loading, ...rest}) => {
  const methods = useFormContext();
  const {getValues, setValue} = methods;
  const {body} = getValues();

  const onChangeEditorValue = React.useCallback(value => {
    setValue('body', value);
    // embedUrlCard(methods);
  }, []);

  const onChangeDictList = React.useCallback(dict => {
    const {externalData} = getValues();

    setValue('externalData', {
      ...externalData,
      dictList: [...externalData.dictList, dict],
    });
  }, []);

  const fileBeforeUploadEvents = React.useCallback(response => {
    const {attachments} = getValues();

    setValue('attachments', {
      ...attachments,
      file: [...attachments.file, ...response],
    });
  }, []);

  const imageBeforeUploadEvents = React.useCallback(response => {
    const {attachments} = getValues();

    setValue('attachments', {
      ...attachments,
      image: [...attachments.image, ...response],
    });
  }, []);

  if (loading) return <Loading />;

  return (
    <DynamicHaniEditorCore
      defaultValue={body}
      onChange={onChangeEditorValue}
      onChangeDictList={onChangeDictList}
      fileBeforeUploadEvents={fileBeforeUploadEvents}
      imageBeforeUploadEvents={imageBeforeUploadEvents}
      {...rest}
    />
  );
};

export default React.memo(HaniEditorBody);
