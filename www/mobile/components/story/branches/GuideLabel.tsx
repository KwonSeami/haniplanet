import * as React from 'react';
import style from 'styled-components';
import {fontStyleMixin, heightMixin} from "../../../styles/mixins.styles";
import classNames from "classnames";

const GuideLabel = style(({name, className}) => <span className={classNames('guide-label', className)}>{name}</span>)`
    display: inline-block;
    vertical-align: middle;
    padding: 0 3px 0 4px;
    border-radius: 4px;
    ${heightMixin(16)}
    ${fontStyleMixin({size: 10, weight: '600'})};
    background-color: ${({bgColor}) => bgColor || '#ffdfd4'};
    ${({cssText}) => cssText};
`;

export default GuideLabel;
