<h1>리액트 디자인 패턴</h1>

<h2>고차 컴포넌트</h2>

- 여러 컴포넌트에 동일한 로직을 재사용하는 방법 중 하나

><h2>고차 컴포넌트 사용 예시</h2>

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

export default function withLoader(Element, url){
    return (props) => {
        const [data, setData] = useState(null);

        useEffect(() => {
            async function getData() {
                const res = await fetch(url);
                const data = await res.json();
                setData(data);
            }
 
            getData();
        },[]);
    }

    if(!data){
        return <div>Loading...</div>;
    }

    return <Element {...props} data={data}/>
}
```

><h2>고차 컴포넌트 조합하기</h2>

<h3>예시</h3>

- 전달받은 컴포넌트에 마우스 호버링 propr을 제공하는 고차 컴포넌트 제작

```jsx
export default withHover(
    withLoader(DogImages, "https://dog.ceo/api/breed/labrador/images/random/6")
)
```

<h3>고차 컴포넌트의 장점</h3>

- 재사용하고자 하는 로직을 한 곳에 모아 관리할 수 있다.
- 효과적으로 관심사를 분리할 수 있다.

<h3>고차 컴포넌트의 단점</h3>

1. 고차 컴포넌트가 대상 컴포넌트에 전달하는 prop의 이름은 충돌을 일으킬 수 있다. 

```jsx
function withStyles(Component){
    return props => {
        const style = { padding: '0.2rem', margin: '1rem' }
        return <Component style={style} {...props} />
    }
}

const Button = () => <button style={{ color: 'red'}}>Click me!</button>
const StyledButton = withStyles(Button)
```

- 위의 예시에서 Style Button 컴포넌트는 `<Component style={ padding: '0.2rem', margin: '1rem' } style={{ color: 'red'}}>`로 스타일이 덮어씌워질 수 있다.
- 이를 해결하기 위해서는 다음과 같이 수정할 수 있다.

```jsx
function withStyles(Component){
    return props => {
        const style = { padding: '0.2rem', margin: '1rem', ...props.style }
        return <Component style={style} {...props} />
    }
}

const Button = () => <button style={{ color: 'red'}}>Click me!</button>
const StyledButton = withStyles(Button)
```

2. 여러 고차 컴포넌트를 조합하여 사용하게 되면 어떤 고차 컴포넌트가 어떤 prop을 제공하는지 파악하기 어렵다.
- 디버깅과 어플리케이션 확장에 어려움이 생길 수 있다.

<h2> 렌더링 Props 패턴</h2>

- 렌더링 prop은 JSX 요소를 반환하는 함수 값을 가지는 컴포넌트의 prop
- 컴포넌트 자체는 렌더링 prop 외에는 아무것도 렌더링 하지 않는다.
- 자신의 렌더링 로직을 구현하는 대신, 렌더링 prop을 호출한다.

```jsx
<Title render={() => <h1>I am a render prop!</h1>}>
```
```jsx
const Title = props => props.render()
```
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

><h3>랜더링 props의 장점</h3>
><div>prop을 받는 컴포넌트가 재사용성이 좋다.</div>
><div>한 컴포넌트를 여러 번 사용하면서 매번 다른 값을 렌더링 prop에 전달할 수 있다.</div>

<br/>

- 이 패턴의 이름이 렌더링 prop이지만 넘기는 prop의 이름을 꼭 render로 할 필요는 없다.
- JSX를 렌더링하는 어떤 prop이던 render prop으로 볼 수 있다.

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

- 렌더링 prop은 JSX 엘리먼트를 렌더링하는 것 외에도 많은 동작을 할 수 있다.
- 단지 함수를 호출하는 것 대신에 렌더링 prop 함수를 호출할 때 인자를 전달할 수 있다.

```jsx
function Component(props) {
  const data = { ... }

  return props.render(data)
}
```

```jsx
<Component render={data => <ChildComponent data={data} />} />
```

<h3>상태 끌어올리기</h3>


```jsx
function Input({ value, handleChange }) {
  return <input value={value} onChange={e => handleChange(e.target.value)} />
}

export default function App() {
  const [value, setValue] = useState('')

  return (
    <div className="App">
      <h1>☃️ Temperature Converter 🌞</h1>
      <Input value={value} handleChange={setValue} />
      <Kelvin value={value} />
      <Fahrenheit value={value} />
    </div>
  )
}
```

- Input의 상태를 부모 컴포넌트로 올려보내는 방법
- 이때 많은 자식 컴포넌트가 존재한다면 상태가 변경 될 때마다 데이터를 사용하지 않는 자식 컴포넌트도 리렌더링이 발생하게 되므로 성능에 악영향을 줄 수 있다.
- 이를 앞서 보았던 렌더링 props 기법으로 최적화할 수 있다.

```jsx
function Input(props) {
  const [value, setValue] = useState('')

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Temp in °C"
      />
      {props.render(value)}
    </>
  )
}

export default function App() {
  return (
    <div className="App">
      <h1>☃️ Temperature Converter 🌞</h1>
      <Input
        render={value => (
          <>
            <Kelvin value={value} />
            <Fahrenheit value={value} />
          </>
        )}
      />
    </div>
  )
}
```
<h3> 컴포넌트의 자식으로 전달하기</h3>

```jsx
export default function App() {
  return (
    <div className="App">
      <h1>☃️ Temperature Converter 🌞</h1>
      <Input>
        {value => (
          <>
            <Kelvin value={value} />
            <Fahrenheit value={value} />
          </>
        )}
      </Input>
    </div>
  )
}
```
```jsx
function Input(props) {
  const [value, setValue] = useState('')

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Temp in °C"
      />
      {props.children(value)}
    </>
  )
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