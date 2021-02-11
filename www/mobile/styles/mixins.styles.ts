interface IFontStyleMixin {
  size?: number;
  family?: string;
  weight?: string;
  color?: string;
  style?: string;
}

interface IBackgroundImgMixin {
  img: string;
  size?: string;
  position?: string;
  color?: string;
}

export const heightMixin = (height: number) => `
  height: ${height}px;
  line-height: ${height - 2}px;
`;

export const lineEllipsisMixin = (fontSize: number, lineHeight: number, linesToShow: number) => `
  display: block; /* Fallback for non-webkit */
  display: -webkit-box;
  height: ${lineHeight * linesToShow}px; /* Fallback for non-webkit */
  margin: 0 auto;
  word-break: break-all;
  font-size: ${fontSize}px;
  line-height: ${lineHeight}px;
  -webkit-line-clamp: ${linesToShow};
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const maxLineEllipsisMixin = (fontSize: number, lh: number, linesToShow: number) => {
  const lineHeight = fontSize * lh;

  return `
    display: block; 
    display: -webkit-box;
    max-height: ${lineHeight * linesToShow}px;
    margin: 0 auto;
    word-break: break-all;
    font-size: ${fontSize}px;
    line-height: ${lineHeight}px;
    -webkit-line-clamp: ${linesToShow};
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
};
export const opacityMixin = (opc: number) => `
  opacity: ${opc};
  filter: alpha(opacity=${opc} * 100);
`;

export const backgroundImgMixin = (background: IBackgroundImgMixin = {} as any as IBackgroundImgMixin) => `
  background-image: url(${background.img});
  background-size: ${background.size ? background.size : 'cover'};
  background-position: ${background.position ? background.position : 'center'};
  ${background.color && `background-color: ${background.color}`};
  background-repeat: no-repeat;
`;

export const radiusMixin = (radius: string, borderColor: string) => `
  border-radius: ${radius};
  box-sizing: border-box;
  border: 1px solid ${borderColor};
`;

export const btnMixin = (width: number, height: number, fontSize: number, fontWeight: string, borderColor: string, fontColor?: string) => `
  width: ${width}px;
  ${heightMixin(height)};
  ${fontStyleMixin({
    size: fontSize,
    weight: fontWeight,
    color: fontColor
  })};
  box-sizing: border-box;
  border: 1px solid ${borderColor};
  
`;

export const inlineBlockMixin = (width: number) => `
  display: inline-block;
  vertical-align: middle;
  width: ${width}px;
  box-sizing: border-box;
`;

{/* TODO: @혜연 추후 리팩토링 진행하면서 전체적으로 적용할 예정입니다 */}
export const fontStyleMixin = (font: IFontStyleMixin = {}) => `
  color: ${font.color ? font.color : '#333'};
  ${font.size ? `font-size: ${font.size}px`: ``};
  ${font.weight ? `font-weight: ${font.weight}`: ``};
  ${font.family ? `font-family: '${font.family}'`: ``};
  ${font.style ? `font-style: ${font.style}` : ``};
`;


{/* TODO: @혜연 추후 리팩토링 진행하면서 추가할 부분입니다(아니면 한가할때)
  - heightMixin에 width와 boxsizing을 추가
  - inlineBlockMixin 부분 고민중 ? display로 묶을것인가, inline에 더 추가할 것이냐
*/}
