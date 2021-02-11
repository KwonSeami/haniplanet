import dynamic from 'next/dynamic';

const InputDynamic = dynamic({
  ssr: false,
  loader: () => import('.'),
});

export default InputDynamic;