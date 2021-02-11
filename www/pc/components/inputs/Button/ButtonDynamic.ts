import dynamic from 'next/dynamic';

const ButtonDynamic = dynamic({
  ssr: false,
  loader: () => import('.'),
});

export default ButtonDynamic;