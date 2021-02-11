import * as React from 'react';
import {FormContext} from 'react-hook-form/dist/react-hook-form.ie11';
import {FormContextValues} from 'react-hook-form/dist/contextTypes';
import HaniEditorBody from './layout/HaniEditorBody';
import EditorWrapper from './layout/EditorWrapper';
import HaniEditorFooter from './layout/HaniEditorFooter';

interface Props {
  loading: boolean;
  titleComp: React.ReactNode;
  methods: FormContextValues<Record<string, any>>;
}

const HaniEditor: React.FC<Props> = ({loading, storyPK, titleComp, methods}) => {
  return (
    <FormContext {...methods}>
      <EditorWrapper className="editor-wrapper">
        <div>{titleComp}</div>
        <HaniEditorBody loading={loading} />
        <HaniEditorFooter storyPK={storyPK} />
      </EditorWrapper>
    </FormContext>
  );
};

export default React.memo(HaniEditor);
