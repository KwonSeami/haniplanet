import * as React from 'react';
import {addDecorator} from '@storybook/react';
import BaseStyles from '../styles/base.types';
import FontStyles from '../styles/fonts.styles';
import CommonStyle from '../styles/common.styles';
import EditorStyle from '../styles/editor.styles';
import RendererStyle from '../styles/renderer.styles';
import DayPickerStyle from '../styles/daypicker';

addDecorator(storyFn => (
  <div>
    <BaseStyles/>
    <FontStyles/>
    <CommonStyle/>
    <EditorStyle/>
    <RendererStyle/>
    <DayPickerStyle/>
    {storyFn()}
  </div>
));