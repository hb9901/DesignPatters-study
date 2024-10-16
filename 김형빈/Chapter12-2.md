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
