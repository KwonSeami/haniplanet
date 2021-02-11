export default function waterMarkCanvas(text, options) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const chunkWidth = options.chunkWidth;
  const chunkHeight = options.chunkHeight;
  const canvasWidth = chunkWidth * 3;
  const canvasHeight = chunkHeight * 3;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.textAlign = options.textAlign;
  ctx.textBaseline = options.textBaseline;
  ctx.globalAlpha = options.globalAlpha;
  ctx.font = options.font;

  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  ctx.rotate(options.rotateAngle);

  ctx.translate((-canvasWidth / 2) * 1.2, (-canvasHeight / 2) * 1.2);
  ctx.fillStyle = options.fillStyle;

  const angleHeight = Math.abs(options.rotateAngle) * canvasHeight;
  const waterMarkText = [];
  const horizontalChunkCount = Math.ceil(canvasWidth / chunkWidth) + 1;
  const verticalChunkCount = Math.ceil((canvasHeight + angleHeight) / chunkHeight) + 1;

  for (let j = 0, initY = chunkHeight / 2, indent = 0; j <= verticalChunkCount; j += 1) {
    indent = parseInt(j % 2);

    for (let i = 0, initX = chunkWidth / 2; i <= horizontalChunkCount; i += 1) {
      waterMarkText.push({
        text,
        x: i * chunkWidth + indent * initX,
        y: j * chunkHeight + initY,
      });
    }
  }

  waterMarkText.forEach(item => {
    ctx.fillText(item.text, item.x, item.y - angleHeight);
  });

  return ctx.canvas.toDataURL();
}