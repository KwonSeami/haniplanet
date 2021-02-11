import Head from 'next/head';
import * as React from 'react';
import {SITE_DESCRIPTION, SITE_IMAGE, SITE_NAME, SITE_TITLE} from "../src/constants/env";
import {
  KEY_DESCRIPTION,
  KEY_OG_DESCRIPTION, KEY_OG_IMAGE,
  KEY_OG_SITE_NAME,
  KEY_OG_TITLE, KEY_TWITTER_CARD, KEY_TWITTER_DESCRIPTION, KEY_TWITTER_IMAGE,
  KEY_TWITTER_SITE,
  KEY_TWITTER_TITLE
} from "../src/constants/head";

interface Props {
  title?: string;
  desc?: string;
  image?: string;
  siteName?: string;
  children?: React.ReactNode;
}

export default class OGMetaHead extends React.Component<Props> {
  public static defaultProps: Partial<Props> = {
    title: SITE_TITLE,
    desc: SITE_DESCRIPTION,
    image: SITE_IMAGE,
    siteName: SITE_NAME,
  };

  public render() {
    const {title, desc, image, siteName, children} = this.props;
    const t = title + ' | ' + SITE_NAME;
    return (
      <Head>
        <meta property="og:type" content="website" />
        <title>{t}</title>
        <meta property="og:title" content={t} key={KEY_OG_TITLE} />
        <meta name="twitter:title" content={t} key={KEY_TWITTER_TITLE} />

        <meta property="og:description" content={desc} key={KEY_OG_DESCRIPTION} />
        <meta name="description" content={desc} key={KEY_DESCRIPTION} />
        <meta name="twitter:description" content={desc} key={KEY_TWITTER_DESCRIPTION} />

        <meta property="og:image" content={image} key={KEY_OG_IMAGE} />
        <meta name="twitter:card" content={image} key={KEY_TWITTER_CARD} />
        <meta property="twitter:image" content={image} key={KEY_TWITTER_IMAGE} />

        <meta property="og:site_name" content={siteName} key={KEY_OG_SITE_NAME} />
        <meta name="twitter:site" content={siteName} key={KEY_TWITTER_SITE} />
        {children}
      </Head>
    );
  }
}
