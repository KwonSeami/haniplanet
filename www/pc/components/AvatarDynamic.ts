import dynamic from 'next/dynamic';

const AvatarDynamic = dynamic({
  ssr: false,
  loader: () => import('./Avatar'),
});

export default AvatarDynamic;