## 리액트 어플리케이션 구조

## 모듈, 기능 또는 경로별 그룹화 (기능별 그룹화)

### 예시

```js
example
 ┣ checkout
 ┃ ┣ checkout.css
 ┃ ┣ checkout.test.css
 ┃ ┗ index.js
 ┣ common
 ┃ ┣ Avatar.css
 ┃ ┣ Avatar.js
 ┃ ┣ ErrorUtils.js
 ┃ ┗ ErrorUtils.test.js
 ┗ product
 ┃ ┣ index.js
 ┃ ┣ price.js
 ┃ ┣ product.css
 ┃ ┗ product.test.js
 ```

### 장점

- 모듈에 변경사항이 있을 때 관련된 모든 파일이 같은 폴더에 모여 있어 변경사항이 특정 코드 영역으로 제한됩니다.

### 단점

- 모듈 간에 공통적으로 사용되는 컴포넌트, 로직 또는 스타일을 주기적으로 파악해야만 중복을 피하고 일관성과 재사용성을 높일 수 있습니다.

## 파일 유형별 그룹화

### 예시

```js
example
 ┣ css
 ┃ ┣ checkout.css
 ┃ ┣ global.css
 ┃ ┗ product.css
 ┣ lib
 ┃ ┣ currency.js
 ┃ ┣ date.js
 ┃ ┗ gtm.js
 ┗ pages
 ┃ ┣ checkout.js
 ┃ ┣ product.js
 ┃ ┗ productlist.js
 ```

 ### 장점

 - 여러 프로젝트에서 동일하게 사용할 수 있는 표준적인 구조를 사용합니다.
 - 애플리케이션별 로직에 대한 지식이 부족한 신규 팀원도 스타일이나 테스트 파일을 쉽게 찾을 수 있습니다.
 - 공통 컴포넌트나 스타일을 변경하면 애플리케이션 전체에 적용됩니다.

 ### 단점

 - 특정 모듈의 로직 변경 시 여러 폴더에 있는 파일들을 찾아가 수정해야 하는 경우가 있다. (Ex. api 변경)
 - 애플리케이션의 기능이 많아질수록 각 폴더의 파일수가 증가하여 특정 파일을 찾기 어려워질 수 있습니다.

## 도메인 및 공통 컴포넌트 기반의 혼합 그룹화

- 공통적으로 사용되는 컴포넌트들은 모두 Components 폴더에 그룹화
- 애플리케이션 흐름에 특화된 경로나 기능들을 모두 domain 폴더에 그룹화

### 예시

```js
example
 ┣ components
 ┃ ┣ User
 ┃ ┃ ┣ avatar.js
 ┃ ┃ ┣ profile.js
 ┃ ┃ ┗ profile.test.js
 ┃ ┣ currency.js
 ┃ ┣ date.js
 ┃ ┣ errorUtils.js
 ┃ ┗ gtm.js
 ┣ css
 ┃ ┗ global.css
 ┗ domain
 ┃ ┣ checkout
 ┃ ┃ ┣ checkout.css
 ┃ ┃ ┣ checkout.js
 ┃ ┃ ┗ checkout.test.js
 ┃ ┗ product
 ┃ ┃ ┣ product.css
 ┃ ┃ ┣ product.js
 ┃ ┃ ┗ product.test.js
 ```

### 평면적인 구조

```js
domain
 ┣ checkout.css
 ┣ checkout.js
 ┣ checkout.test.js
 ┣ product.css
 ┣ product.js
 ┗ product.test.js
 ```

### 입체체적인 구조

```js
domain
┣ product
┃ ┣ feature.css
┃ ┣ feature.js
┃ ┗ size.js
┗ product
┃ ┣ listprice.js
┃ ┗ discount.js
 ```


## 최신 리액트를 위한 어플리케이션 구조

### 리덕스

- 기능별로 따로 폴더를 분리하는 것보다 `덕스 패턴`을 사용하는 것을 권장합니다.
```js
src
┣ app
┃ ┣ store.ts
┃ ┣ rootReducer.ts
┃ ┗ App.tsx
┗ common
┗ features
┗ todos
┗ index.tsx
```

> #### 덕스 패턴
> {actionTypes, actions, reducer}를 modules라는 하나의 파일에서 관리하는 것을 의미합니다. 

### 컨테이너

- 컨테이너 컴포넌트와 상태 저장 컴포넌트로 분리하였다면 컨테이너 컴포넌트를 위한 별도의 폴더를 만들 수 있습니다.

```js
src
┣ components
┃ ┃ ┣ components1
┃ ┃ ┃ ┣ index.js
┃ ┃ ┃ ┗ styled.js
┣ containers
┃ ┃ ┣ container1
```

#### 프레젠테이션 컴포넌트

- 데이터 출력 및 데이터 처리를 담당하지 않는 컴포넌트 입니다.
- DOM 마크업과 스타일(UI)을 담당합니다.
- 예시
```jsx
import UserItem from './UserItem'
import './UsersList.css'

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <h2>No users found.</h2>
      </div>
    )
  }

  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places}
        />
      ))}
    </ul>
  )
}

export default UsersList
```

#### 컨테이너 컴포넌트

- 데이터 출력 및 데이터 처리를 담당하는 컴포넌트입니다.
- 데이터를 프레젠테이션 컴포넌트로 전달하는 역할을 합니다.
- 예시
```jsx
import React from 'react'
import UsersList from '../components/UsersList'

const Users = () => {
  // API 데이터 가져오는 부분
  const USERS = [
    {
      id: 'exampleId',
      name: 'exampleName',
      places: 3,
    },
  ]

  return <UsersList items={USERS} />
}

export default Users
```


### Hooks

- 혼합 구조에 잘 어울립니다.
- 단일 컴포넌트에 사용되는 hooks는 평면적인 구조로, 공통으로 사용되는 hooks는 입체적인 구조로 사용합니다.

```js
components
┣ productList
┃ ┣ index.js
┃ ┣ test.js
┃ ┣ style.css
┃ ┗ hook.js
┣ hooks
┃ ┃ ┣ useClickOutside
┃ ┃ ┃ ┗ index.js
┃ ┃ ┣ useData
┃ ┃ ┃ ┗ index.js
```

### Styled Components

```js
src/components/button
 ┣ index.js
 ┗ style.js
 ```

## 그 외 고려 사항

### Import aliasing 사용

- `../../../.....`으로 점점 길어지는 상대경로를 줄이기 위해 사용합니다.
- `@`를 맨 앞에 사용하게 되며, Babel 및 웹팩 설정을 통해 구현할 수 있습니다.

### 외부 라이브러리 API로 감싸기

- 자체 library 폴더를 만들어서 외부 라이브러리를 호출하여 필요한 경우 쉽게 교체할 수 있게 합니다.

### PropsType 사용

- 컴포넌트에 Prop Types를 사용하여 속성 값의 유형 검사를 실행합니다.

### 변환이 필요한 모듈에만 로더 적용하기

- 폴더 구조 내 여러 경로에서 파일을 포함하고 로드하는 방법은 다음과 같습니다.

```js
const path = require('path');

module.exports = {
    //...
    module: {
        rules:[
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, 'app/styles'),
                    // 현재 폴더 기준으로 `app/styles`로 시작하는 경로 포함
                    path.resolve(__dirname, 'vendor/styles/'),
                    // 슬래시('/')를 추가하여 `vedor/styles/` 폴더의 내용만 포함
                ]
            }
        ]
    }
}
```

- 다른 모듈을 참조하는 import, require, define 등이 없는 파일은 의존성 분석을 할 필요가 없습니다.
- 이럴 땐 noParse 옵션을 사용하여 이러한 파일의 파싱을 건너뛸 수 있습니다.
