# Haniplanet Package

한의플래닛 내에서 사용되는 Package Module을 모아놓은 디렉토리입니다.

## 패키지 분리

### 코드 작성

`packages/example` 폴더를 아래 구조 컨벤션에 맞춰 복사한 뒤, `index.ts`, `package.json`, `rollup.config.js` 파일을 수정합니다.

### 테스트 코드 작성

작성한 사람이 아닌 다른 사람이 모듈을 수정할 경우, 모든 경우에 대한 테스트를 할 수 없습니다.

현재 구조상, import하기 전까지는 테스트를 하기 힘들며, link를 거는 것 또한 번거로워 각각의 모듈에 대해 테스트 코드가 필요해 보입니다.

### 빌드

빌드를 더욱 간략화시키기 위해 `rollup`을 적용하였습니다.

`yarn build` 명령어를 사용해 빌드할 수 있습니다.

### 배포

1. 배포 전, packages.json 파일의 name을 확인해야 합니다. name은 다음과 같아야 합니다.
   - `@hanii/"package 이름"`
2. `npm login` 명령어를 입력해 npm 계정에 로그인합니다.
3. `npm publish` 명령어를 입력해 패키지를 배포합니다.
4. [hanii npmjs](https://www.npmjs.com/settings/hanii/packages)에 잘 등록되어 있는지 확인합니다.

## 구조

- packages
  - apis : 공용으로 사용되는 API입니다. axiosInstance, BaseApi 등의 파일은 lib 레포 내로 이동되어야 합니다.
  - types : 공용으로 사용되는 타입입니다.
  - constants : 공용으로 사용되는 상수입니다. env 파일이 제거되어야 합니다.
  - components : 공용으로 사용되는 컴포넌트입니다.
  - services : 서비스를 모듈로 작성하는 경우 해당 폴더 내에 작성되어야 합니다.

## 주의사항

모듈을 분리할 때는 재사용 가능한 것인가를 생각해야 합니다.

한 곳에서만 사용된다면, 분리하지 않는 게 더 나을 수 있습니다. 또한, 재사용 가능한 범위를 넓히기 위해, 재사용할 수 있는 가장 작은 단위로 분리한 뒤, 이를 조합해서 사용하면 됩니다.

테스트를 해야 하는 경우, `npm publish`를 매번 해야 한다면, 버전이 더욱 더러워지게 될 것입니다. 개발한 모듈에 대한 테스트를 진행할 때 `yarn link` 등을 사용하면 `publish`하지 않고도 테스트를 진행할 수 있습니다. 이에 대한 내용은 아래에서 자세히 서술하겠습니다.

## 팁

### publish하지 않고 테스트

`publish`하지 않고 테스트하는 방법은 크게 두 가지가 있습니다.

#### yarn link

모듈을 개발하는 경우, 모듈을 프로젝트에 연결할 수 있습니다. 이 기능은 모듈을 테스트하거나, 디버깅할 때 유용합니다.

1. 링크할 모듈의 경로에 `yarn link` 커맨드를 터미널 또는 명령 프롬프트에 입력하여 링크할 준비를 합니다.
2. 모듈을 링크할 프로젝트로 이동합니다.
3. `yarn link 모듈명` 커맨드를 터미널 또는 명령 프롬프트에 입력하여 프로젝트를 테스트합니다.

```bash
[예시, react 모듈을 react-reply 프로젝트에 적용하는 경우]

$ cd react
$ yarn link
yarn link vx.x.x
success Resistered "react".
info You can now run `yarn link "react"` in the projects where you want to use this module and it will be used instead.

$ cd ../react-reply
$ yarn link react
yarn link vx.x.x
success Registered "react".
```

위와 같은 절차를 거치면, `react-reply/node_modules/react`라고 하는 심볼릭 링크가 생성되어, `react` 프로젝트의 로컬 복사본에 연결됩니다.

이 과정을 되돌리려면 간단히 `yarn unlink` 또는, `yarn unlink [package]`를 입력합니다.

#### dist 폴더 복사

`yarn build` 명령을 수행하면 모듈 내에 `dist` 폴더가 생성됩니다.

위 `dist` 폴더를 프로젝트의 모듈 내에 있는 `dist` 폴더와 교체하면 수정된 모듈이 적용됩니다.
