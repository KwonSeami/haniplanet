import * as React from 'react';
import {HashId} from '@hanii/planet-types';
import {useFormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import DictCard from '../../dict/DictCard';
import {DictUl} from '../../story/common2';

interface Props {
  xorByExternalData: (key: string, value: any, iteratee?: string) => void;
}

const EditorDictList: React.FC<Props> = ({xorByExternalData}) => {
  const {watch} = useFormContext();
  const {dictList} = watch('externalData');

  const onDelete = React.useCallback((id: HashId) => {
    xorByExternalData('dictList', [{code: id}]);
  }, [xorByExternalData]);

  return (
    <DictUl>
      {dictList.map(({type, ...item}) => (
        <li key={item.id}>
          <DictCard
            data={item}
            type={type}
            onDelete={onDelete}
          />
        </li>
      ))}
    </DictUl>
  );
};

export default React.memo(EditorDictList);