import * as React from 'react';
import {FunctionComponent, MouseEventHandler} from 'react';
import {Base64} from 'js-base64';
import {useRouter} from "next/router";

interface Props {
  to: string;
  className?: string;
  newTab?: boolean;
  style?: React.CSSProperties;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  download?: boolean;
  queryString?: string;
}

const A: FunctionComponent<Props> = ({to, className, queryString: qs, newTab, ...otherProps}) => {
  const {asPath} = useRouter();
  return (
    <a
      href={`/forward?to=${Base64.toBase64(to)}&referer=${asPath}&${qs || ''}`}
      target={newTab ? '_blank' : '_self'}
      rel="noopener"
      className={`out-link ${className}`}
      {...otherProps}
    />
  )
};
export default A;
