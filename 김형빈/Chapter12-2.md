## 정적 가져오기

```jsx
import React from "react";

// Statically import Chatlist, ChatInput and UserInfo
import UserInfo from "./components/UserInfo";
import ChatList from "./components/ChatList";
import ChatInput from "./components/ChatInput";

import "./styles.css";

console.log("App loading", Date.now());

const App = () => (
  <div className="App">
    <UserInfo />
    <ChatList />
    <ChatInput />
  </div>
);

export default App;
```

```jsx
import EmojiPicker from "./Picker"

const ChatInput = () => {
 ...
};
```

- 컴포넌트들을 정적으로 가져오면, 웹팩은 모듈들을 초기 번들에 포함시키게 된다.

- 위 소스코드는 `main.bundle.js`라는 하나의 번들에 포함된다.
- 번들 크기가 커지면 앱이 로딩되기까지의 시간에 악영향을 주며 특히 사용자의 단말 성능이나 네트워크 환경에 따라 더 영향을 줄 수 있다.
- `App` 컴포넌트가 화면에 그려지기 전에 먼저 모든 모듈들이 로드되어 파싱이 끝나야 한다.

## 동적 가져오기 (상호작용시 가져오기)

- 위 코드에서 중요 컴포넌트가 4가지 존재한다.
  - `UserInfo, ChatList, ChatInput, EmojiPicker`
- 그러나 페이지가 처음 로드될 때에는 이 중에 세가지 컴포넌트만 있어도 된다
  - `UserInfo, ChatList, ChatInput`
- `EmojiPicker` 는 직접적으로 보여지지 않고, 사용자가 이모지 버튼을 눌러을 때만 보여주면 된다. 따라서 `EmojiPicker`를 초기 번들에 포함하여 불필요하게 로딩 타임을 증가시킬 필요가 없다.

### 방법1. Suspense

- React.Suspense는 동적으로 로드되어야 하는 컴포넌트를 받고 App 컴포넌트가 컨텐츠를 렌더링 할 때 EmojiPicker 를 가져오는것을 일시적으로 중단하도록 하여 빠르게 화면을 그릴 수 있다.
- 사용자가 이모지 버튼을 클릭하면 EmoiPicker 컴포넌트가 렌더링된다.
- 이 때 EmojiPicker컴포넌트는 원래 렌더링 되어야 하는 EmojiPicker 모듈을 prop으로 받은 Suspense 컴포넌트를 렌더링한다.

```jsx
import React, { Suspense, lazy } from "react";
// import Send from "./icons/Send";
// import Emoji from "./icons/Emoji";

const Send = lazy(() =>
  import(/*webpackChunkName: "send-icon" */ "./icons/Send")
);
const Emoji = lazy(() =>
  import(/*webpackChunkName: "emoji-icon" */ "./icons/Emoji")
);
// <EmojiPicker /> 컴포넌트를 지연 로드
const Picker = lazy(() =>
  import(/*webpackChunkName: "emoji-picker" */ "./EmojiPicker")
);

const ChatInput = () => {
  const [pickerOpen, togglePicker] = React.useReducer((state) => !state, false);

  return (
    <Suspense fallback={<p id="loading">Loading...</p>}>
      <div className="chat-input-container">
        <input type="text" placeholder="Type a message..." />
        <Emoji onClick={togglePicker} />
        {pickerOpen && <Picker />}
        <Send />
      </div>
    </Suspense>
  );
};

console.log("ChatInput loaded", Date.now());

export default ChatInput;
```

### 방법2. loadable

- 리액트 18 이전까지 SSR 환경에서 React.Suspense의 대안
- CSR에서도 모듈을 동적 로드하기 위해 사용할 수 있다.

```jsx
import React from "react";
import loadable from "@loadable/component";

import Send from "./icons/Send";
import Emoji from "./icons/Emoji";

const EmojiPicker = loadable(() => import("./EmojiPicker"), {
  fallback: <div id="loading">Loading...</div>,
});

const ChatInput = () => {
  const [pickerOpen, togglePicker] = React.useReducer((state) => !state, false);

  return (
    <div className="chat-input-container">
      <input type="text" placeholder="Type a message..." />
      <Emoji onClick={togglePicker} />
      {pickerOpen && <Picker />}
      <Send />
    </div>
  );
};

console.log("ChatInput loaded", Date.now());

export default ChatInput;
```

## 동적 가져오기 (화면에 보이는 순간 가져오기)

- 화면에 표시 되는지 확인하려면 `IntersectionObserver API`를 사용
- 혹은 `react-loadable-visibility` 또는 `react-lazyload`와 같은 라이브러리를 활용하여 애플리케이션이 보이는지에 따라 가져오는 기능을 쉽게 추가할 수 있다.

```jsx
import React from "react";
import Send from "./icons/Send";
import Emoji from "./icons/Emoji";
import LoadableVisibility from "react-loadable-visibility/react-loadable";

const EmojiPicker = LoadableVisibility({
  loader: () => import("./EmojiPicker"),
  loading: <p id="loading">Loading</p>,
});

const ChatInput = () => {
  const [pickerOpen, togglePicker] = React.useReducer((state) => !state, false);

  return (
    <div className="chat-input-container">
      <input type="text" placeholder="Type a message..." />
      <Emoji onClick={togglePicker} />
      {pickerOpen && <Picker />}
      <Send />
    </div>
  );
};

console.log("ChatInput loaded", Date.now());

export default ChatInput;
```

## 코드 스플리팅

### 경로 기반 분할

- 특정 경로에 필요한 리소스만 요청하는 방법
- Suspense 또는 loadable-components와 react-router 같은 라이브러리를 함께 사용하여 현재 경로에 따른 컴포넌트를 동적으로 로드할 수 있다.

```jsx
import React, { lazy, Suspense } from "react";
import { render } from "react-dom";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

const App = lazy(() => import(/* webpackChunkName: "home" */ "./App"));
const Overview = lazy(() =>
  import(/* webpackChunkName: "overview" */ "./Overview")
);
const Settings = lazy(() =>
  import(/* webpackChunkName: "settings" */ "./Settings")
);

render(
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/">
          <App />
        </Route>
        <Route path="/overview">
          <Overview />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
      </Switch>
    </Suspense>
  </Router>,
  document.getElementById("root")
);

module.hot.accept();
```

- 라우트 경로별로 컴포넌트 지연 로딩을 적용하여 현재 라우팅 경로에서 필요한 번들만 다운로드 받음
- 대부분의 사용자는 페이지 이동 시 로딩이 있는 것에 익숙하기 때문에 컴포넌트를 지연로딩시키기 최적의 타이밍이다.

### 번들 분할

- 최신 웹 앱을 개발할 때 Webpack이나 Rollup 같 번들러는 앱의 소스 코드를 하나 이상의 번들 파일로 묶는다. 사용자가 웹 사이트에 접속하면 필요한 데이터와 기능을 표시하기 위한 특정 번들이 요청되고 로드된다.
- V8과 같은 자바스크립트 엔진은 사용자가 요청한 데이터를 로드하면서 동시에 파싱 및 컴파일 할 수 있다. 최신 브라우저는 코드를 최대한 빠르고 효율적으로 파싱하고 컴파일하도록 발전했지만, 요청된 데이터의 로딩 및 실행 시간 최적화는 아직 개발자의 몫이다. 이 "실행 시간"을 가급적 짧게 유지하며 메인 스레드를 블록하지 않도록 해야 한다.
- 최신 브라우저는 번들이 도착하는 즉시 `스트리밍`을 할 수 있지만, 만들어진 번들의 크기가 클 경우 화면에 첫 픽셀을 그려내기 까지 시간이 꽤 걸릴 수 있다.

> `스트리밍`이란 파일 전체를 한번에 받는 것이 아니라 부분부분씩 받아 적용하는 것을 뜻한다.

- 사용자가 보는 데이터를 빨리 보여줄 필요가 있는데 이때, 번들 크기를 줄이는 방법(로딩 타임, 프로세스 타임, 실행 시간을 줄이는 방법)을 사용할 수 있다.

### 번들 분할이 영향을 주는 지표

- FCP
  - 번들 분할 시 번들의 로딩, 처리 및 실행 시간을 줄여 첫 번째 콘텐츠가 사용자 홤녀에 표시되는 시간을 단축시킴
- LCP
  - 화면에서 가장 큰 컨텐츠가 화면에 렌더링 되는 시간도 단축시킨다.
- TTI
  - 앱은 번들 파일들이 로드되고 실행되어야 UI 상호작용이 가능해진다.

### 지표를 통해 알아보는 번들 분할이 필요한 이유

- 번들이 크다고 해서 실행시간이 항상 오래 걸리는 것은 아니다.
- 사용자가 실제로 사용하지도 않는 많은 코드들을 로드할 수 있는데, 번들의 일부분은 특정 상호작용을 통해서만 실행될 수 있고, 해당 상호작용은 사용자가 할 수도 있고 안할 수도 있다.
- 이렇게 되다면 사용자가 화면에 아무것도 볼 수 없을 때에도, 엔진은 사용하지 않을지도 모르는 코드들을 로드, 파싱, 컴파일해야 한다. 브라우저 성능이 좋다면 이 과정에 드는 비용이 크지 않을 수 있으나, 크기가 큰 번들을 가져오는 것은 여전히 성능에 문제를 일으킬 수 있으며, 사용자의 단말 성능이 떨어지거나 네트워크 상태가 불안정하다면 번들을 가져오는데 많은 시간을 기다려야 할 수 있다.
- 따라서 초기 로딩 시 현재 페이지에서 우선순위가 높지 않은 코드를 요청할 때는 초기 페이지 렌더링에 필요한 코드와 분리해서 로드하는 것이 좋다.

## PRPL 패턴

전 세계 사용자들이 애플리케이션을 원할하게 이용할 수 있도록 만드는 것은 쉽지 않은 과제인데, 이는 저사양 기기나 인터넷 연결이 불안정한 지역에서도 애플리케이션이 원할하게 작동해야 하기 때문이다.

### PRPL의 핵심 성능 고려사항

Push: 중요한 리소스를 효율적으로 푸시하여 서버 왕복 횟수를 최소화하고 로딩 시간을 단축한다.
Render: 초기 탐색 경로에 대한 페이지를 가능한 빨리 렌더링한다.
Pre-cache: 자주 방문하는 경로를 캐싱하여 서버 요청 횟수를 줄인다.
Lazy-load: 자주 요청 되지 않는 경로나 에셋(asset)은 지연로딩한다.

## 로딩 우선 수위

로딩 우선순위 패턴은 필요하다고 예상되는 특정 리소스를 우선적으로 요청하도록 설정

`Preload(<link rel="preload">)`는 브라우저의 최적화 기능으로, 브라우저가 늦게 요청할 수도 있는 중요한 리소스를 더 일찍 요청할 수 있도록 한다. 주요 리소스의 로딩 순서를 수동으로 지정한다면, `핵심 웹 지표(CWV)`에 긍정적인 영향을 줄 수 있지만, preload가 만능은 아니므로 장단점을 잘 이해하고 있어야한다.

### Preload 장점

- `TTI(Time To Interactive)`나 `FIP(First Input Delay)`를 최적화 할 때. preload는 상호작용 코드들이 포함된 번들을 로드할 때 유용하다.

### Preload 단점

- 우선순위가 높아진 스크립트 때문에 이미지나 폰트 등의 리소스들이 밀려 `FCP(First Contentful Paint)`, `LCP(Largest Contentful Paint)`가 늦어지지 않도록 해야 한다.

> 자바스크립트 자체의 로딩을 최적화하기 위해 `<script defer>`를 사용하며 `<body>`태그 보다는. `<head>`태그 안에 두어 해당 리소스가 빨리 발견되도록 할 수도 있다.

## SPA의 Preload

`Prefetch`이 곧 사용될 지 모르는 리소스들을 캐시하는 방법이라면, `Preload`는 즉시 사용될 리소스를 미리 로드한다.

`Preload`가 필요한 컴포넌트는 메인 번들에 포함되어 있지 않더라도 병렬로 로드되어야하며, 이 떄 `Prefetch`처럼 코드에 특정 주석을 사용하여 Webpack에게 해당 모듈을 preload해야 한다고 알려줄 수 있다.

```js
const EmojiPicker = import(/* webpackPreload: true */ "./EmojiPicker");
```

앱을 번들해 보면 아래와 같이 EmojiPicker가 preload될 것이라는 것을 콘솔에서 확인할 수 있다.

번들 결과를 확인해 보면 문서의 <head>태그에 rel="preload"속성이 있는 <link>태그가 추가된 것을 확인할 수 있다.

```html
<link rel="prefetch" href="emoji-picker.bundle.js" as="script" />
<link rel="prefetch" href="vendors~emoji-picker.bundle.js" as="script" />
```

이렇게 처리된 EmojiPicker는 초기 번들과 병렬로 다운로드된다. prefetch는 브라우저가 네트워크 상황을 고려하여 리소스를 받아오기를 결정하지만, preload는 즉시 미리 로드된다.

초기 렌더링 후 EmojiPicker를 따로 받는 시간을 기다려야 하는것과 달리, 거의 즉시 해당 리소스를 사용할 수 있게 되었다. 하지만 이런식으로 리소스의 우선순위를 설정하게 되면 사용자의 장치 성능이나 인터넷 연결 상태에 따라 초기 로딩을 꽤 지연시킬 수도 있다. 초기 렌더링 후 1초 정도 이내에 즉시 출력되어야 하는 리소스에만 제한적으로 사용하는 것이 좋다.

### Preload 와 script async 속성 함께 사용하기

스크립트의 우선순위를 높여 다운로드하고 싶지만 파싱 처리 과정이 메인스레드를 블록하는것을 피하고 싶다면 preload와 async속성을 함께 이용하는것도 방법이다. 하지만 다른 리소스들의 다운로드가 지연될 수 있으니 주의가 필요하다.

```html
<link rel="preload" href="emoji-picker.js" as="script" />

<script src="emoji-picker.js" async></script>
```

### Chrome 95 이상에서의 Preload

Chrome 95버전 부터 preload 대기열이 일부 건너뛰어지는 버그가 수정되었다. 따라서 해당 기능을 더 안정적으로 사용할 수 있게 되었다. 다음은 Google Chrome개발팀인 Patrick Meenan이 이야기하는 preload를 사용할 때의 권장 사항들이다.

- HTTP 헤더에 preload를 포함하면 다른 모든 리소스보다 우선시되어 다운로드 된다.
- 일반적으로 preload 리소스들은 우선순위가 “중간”인 리소스들보다 높으며, 파서가 발견하는 순서대로 로드된다. 따라서 HTML의 시작 부분에 포함시킬때 주의가 필요하다.
- 폰트 preload는 head의 마지막이나 body의 시작지점에 코드를 두는 것이 적합하다.
- 미리 로드 되는 모듈을 가져오는 건 실제 스크립트가 먼저 로드/파싱되도록 해당 가져오기가 필요한 `<script>` 태그 다음에 위치해야 한다.
- preload처리 된 이미지들은 따로 지정하지 않는 한 낮은 우선순위를 갖게 되며 비동기 스크립트 혹은 기타 우선순위가 낮거나 매우 낮음 표시괸 태그를 기준으로 정렬되어야 한다.

## 리스트 가상화

<div>리스트 가상화는 대규모 데이터 리스트의 렌더링 성능을 향상시키는 기술이다. 전체 목록을 모두 렌더링하는 대신 현재 화면에 보이는 행만 동적으로 렌더링한다. 렌더링 되는 행은 전체 목록의 중 사용자의 스크롤에 따라 움직이는 화면에 보이는 일부이다. </div>

리액트에서는 `react-virtualized` 같은 라이브러리를 사용해 구현할 수 있다.

### 리스트 가상화의 동작 방식

`react-virtualiezd`의 윈도잉이 동작하기 위해선 아래 요소들이 필요하다.

- `position: relative` 속성을 가지는 작은 컨테이너 DOM 요소 (ex. `<ul>`)
- 스크롤을 위한 큰 돔 엘리먼트
- 컨테이너 내부에 위치하고 absolute 포지션 속성을 가지며 top, left, width, height 속성을 설정한 자식 요소들

목록 가상화는 목록의 1000여개의 요소들을 일시에 렌더링(초기 렌더링 지연이나 스크롤 성능에 영향을 줄 수 있는)하지 않고 사용자에게 보이는 아이템만 렌더링하는 데에 중점을 두고 있다.이는 중·저사양의 기기들에서 목록을 빠르게 렌더링하는 데 도움을 준다. 이전 아이템들을 제거하고 새로운 아이템들로 교체하면서, 사용자의 스크롤에 따라 더 많은 아이템들을 불러오고 보여줄 수 있다.

### react-window

- react-window는 react-virtualized의 저자가 용량이 더 작고, 빠르고, 트리 셰이킹에 더 적합하게 만든 라이브러리다.
- tree-shakable한 라이브러리의 크기는 어떤 API를 사용하기로 선택했느냐에 따라 달라진다. react-virtualized의 경우, ~20-30KB(gzipped)까지 용량을 줄일 수 있었다:
- 두 라이브러리의 API는 대부분 비슷하지만, react-window가 조금 더 심플하다. react-window는 다음과 같은 컴포넌트들을 포함하고 있다.

### List 컴포넌트

- List 컴포넌트는 윈도윙된 요소들의 List 아이템, 즉 사용자에게 현재 보여지는 요소들(e.g FixedSizeList, VariableSizeList)만 렌더링한다. 그리드를 이용해 행들을 렌더하며 props를 내부 그리드에 전달한다.

#### react로 데이터 목록 렌더링
```jsx
import React from "react";
import ReactDOM from "react-dom";

const itemsArray = [
  { name: "Drake" },
  { name: "Halsey" },
  { name: "Camillo Cabello" },
  { name: "Travis Scott" },
  { name: "Bazzi" },
  { name: "Flume" },
  { name: "Nicki Minaj" },
  { name: "Kodak Black" },
  { name: "Tyga" },
  { name: "Buno Mars" },
  { name: "Lil Wayne" }, ...
]; // our data

const Row = ({ index, style }) => (
  <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
    {itemsArray[index].name}
  </div>
);

const Example = () => (
  <div
    style=
    class="List"
  >
    {itemsArray.map((item, index) => Row({ index }))}
  </div>
);

ReactDOM.render(<Example />, document.getElementById("root"));
```

#### react-window 사용 예시

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FixedSizeList as List } from "react-window";

const itemsArray = [...]; // our data

const Row = ({ index, style }) => (
  <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
    {itemsArray[index].name}
  </div>
);

const Example = () => (
  <List
    className="List"
    height={150}
    itemCount={itemsArray.length}
    itemSize={35}
    width={300}
  >
    {Row}
  </List>
);

ReactDOM.render(<Example />, document.getElementById("root"));
```
### Grid 컴포넌트
그리드는 수평과 수직 방향을 따라 표(테이블) 형태의 데이터를 가상화해서 렌더링한다. 현재 수평/수직 스크롤 위치에 따라 필요한 그리드 셀들만 렌더링한다.


```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { FixedSizeGrid as Grid } from 'react-window';

const itemsArray = [
  [{},{},{},...],
  [{},{},{},...],
  [{},{},{},...],
  [{},{},{},...],
];

const Cell = ({ columnIndex, rowIndex, style }) => (
  <div
    className={
      columnIndex % 2
        ? rowIndex % 2 === 0
          ? 'GridItemOdd'
          : 'GridItemEven'
        : rowIndex % 2
          ? 'GridItemOdd'
          : 'GridItemEven'
    }
    style={style}
  >
    {itemsArray[rowIndex][columnIndex].name}
  </div>
);

const Example = () => (
  <Grid
    className="Grid"
    columnCount={5}
    columnWidth={100}
    height={150}
    rowCount={5}
    rowHeight={35}
    width={300}
  >
    {Cell}
  </Grid>
);

ReactDOM.render(<Example />, document.getElementById('root'));
```