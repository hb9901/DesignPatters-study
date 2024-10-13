<h1>리액트 디자인 패턴</h1>

<h2>고차 컴포넌트</h2>

- 여러 컴포넌트에 동일한 로직을 재사용하는 방법 중 하나

> <h2>고차 컴포넌트 사용 예시</h2>

<h3>1. 여러 컴포넌트에 특정 스타일을 적용</h3>

```jsx
function withStyles(Component){
    return props => {
        const style = { padding: '0.2rem', margin: '1rem' }
        return <Component style={style} {...props}/>
    }
}

const Button = () = <button>Click me!</button>
const Text = () = <p>Hello World!</p>

const StyledButton = widthStyles(Button);
const StyledText  = widthStyles(Text);
```

<h3>2. 로딩 컴포넌트 분리</h3>

```jsx
import React, { useEffect, useState } from "react";

export default function withLoader(Element, url) {
  return (props) => {
    const [data, setData] = useState(null);

    useEffect(() => {
      async function getData() {
        const res = await fetch(url);
        const data = await res.json();
        setData(data);
      }

      getData();
    }, []);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return <Element {...props} data={data} />;
}
```

> <h2>고차 컴포넌트 조합하기</h2>

<h3>예시</h3>

- 전달받은 컴포넌트에 마우스 호버링 prop을 제공하는 고차 컴포넌트 제작

```jsx
export default withHover(
  withLoader(DogImages, "https://dog.ceo/api/breed/labrador/images/random/6")
);
```

<h3>고차 컴포넌트의 장점</h3>

- 재사용하고자 하는 로직을 한 곳에 모아 관리할 수 있다.
- 효과적으로 관심사를 분리할 수 있다.

<h3>고차 컴포넌트의 단점</h3>

**1. 고차 컴포넌트가 대상 컴포넌트에 전달하는 prop의 이름은 충돌을 일으킬 수 있다.**

```jsx
function withStyles(Component) {
  return (props) => {
    const style = { padding: "0.2rem", margin: "1rem" };
    return <Component style={style} {...props} />;
  };
}

const Button = () => <button style={{ color: "red" }}>Click me!</button>;
const StyledButton = withStyles(Button);
```

- 위의 예시에서 Style Button 컴포넌트는 `<Component style={ padding: '0.2rem', margin: '1rem' } style={{ color: 'red'}}>`로 스타일이 덮어씌워질 수 있다.
- 이를 해결하기 위해서는 다음과 같이 수정할 수 있다.

```jsx
function withStyles(Component) {
  return (props) => {
    const style = { padding: "0.2rem", margin: "1rem", ...props.style };
    return <Component style={style} {...props} />;
  };
}

const Button = () => <button style={{ color: "red" }}>Click me!</button>;
const StyledButton = withStyles(Button);
```

**2. 여러 고차 컴포넌트를 조합하여 사용하게 되면 어떤 고차 컴포넌트가 어떤 prop을 제공하는지 파악하기 어렵다.**

- 디버깅과 어플리케이션 확장에 어려움이 생길 수 있다.

**3. 컴포넌트의 트리가 깊어지는 상황이 발생할 수 있다.**

```jsx
<withAuth>
  <withLayout>
    <withLogging>
      <Component />
    </withLogging>
  </withLayout>
</withAuth>
```

- 위의 코드와 같이 트리가 깊어지는 상황이 발생할 수 있다.
- 이 때 React의 훅을 사용해서 트리가 깊어지는 상황을 줄일 수 있다.
  - [React 문서](https://legacy.reactjs.org/docs/hooks-faq.html#do-hooks-replace-render-props-and-higher-order-components)

<h2> 렌더링 Props 패턴</h2>

- 렌더링 prop은 JSX 요소를 반환하는 함수 값을 가지는 컴포넌트의 prop
- 자신의 렌더링 로직을 구현하는 대신, 렌더링 prop을 호출한다.

```jsx
const Title = (props) => props.render();
```

- Title 컴포넌트 내에서는 단순히 prop의 render 함수를 호출하여 반환한다.

```jsx
<Title render={() => <h1>I am a render prop!</h1>}>
```

- Title 컴포넌트에 render prop을 넣으면 해당 함수를 호출하여 반환한다
- 여기서는 `<h1>I am a render prop!</h1>`을 반환한다.

> <h3>랜더링 props의 장점1</h3>

```jsx
import React from "react";
import { render } from "react-dom";
import "./styles.css";

const Title = (props) => props.render();

render(
  <div className="App">
    <Title render={() => <h1>✨ First render prop! ✨</h1>} />
    <Title render={() => <h2>🔥 Second render prop! 🔥</h2>} />
    <Title render={() => <h3>🚀 Third render prop! 🚀</h3>} />
  </div>,
  document.getElementById("root")
);
```

- prop을 받는 컴포넌트가 재사용성이 좋다.
- 한 컴포넌트를 여러 번 사용하면서 매번 다른 값을 렌더링 prop에 전달할 수 있다.

<br/>

> <h3>랜더링 props의 장점2</h3>

```jsx
import React from "react";
import { render } from "react-dom";
import "./styles.css";

const Title = (props) => (
  <>
    {props.renderFirstComponent()}
    {props.renderSecondComponent()}
    {props.renderThirdComponent()}
  </>
);

render(
  <div className="App">
    <Title
      renderFirstComponent={() => <h1>✨ First render prop! ✨</h1>}
      renderSecondComponent={() => <h2>🔥 Second render prop! 🔥</h2>}
      renderThirdComponent={() => <h3>🚀 Third render prop! 🚀</h3>}
    />
  </div>,
  document.getElementById("root")
);
```

- 이 패턴의 이름이 렌더링 prop이지만 넘기는 prop의 이름을 꼭 render로 할 필요는 없다.
- JSX를 렌더링하는 어떤 prop이던 render prop으로 볼 수 있다.

> <h3>랜더링 props의 장점3</h3>

```jsx
<Component render={(data) => <ChildComponent data={data} />} />
```

```jsx
function Component(props) {
  const data = { ... }

  return props.render(data)
}
```

- 렌더링 prop은 JSX 엘리먼트를 렌더링하는 것 외에도 많은 동작을 할 수 있다.
- 단지 함수를 호출하는 것 대신에 렌더링 prop 함수를 호출할 때 인자를 전달할 수 있다.

<h3>상태 끌어올리기</h3>

```jsx
function Input({ value, handleChange }) {
  return <input value={value} onChange={(e) => handleChange(e.target.value)} />;
}

export default function App() {
  const [value, setValue] = useState("");

  return (
    <div className="App">
      <h1>☃️ Temperature Converter 🌞</h1>
      <Input value={value} handleChange={setValue} />
      <Kelvin value={value} />
      <Fahrenheit value={value} />
    </div>
  );
}
```

- Input의 상태를 부모 컴포넌트로 올려보내는 방법
- 이때 많은 자식 컴포넌트가 존재한다면 상태가 변경 될 때마다 데이터를 사용하지 않는 자식 컴포넌트도 리렌더링이 발생하게 되므로 성능에 악영향을 줄 수 있다.
- 이를 앞서 보았던 렌더링 props 기법으로 최적화할 수 있다.

```jsx
function Input(props) {
  const [value, setValue] = useState("");

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Temp in °C"
      />
      {props.render(value)}
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <h1>☃️ Temperature Converter 🌞</h1>
      <Input
        render={(value) => (
          <>
            <Kelvin value={value} />
            <Fahrenheit value={value} />
          </>
        )}
      />
    </div>
  );
}
```

<h3> 컴포넌트의 자식으로 함수 전달하기</h3>

- 위 prop 렌더링 기법을 통해 최적화를 진행한 코드에 `props.render` 대신 `props.children`에 사용자 입력 값을 전달한다.

```jsx
export default function App() {
  return (
    <div className="App">
      <h1>☃️ Temperature Converter 🌞</h1>
      <Input>
        {(value) => (
          <>
            <Kelvin value={value} />
            <Fahrenheit value={value} />
          </>
        )}
      </Input>
    </div>
  );
}
```

```jsx
function Input(props) {
  const [value, setValue] = useState("");

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Temp in °C"
      />
      {props.children(value)}
    </>
  );
}
```

<h3>렌더링 prop 패턴의 장점</h3>

- 여러 컴포넌트 사이에서 로직과 데이터를 쉽게 공유할 수 있음
- 고차 컴포넌트 패턴에서 발생할 수 있는 이름 충돌 문제 해결
- 렌더링 prop을 통해 어플리케이션 로직과 렌더링 컴포넌트 분리 가능

<h3>렌더링 prop 패턴의 단점</h3>

- 리액트 Hooks는 렌더링 popr 패턴으로 해결할 수 있는 문제를 이미 해결함
- 렌더링 prop 패턴은 라이프사이클 관련 메서드를 추가할 수 없으므로, 받은 데이터를 변경할 필요가 없는 렌더링에 치중한 컴포넌트에만 사용할 수 있음

<h2>리액트 Hooks 패턴</h2>

- 클래스 컴포넌트를 사용할 때 겪는 일반적인 문제를 해결하기 위해 Hooks를 도입

<h3>기존의 클래스 컴포넌트</h3>

```js
class MyComponent extends React.Component {
  /* Adding state and binding custom methods */
  constructor() {
    super()
    this.state = { ... }

    this.customMethodOne = this.customMethodOne.bind(this)
    this.customMethodTwo = this.customMethodTwo.bind(this)
  }

  /* Lifecycle Methods */
  componentDidMount() { ...}
  componentWillUnmount() { ... }

  /* Custom methods */
  customMethodOne() { ... }
  customMethodTwo() { ... }

  render() { return { ... }}
}
```

- Hooks가 추가되기 전에 React에서 상태와 생명 주기 함수를 사용하려면 클래스 컴포넌트를 사용해야 했다.

<h3>클래스 컴포넌트의 문제점</h3>

<h4>1. ES2015의 클래스를 알아야 한다</h4>

- 생명 주기 메서드를 사용하려면 함수형 컴포넌트를 클래스 컴포넌트로 리펙토링해야만 했다.
- 예시

  - 'enabled'와 'diabled' 상태를 반영하는 button 컴포넌트 구현 ('useState' 예시)

  ```jsx
  function Button() {
    return <div className="btn">disabled</div>;
  }
  ```

  ```jsx
  export default class Button extends React.Component {
    constructor() {
      super();
      this.state = { enabled: false };
    }

    render() {
      const { enabled } = this.state;
      const btnText = enabled ? "enabled" : "disabled";

      return (
        <div
          className={`btn enabled-${enabled}`}
          onClick={() => this.setState({ enabled: !enabled })}
        >
          {btnText}
        </div>
      );
    }
  }
  ```

<h4>2. 구조 변경의 필요성</h4>

- 여러 컴포넌트에서 코드를 공유하기 위해 고차 함수 패턴이나 랜더링 prop 패턴을 사용한다.
- 위의 패턴들을 도입하려 할 땐 구조를 재설계해야 할 수 있다.
- 컴포넌트의 크기가 클수록 `Wrapper hell`이라는 안티 패턴이 나타날수도 있다.

```jsx
//Wrapper hell
<WrapperOne>
  <WrapperTwo>
    <WrapperThree>
      <WrapperFour>
        <WrapperFive>
          <Component>
            <h1>Finally in the component!</h1>
          </Component>
        </WrapperFive>
      </WrapperFour>
    </WrapperThree>
  </WrapperTwo>
</WrapperOne>
```

<h4>3. 복잡성 증가</h4>

- 생명주기 메서드들은 꽤 많은 코드의 중복을 만들어낸다.

<h2>상태 Hook</h2>

- 상태 관리는 `useState`를 사용
- 위의 Button 컴포넌트를 상태 Hook을 사용해서 리팩터링한 코드

  ```jsx
  export default function Input() {
    const [enabled, setEnabled] = useState(true);
    return (
      <div
        className={`btn enabled-${enabled}`}
        onClick={() => setEnabled((prvEnabled) => !prvEnabled)}
      >
        {btnText}
      </div>
    );
  }
  ```

<h3>Effect Hook</h3>

- `useEffect`훅을 사용하면 컴포넌트의 생명주기에 접근할 수 있다.
- useEffect훅은 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`를 하나로 합쳐 사용할 수 있다.

<h3>Custom Hook</h3>

- `useEffect`훅을 사용하면 컴포넌트의 생명주기에 접근할 수 있다.
- 모든 훅이 use로 시작한다. Hook 사용 규칙에 따라 모든 커스텀 Hook은 use로 시작해야 한다

<h3>Hook의 장점</h3>

1. 더 적은 코드 라인 수
2. 복잡한 컴포넌트의 단순화
3. 상태 관련 로직 재사용
4. UI에서 분리된 로직 공유

<h3>Hook의 단점</h3>

1. Hook 사용 규치기을 준수해야 함
2. 잘못된 사용에 주의