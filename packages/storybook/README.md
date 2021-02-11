# Storybook

패키지에 대한 문서를 기록하기 위한 공간입니다.

## 준비
문서화 작업을 진행하기 전, 패키지 디렉토리 내에 `storybook` 디렉토리를 생성한 뒤, `.storybook/preview.js` 내에 해당 경로를 입력합니다.
 
만약, apis 패키지에 대한 문서를 작성한다면, `packages/apis` 디렉토리에 `storybook`을 생성한 뒤, `preview.js` 파일에 다음 라인을 추가합니다.
``` js
configure(require.context('../../apis/storybook/', true, /\.stories\.(ts|tsx|mdx)$/), module);
```

## 문서 작성
Storybook 문서 장성 방법에 대해서는 https://www.notion.so/Storybook-2958887a0fd64a41960e58c365cc79d1 를 참고해주세요