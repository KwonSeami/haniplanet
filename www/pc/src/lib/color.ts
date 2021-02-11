export const getRandomColor = () => {
  const hexColorLetters = '0123456789ABCDEF';
  const colorRange = hexColorLetters.length;
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += hexColorLetters[Math.floor(Math.random() * colorRange)];
  }

  return color;
};
