## \* Chapter 12 | 리액트 디자인 패턴

## ✔️ 12.1 리액트 소개

- 웹 인터페이스 : 버튼, 목록, 네비게이션 등과 같은 요소
- 인터페이스를 `컴포넌트`, `Props`, `상태` 라는 세가지 핵심 개념으로 나눔
- 컴포넌트화 : 페이지나 뷰를 구성하기 전에 개별 컴포넌트를 먼저 개발하도록 함.

### 💠 리액트의 기본 개념

- **JSX** <br>
  : XML 과 유사한 구문을 사용하여 HTML 을 자바스크립트에서 사용할 수 있게 해주는 확장문법.

- **컴포넌트** <br>
  : 리액트의 기본 구성 요소.<br>

  - 어떠한 입력값(Props) 를 받아서 화면에 표시할 내용을 나타내는 리액트의 요소를 반환하는 함수.

- **Props** <br>
  : Properties(속성) 의 줄임말로, 리액트 컴포넌트의 내부 데이터를 의미한다.<br>

  - 상위 컴포넌트 내부에서 하위 컴포넌트로 전달될때 사용되며, HTML 속성과 같은 문법을 사용한다.

  1. props 값은 컴포넌트가 만들어지기 전에 미리 결정되고, 컴포넌트 설계의 일부로 사용된다.
  2. props 값은 바꿀 수 없다. 즉, 컴포넌트로 전달되고 나면 읽기 전용이 된다.<br>
     이후에 this.props 속성을 통해 props 에 접근할 수 있다. -> 클래스형 컴포넌트인 경우에만 사용할 수 있는 속성. <br>
     함수형 컴포넌트는 매개변수로 props 를 받아온다.

- **상태** <br>
  : 컴포넌트의 라이프사이클 동안 값이 변할 수도 있는 정보를 담고 있는 객체이다.<br>

  - 컴포넌트가 받아온 props 의 현재 상태를 나타내기도 한다.<br>
  - 원하는 상태로 데이터 변경을 관리하는 기술 -> 상태관리

- **클라이언트 사이드 렌더링(CSR)**<br>
  : 서버가 페이지의 기본 HTML 컨테이너만을 렌더링한다.<br>

  - 페이지에 내용을 표시하기 위해 필요한 로직은 클라이언트에서 실행되는 자바스크립트 코드가 처리함.<br>
  - 리액트에서는 대부분의 애플리케이션 로직이 클라이언트에서 실행된다.

- **서버 사이드 렌더링(SSR)**<br>
  : 사용자 요청에 응답하여 페이지 콘텐츠를 데이터 저장소나 외부 API 의 데이터가 포함된 완전한 HTML 파일로 생성한다.<br>

  - 리액트는 동형렌더링 (클라이언트와 서버 모두에서 동일한 코드로 렌더링할 수 있는 기술)이 가능해, 브라우저뿐만 아니라 서버 같은 다른 플랫폼에서도 작동할 수 있음을 의미한다.

- **하이드레이션(Hydration)**<br>
  1. 서버에서 렌더링 된 애플리케이션에서는 현재 페이지의 HTML이 서버에서 생성되어 클라이언트로 전송
  2. 서버에서 이미 마크업을 생성했기 때문에 클라이언트는 빠르게 파싱하여 화면에 나타낼 수 있다.
  3. UI 를 상호작용할 수 있게 만드는 데 필요한 자바스크립트가 로드된다.
  4. 이벤트 핸들러는 자바스크립트 번들이 로드되고 처리된 후에 연결된다.
     <br>
     -> 위와같은 일련의 과정을 하이드레이션이라고 한다.<br>
     -> 리액트는 현재의 DOM 노드를 검사하고, 해당 자바스크립트와 연결하여 활성화, 즉 하이드레이트 한다.

---

<br>

## ✔️ 12.2 고차 컴포넌트 (Higher-Order-Component)

: 여러 컴포넌트에서 동일한 로직을 재사용하는 방법 중 하나.<br>

- 다른 컴포넌트를 인자로 받아, 새로운 컴포넌트를 반환하는 컴포넌트
- 특정 기능을 포함하고 있어, 이 기능을 매개변수로 전달받은 컴포넌트에 적용할 수 있다.<br>
  -> 인자로 받은 컴포넌트에 추가 기능을 적용한 새로운 컴포넌트를 반환한다.<br>
  ex) _여러 컴포넌트에 특정 스타일을 적용하고 싶을때,_ <br>
  객체를 일일이 생성하는 대신, 매개변수로 전달받은 컴포넌트에 스타일 객체를 추가하는 고차 컴포넌트를 만들 수 있다.

#### \* 예제 1

```jsx
function withStyles(Component) {
    return props => {
        const style = {padding: '0.2rem', margin: '1rem'}
        return <Component style={style} {...props}/>
    }
}

const Button = () = <button>Click me!</button>
const Text = () => <p>Hello World!</p>

const StyledButton =  withStyles(Button)
const StyledText = withStyle(Text)
```

#### \* 예제 2

```jsx
function withLoader(Element, url) {
  return (props) => {};
}

// 데이터를 가져오는 동안 로딩 중 텍스트를 표시하는 로직 추가
// 데이터 가져오기가 완료되면, 해당 컴포넌트는 가져온 데이터를 prop 으로 전달
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

    if (!data) {
      return <div>Loading...</div>;
    }

    return <Element {...props} data={data} />;
  };
}

// DogImages 목록에 로딩 중 표시를 보여주기 위해 고차 컴포넌트로 감싸서 내보내기
function DogImages(props) {
    return props.data.message.map((dog,index) => (
        <img src={dog} alt="Dog" key={index}/>
    ))
}

export default withLoader (
    DogImages,
    "https://~"
)
```

### 💠 고차 컴포넌트 조합하기

```jsx
export default withHover(withLoader(DogImages, "https:~"));
```

- DogImages 엘리먼트는 withHover 와 withLoader 에서 전달된 모든 props 를 가지게 된다.

---

### 💠 고차 컴포넌트 패턴 장점

- 애플리케이션 전체에 걸쳐 여러 컴포넌트에 동일한 동작을 적용해야 할때
- 추가된 커스텀 로직 없이도 컴포넌트가 독립적으로 작동할 수 있을 때
- 재사용하는 로직을 한 곳에 모아 관리할 수 있다.

---

### 💠 고차 컴포넌트 패턴 단점

- 고차 컴포넌트가 대상 컴포넌트에 전달하는 prop 의 `이름은 충돌`을 일으킬 수 있다.

```jsx
function withStyles(Component) {
    return props => {
        const style = {padding:"0.2rem", margin:"1rem"}
        return <Component style={style} {...props}/>
    }
}

const Button = () = <button style={{color:'red'}}>Click me!</button>
const StyledButton = withStyles(Button)
```

-> withStyles 고차 컴포넌트는 전달받은 컴포넌트에 style 이라는 이름의 prop 을 추가한다.<br> 하지만, Button 컴포넌트는 이미 style prop 을 가지고있어서 덮어씌워질 수 있다.<br>
이러한 충돌을 처리하도록 prop 의 이름을 변경하거나, 아래와 같이 병합하는 방식을 사용해야 한다.<br>
-> `const style = {padding:"0.2rem", margin:"1rem" ...props.style}`

---

<br>

## ✔️ 12.3 렌더링 Props 패턴

-> 렌더링 prop : JSX 요소를 반환하는 함수 값을 가지는 컴포넌트의 prop.

- 컴포넌트 자체는 렌더링 prop 외에는 아무것도 렌더링 하지 않는다.
- 자신의 렌더링 로직을 구현하는 대신, `렌더링 prop 을 호출`한다.
- 렌더링 props 라고 불리지만, 렌더링 prop 의 이름이 반드시 render 일 필요는 없다. JSX 를 렌더링하는 모든 prop 은 렌더링 prop 으로 간주된다.

#### \* 예제

```jsx
<Title render={() => <h1>I am a render prop!</h1>} />;

const Title = (props) => props.render();

// 적용한 전체코드
const Title = (props) => props.render();

// 리액트 DOM 의 렌더 메서드를 호출하는 부분
render(
  <div>
    <Title
      render={() => (
        <h1>
          <span role="img" aria-label="emoji">
            👍
          </span>
          I am render prop!
        </h1>
      )}
    />
  </div>,
  document.getElementById("root")
);
```

- 렌더링 prop을 받는 컴포넌트는 보통 렌더링 prop 을 호출하는 것 이상의 역할을 한다.
- 렌더링 prop을 받는 컴포넌트에서 가져온 데이터를, 렌더링 prop 으로 전달된 요소에 전달하곤 한다.

```jsx
function Component(props) {
    const data = {...};
    return props.render(data)
}

<Component render = {data => <ChildComponent data = {data}/>}/>

// 예제
function Component(props) {
  const data = { name: "React", version: "18" }; // 예시 데이터
  return props.render(data);  // 렌더링 prop 호출 시, data를 인자로 전달
}

function ChildComponent({ data }) {
  return (
    <div>
      <h1>{data.name}</h1>
      <p>Version: {data.version}</p>
    </div>
  );
}

<Component render={(data) => <ChildComponent data={data} />} />

```

### \* 설명

-> Component에서 생성된 data가 ChildComponent로 전달되며, ChildComponent가 그 데이터를 화면에 렌더링한다.<br>

-> **`렌더링 prop 패턴`**: Component는 데이터를 처리하거나 상태를 관리한 후, 그 데이터를 렌더링 prop으로 전달된 함수에게 넘겨서, 해당 데이터를 활용해 원하는 UI를 그린다.<br>

-> **`유연성`**: 이 패턴을 사용하면, Component에서 데이터를 어떻게 처리할지에 집중하고, 그 데이터를 어떻게 렌더링할지는 props로 받은 함수에 위임할 수 있어 재사용성이 높아진다.<br>

---

### 💠 상태 끌어올리기

: `여러 자식 컴포넌트들이 공통으로 사용하는 상태를 부모 컴포넌트에서 관리하는 패턴`

- 입력 컴포넌트가 자신의 상태를 다른 컴포넌트와 공유하려면, 상태를 필요로 하는 컴포넌트와 가장 가까운 공통 조상 컴포넌트로 끌어올려야 한다.

```jsx
function Input({ value, handleChange }) {
  return <input value={value} onChange={(e) => handleChange(e.target.value)} />;
}

function Kelvin({ value = 0 }) {
  return <div>{value + 273.15}K</div>;
}

function Fahrenheit({ value = 0 }) {
  return <div>{(value * 9) / 5 + 32}F</div>;
}

export default function App() {
  const [value, setValue] = useState("");

  return (
    <div>
      <h1>Temperature Converter</h1>
      <Input value={value} handleChange={setValue} />
      <Kelvin value={value} />
      <Fahrenheit value={value} />
    </div>
  );
}
```

- `상태 관리`: App 컴포넌트가 value 상태를 관리함
- `상태 전달`: App 컴포넌트는 이 value 상태를 자식 컴포넌트인 Input, Kelvin, Fahrenheit에 prop으로 전달.

  - Input 컴포넌트는 value와 handleChange라는 이름으로 상태를 받고, 사용자가 입력한 값을 handleChange로 상위 컴포넌트로 전달한다.
  - Kelvin과 Fahrenheit는 각각 value를 받아 다른 단위로 변환하여 출력함

- `상태 변경`: Input 컴포넌트는 onChange 이벤트를 통해 사용자의 입력 값을 받아 setValue로 상위 컴포넌트인 App의 상태를 변경한다.
- 이 변경된 value는 다시 Kelvin, Fahrenheit 컴포넌트로 전달되며,<br>
  `해당 컴포넌트들이 리렌더링되어 새로운 값을 화면에 보여주게 됨.`

-> 큰 규모의 애플리케이션에서는 각 상태 변경시, <br>
데이터를 사용하지 않는 자식 컴포넌트까지 모두 리렌더링될 수 있어, 성능에 악영향을 줄 수 있다.<br>

#### 📍 렌더링 props 패턴으로 변경!

```jsx
function Input(props) {
  const [value, setValue] = useState("");

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {props.render(value)}
    </>
  );
}

export default function App() {
    return (
        <div>
        <h1>Temperature Converter<h1/>
        <Input
            render={(value)=>(
                <>
                    <Kelvin value={value}/>
                    <Fahrenheit value={value}/>
                </>
            )}/>
        </div>
    )
}
```

---

### 💠 컴포넌트의 자식으로 함수 전달하기

- children prop 을 통해 접근할 수 있다.<br>
- 자식으로 함수를 전달하기 때문에 Kelvin, Fahrenheit 컴포넌트는 렌더링 prop 의 이름에 구애받지 않고도 값에 접근할 수 있다.
- 엄밀히 말하면 렌더링 Props 패턴임!

```jsx
// 렌더링 prop을 명시적으로 전달하는 대신, Input 컴포넌트의 자식으로 함수를 전달.

export default function App() {
  return (
    <div>
      <h1>emperature Converter</h1>
      <Input>
        {(value) => {
          <>
            <Kelvin value={value} />
            <Fahrenheit value={value} />
          </>;
        }}
      </Input>
    </div>
  );
}

function Input(props) {
  const [value, setValue] = useState("");

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {props.children(value)}
    </>
  );
}
```

---

### 💠 렌더링 Props 장점

- 고차 컴포넌트 패턴에서 발생할 수 있는 이름 충돌 문제를 해결
- props 를 자동으로 병합하지 않고, 부모 컴포넌트에서 제공하는 값을 그대로 자식 컴포넌트로 전달하기 때문이다.
- 어떤 props 가 어디에서 오는지 정확하게 파악할 수 있다.
- 렌더링 prop을 통해 애플리케이션 로직과 렌더링 컴포넌트를 분리할 수 있다.
- 상태를 가진 컴포넌트는 데이터를 상태를 가지지 않은 컴포넌트로 전달하고, 이 컴포넌트는 그저 데이터를 렌더링 하는 역할을 함.

### 💠 렌더링 Props 단점

- 라이프사이클 관련 메서드를 추가할 수 없으므로, 받은 데이터를 변경할 필요가 없는 렌더링에 치중한 컴포넌트에만 사용할 수 있다.

### 🤔 라이프사이클 관련 메서드

- componentDidMount: 컴포넌트가 처음 마운트된 직후 한 번 호출. 주로 API 호출이나 DOM 조작이 필요한 작업에 사용
- componentDidUpdate: 컴포넌트가 업데이트된 후 호출. 새로운 props나 상태의 변화에 따라 작업이 필요할 때 사용
- componentWillUnmount: 컴포넌트가 언마운트되기 직전에 호출. 주로 리소스 해제(cleanup) 작업에 사용
- shouldComponentUpdate: 컴포넌트가 리렌더링될지 여부를 결정하는 메서드. 성능 최적화를 위해 사용

---

<br>

## ✔️ 12.4 리액트 Hooks 패턴

- 클래스 컴포넌트를 사용하지 않고도 상태와 라이프사이클 메서드를 활용할 수 있다.

### 💠 클래스 컴포넌트

```jsx
class MyComponent extends React.Component {
    // state 추가 및 커스텀 메서드 바인딩
    constructor() {
        super()
        this.state = {...}

        this.customMethodOne = this.customMethodOne.bind(this)
        this.customMethodTwo = this.customMethodTwo.bind(this)
    }

    // 라이프사이클 메서드
    componentDidMount() {...}
    componentWillUnMount() {...}
    componentDidUpdate() {...}
    shouldComponentUpdate() {...}

    // 커스텀 메서드
    customMethodOne() {...}
    customMethodTwo() {...}

    render() {return {...}}
}
```

- 생성자 함수 내의 상태
- 컴포넌트의 라이프사이클에 따른 효과를 처리하기 위한 componentDidMount, componentWillUnMount 와 같은 라이프사이클 메서드
- 추가적인 로직을 구현하기 위한 커스텀 메서드

### 💠 구조 변경의 필요성

- 래퍼 헬
- 복잡성 증가

### 💠 Hooks

- 함수형 컴포넌트에 상태 추가하기
- 라이프사이클 메서드를 사용하지 않고도 컴포넌트의 라이프사이클 관리하기
- 여러 컴포넌트 간에 동일한 상태관련 로직 재사용하기.

---

<br>

## ✔️ 12.5 상태 Hook : useState

- 함수형 컴포넌트에서 상태를 관리하는 useState Hook 제공

- **useState**에서 추출할 수 있는 값
  - 현재 상태값
  - 상태를 업데이트 하는 데 사용할 수 있는 메서드

```jsx
export default function Input() {
  const [input, setInput] = useState("");

  return <input onChange={(e) => setInput(e.target.value)} value={input} />;
}
```

### 💠 이펙트 Hook : useEffect

- useEffect hook 을 사용하면 컴포넌트의 라이프사이클에 접근할 수 있다.
- componentDidMount, componentWillUnMount, componentDidUpdate 라이프사이클 메서드를 하나로 합쳐 사용할 수 있다.

### 💠 Hook 관련 추가 정보

- useContext <br>
  : React.createContext 로 만들 수 있는 context 객체를 인자로 받아 해당 context 의 현재 상태에 접근할 수 있게 한다. <br>
  전달되는 인자는 반드시 context 객체여야 한다.<br>
  useContext 를 호출하는 컴포넌트는 context 값이 변경될 때마다 항상 리렌더링 된다.

- useReducer
  : setState 의 대안.<br>
  reducer 함수와 초기 상태를 받아, 배열의 구조 분해 할당을 통해 현재 상태와 dispatch 함수를 반환한다.

### 💠 Hook 장단점

- 적은 코드라인 수
- 복잡한 컴포넌트의 단순화
- 상태 관련 로직 재사용
- UI 에서 분리된 로직 공유

### 💠 Hook vs Class

#### \* 함수형 컴포넌트 + Hook 을 사용해야 할때 / 클래스 컴포넌트를 사용해야 할 때를 어떻게 구분해야 할까?

- Hook 은 복잡한 계층 구조를 피하고 코드를 더 명확하게 만든다. 일반적으로 클래스에서 고차 컴포넌트나 렌더링 Props 패턴을 사용하면, 리액트 개발자 도구에서 여러 계층에 걸쳐 애플리케이션 구조를 파악해야 한다.
- Hook 은 리액트 컴포넌트 전체에 일관성을 부여한다. 클래스는 함수 바인딩과 호출 컨텍스트를 이해해야 하기 때문에 혼란을 줄 수 있다.<br>

-> 클래스형 컴포넌트는 주로 레거시 코드베이스에서 사용되며, 라이프사이클 메서드를 명시적으로 제어하거나 기존 클래스형 컴포넌트를 다룰 때 유용하다.

---

24.10.20

## ✔️ 12.6 정적 가져오기

- `import module from 'module'` -> 정적으로 가져온 모듈
- 각 모듈은 자바스크립트 엔진이 해당 모듈을 import 하는 코드에 도달하는 즉시 실행된다.
- 컴포넌트들을 정적으로 가져왔기 때문에, 웹팩은 이 모듈들을 초기번들에 포함시키게 된다.
- 크기가 큰 번들은 로딩시간에 영향을 미칠 수 있다. <br>
  (App 컴포넌트가 사용자화면에 내용을 렌더링하려면 먼저 모든 모듈을 로드하고 파싱해야하기 때문)

## ✔️ 12.6 동적 가져오기

### 💠Suspense

: Suspense와 fallback은 **비동기적으로 데이터를 로드하는 컴포넌트를 처리할 때 매우 유용**한 기능이다.<br>
주로 비동기 렌더링을 보다 쉽게 관리하기 위해 사용된다.

> Suspense는 React가 컴포넌트 렌더링을 일시적으로 중단하고, 비동기 작업(예: 데이터 가져오기)이 완료될 때까지 대기할 수 있게 도와주는 컴포넌트이다.<br>
> 이때 비동기 작업이 완료되기 전에 대체 UI를 보여줄 수 있다. <br>
> 즉, 데이터가 아직 로드되지 않았을 때 사용자에게 기다리는 동안 보여줄 UI를 정의하는 데 사용된다.

#### \* 사용사례

- **`코드 스플리팅`** (dynamic import)
  : 컴포넌트를 처음 렌더링할 때 모든 코드를 한 번에 로드하지 않고, 필요할 때만 코드를 로드하는 방식.

- **`데이터 패칭`**
  : 서버에서 데이터를 가져오는 동안 UI 를 비동기적으로 렌더링하는 데 사용.

#### \* 사용법

- 동적으로 로드되어야 할 컴포넌트를 감쌈.<br>
  -> 모듈의 가져오기를 일시적으로 중단시킴으로써 App 컴포넌트가 더 빠르게 내용을 렌더링할 수 있도록 해줌.
- Suspense 컴포넌트는 일시중단된 컴포넌트가 로딩되는 동안에 대신 렌더링될 컴포넌트를 받는 fallback prop 을 사용한다.
  <br>
  -> 이렇게되면 굳이 초기 번들에 추가하지 않고, 별도의 번들로 분리하여 초기 번들 크기를 줄일 수 있다.
  <br>
  -> 초기 로딩 속도 빨리짐<br>
  -> fallback prop 으로 넘겨진 컴포넌트는 애플리케이션이 멈춘것이 아니라 모듈이 처리되고 실행될 때까지 잠시 기다려야 함을 사용자에게 알려준다.

<br>

```jsx
import React, { Suspense } from "react";
const LazyComponent = React.lazy(() => import("./LazyComponent"));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>로딩 중...</div>}>
        <LazyComponent />
      </Suspense>
    </div>
  );
}

// LazyComponent 는 동적으로 로드되는 컴포넌트이다.
```

---

### 💠 로더블 컴포넌트

- SSR 애플리케이션에서 Suspense 대신 사용할 수 있는 대안으로, loadable-components 라이브러리가 있다.
- 리액트 18 부터는 SSR 환경에서도 Suspense 를 사용할 수 있도록 기능이 추가되었다.
- Suspense 와 마찬가지로, 지연 로딩될 모듈을 loadable에 전달하면 모듈이 요청될 때에만 해당 모듈이 가져와진다.
- 모듈이 로딩되는 동안에는 fallback 속성으로 넘겨진 컴포넌트를 대신 렌더링할 수 있다.

```jsx
import React from "react";
import loadable from "@loadable/component";
import Send from "./icons/Send";
import Emoji from "./icons/Emoji";

const EmojiPicker = loadable(() => import("./EmojiPicker"), {
  fallback: <div id="loading">Loading... </div>,
});

const ChatInput = () => {
  const [pickerOpen, tooglePicker] = React.useReducer((state) => !state, false);

  return (
    <div className="chat-input-container">
      <input type="text" placeholder="Type a message..." />
      <Emoji onClick={togglePicker} />
      {pickerOpen && <EmojiPicker />}
      <Send />
    </div>
  );
};
export default ChatInput;

// CSR 에서 가져오기
import React from "react";
import loadable from "@loadable/component";
import Send from "./icons/Send";
import Emoji from "./icons/Emoji";

const EmojiPicker = loadable(() => import("./components/EmojiPicker"), {
  fallback: <p id="loading">Loading... </p>,
});

const ChatInput = () => {
  const [pickerOpen, tooglePicker] = React.useReducer((state) => !state, false);

  return (
    <div className="chat-input-container">
      <input type="text" placeholder="Type a message..." />
      <Emoji onClick={togglePicker} />
      {pickerOpen && <EmojiPicker />}
      <Send />
    </div>
  );
};
console.log("ChatInput loaded", Date.now())

export default ChatInput;
```

<br>

### 💠 상호작용 시 가져오기

- 위의 예시에서 사용자가 이모지를 클릭할때 EmojiPicker 컴포넌트를 동적으로 가져왔다.
- 이러한 유형의 동적 가져오기를 '상호작용 시 가져오기' 라고 한다.

<br>

### 💠 화면에 보이는 순간 가져오기

: 컴포넌트가 사용자에게 보일 때 동적 가져오기를 실행하는 것을 '화면에 보이는 순간 가져오기' 라고 한다.

- 컴포넌트가 현재 화면에 표시되는지 확인하려면 **`IntersectionObserver API`** 를 사용하거나, <br>
  **`react-loadable-visibility`** 또는 **`react-lazyload`** 와 같은 라이브러리를 활용하여 애플리케이션이 보이는지에 따라 가져오는 기능을 추가할 수 있다.

```jsx
import React from "react";
import Send from "./icons/Send";
import Emoji from "./icons/Emoji";
import LoadableVisibility from "react-loadable-visibility/react-loadable";

const EmojiPicker = LoadableVisibility({
  loader: () => import("./EmojiPicker")
  loading: <p id="loading">Loading</p>
})

const ChatInput = () => {
  const [pickerOpen, tooglePicker] = React.useReducer((state) => !state, false);

  return (
    <div className="chat-input-container">
      <input type="text" placeholder="Type a message..." />
      <Emoji onClick={togglePicker} />
      {pickerOpen && <EmojiPicker />}
      <Send />
    </div>
  );
};
console.log("ChatInput loaded", Date.now())

export default ChatInput;
```

<br>

### 💠 코드 스플리팅

- 여러 경로와 컴포넌트로 구성된 복잡한 애플리케이션에서는 적절한 시기에 정적 및 동적 임포트가 모두 가능하도록 코드를 최적으로 스플리팅(분할)하고 번들링 해야 한다.
  <br>
  -> 경로 기반 분할을 사용하거나 웹팩이나 롤업과 같은 최신 번들러를 사용하여 코드를 분할하고 번들링할 수 있다.

### \* 경로 기반 분할

- 특정 페이지나 경로에서만 필요한 리소스가 있을 수 있다.
- `Suspense / loadable-components / react-router` 같은 라이브러리 사용

<br>

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
        <Route exact path="/overview">
          <Overview />
        </Route>
        <Route exact path="/settings">
          <Settings />
        </Route>
      </Switch>
    </Suspense>
  </Router>
  document.getElementById("root")
);

module.hot.accept();
```

### \* 번들 분할

- 최신 웹 애플리케이션을 개발할 때 웹팩 또는 롤업과 같은 번들러는 애플리케이션의 소스 코드를 하나 이상의 번들 파일로 묶는다.
- 사용자가 웹페이지를 방문하면, 필요한 데이터와 기능을 표시하기 위한 특정 번들이 요청되고 로드된다.
- 불필요한 코드를 포함하는 거대한 번들 하나를 요청하는 대신, 번들을 여러 개의 작은 번들로 분할하는 방법을 사용할 수도 있다.

> #### `번들 크기를 고려해야 할 중요한 지표`

- 번들의 로딩, 처리 및 실행시간을 줄일 수 있다.

1. 첫번째 콘텐츠가 사용자 화면에 표시되는 시간 (**FCP : First Contentful Paint**) 단축
2. 가장 큰 콘텐츠가 화면에 렌더링되는 시간 (**LCP : Largest Contentful Paint**) 지표 개선
3. (**TTI : Time to Interactive**) - 모든 콘텐츠가 화면에 표시되고 인터랙티브해지는 데 걸리는 시간.

---

<br>

### 💠 PRPL 패턴

: 애플리케이션이 최대한 효율적으로 로드될 수 있도록 하려면 **PRPL(Push Render Pre-cache Lazy-load)** 패턴을 사용할 수 있다.

- 초기 접근 경로의 화면이 사용자 기기에 표시되기 전에 다른 리소스가 요청되거나 렌더링되지 않도록 보장한다.
- 초기 경로가 성공적으로 로드되면, 서비스 워커가 설치되어 자주 방문하는 다른 경로의 리소스를 백그라운드에서 가져온다.
- 이 데이터는 백그라운드에서 가져오므로 사용자는 어떠한 지연이나 로딩도 느낄 수 없다.
- 사용자가 서비스 워커에 의해 캐시된 경로로 이동하려는 경우, 서비스 워커는 서버에 요청을 보내는 대신 캐시에서 필요한 리소스를 빠르게 가져올 수 있다.
- 자주 방문하지 않는 경로에 대한 리소스는 이후에 동적으로 가져올 수 있다.

> #### `핵심 성능 고려사항`

- **푸시 (Push)** : 중요한 리소스를 효율적으로 푸시하여, 서버 왕복 횟수를 최소화하고 로딩 시간을 단축한다.
- **렌더링 (Render**) : 사용자 경험을 개선하기 위해 초기 경로를 최대한 빠르게 렌더링한다.
- **사전 캐싱 (Pre-cache)** : 자주 방문하는 경로의 에셋(asset) 을 백그라운드에서 미리 캐싱하여 서버 요청 횟수를 줄이고 더 나은 오프라인 경험을 제공한다.
- **지연 로딩 (Lazy-load)** : 자주 요청되지 않는 경로나 에셋은 지연 로딩한다.

<br>

### 💠 로딩 우선 순위

: 필요하다고 예상되는 특정 리소스를 우선적으로 요청하도록 설정한다.

- Preload`(<link rel="preload">)` 는 브라우저의 최적화 기능으로, 브라우저가 늦게 요청할 수도 있는 중요한 리소스를 더 일찍 요청할 수 있도록 한다.
- 주요 리소스의 로딩 순서를 수동으로 지정한다면, 핵심 웹 지표(CWV : Core Web Vitals) 의 로딩 성능 및 지표에 긍정적인 영향을 미칠 수 있다.
- TTI (Time to Interactive) / FID (First Input Delay) 와 같은 지표를 최적화할 때 preload 는 상호작용에 필요한 자바스크립트 번들(또는 청크 chunk) 을 로드하는 데 유용하다.

#### \* 주의점

- 상호작용에 필요한 리소스를 먼저 로딩하다가 FCP(First Contentful Paint) 또는 LCP(Largest Contentful Paint) 에 필요한 리소스의 로딩이 지연되는 일은 피해야 한다.
- 자바스크립트 자체의 로딩을 최적화하려면, `<body>` 태그보다는 `<head>` 태그 안에서 `<script defer>` 를 사용하는 것이 해당 리소스를 초기에 로딩하는 데 도움이 된다.

```jsx
<link rel="preload" href="emoji-picker.js" as="script"/>
...
 </head>
 <body>
  ...
  <script src="stickers.js" defer></script>
  <script src="video-sharing.js" defer></script>
  <script src="emoji-picker.js" defer></script>
```

<br>

### 💠 SPA 의 Preload

- Prefetching 은 곧 요청될 가능성이 있는 리소스를 캐시하는 좋은 방법이지만, 즉시 사용해야 하는 리소스의 경우에는 preload 를 사용할 수 있다.
- 브라우저가 인터넷 연결 상태와 대역폭을 고려하여 어떤 리소스를 미리 가져올지 결정하는 prefetch 와 달리,
  미리 로드(preload) 된 리소스는 어떤 상황에서든 무조건 미리 로드된다.

<br>

### 💠 Preload + async 기법

: 브라우저가 스크립트를 높은 우선순위로 다운로드 하면서도, 스크립트를 기다리는 동안 파싱이 멈추지 않도록 하려면 `Preload + async` 기법을 활용할 수 있다.

- preload는 다른 리소스의 다운로드를 지연시킬 수 있지만, 얻을 수 있는 이점을 위해서 감수해야하는 트레이드오프이다.

```jsx
<link rel="preload" href="emoji-picker.js" as="script"/>
<script src="emoji-picker.js" async></script>
```

<br>

### 💠 크롬 95+ 버전에서의 Preload

: 큐 점핑 동작이 개선되어 preload 기능이 더 안전해졌다.

- HTTP 헤더에 preload 를 넣으면 다른 모든 리소스보다 우선적으로 로드된다.
- 일반적으로 중간 레벨 이상의 우선순위를 가진 preload는 파서가 HTML 을 처리하는 순서대로 로드되므로, HTML 시작 부분에 preload 를 넣을 때 주의해야 한다.
- 미리 로드되는 폰트는 `<head>` 태그 끝 부분이나 `<body>` 태그 시작 부분에 넣는 것이 가장 좋다.
- 미리 로드되는 모듈을 가져오는 건 실제 스크립트가 먼저 로드/파싱되도록 해당 가져오기가 필요한 `<script>` 태그 다음에 위치해야 한다.
- 이미지 preload 는 기본적으로 우선순위가 낮으며, 비동기 스크립트 및 기타 낮은/최저 우선순위 태그와 관련하여 순서를 지정해야 한다.

<br>

---

## ✔️ 리스트 가상화

: 대규모 데이터 리스트의 렌더링 성능을 향상시키는 기술

- 전체 목록을 모두 렌더링하는 대신 현재 화면에 보이는 행만 동적으로 렌더링한다.
- 렌더링 되는 행은 전체 목록의 일부이며, 사용자가 스크롤함에 따라 보이는 영역(윈도우)이 이동한다.
- 리액트에서는 **`react-virtualized`** 같은 라이브러리를 사용하여 구현할 수 있다.
- 스크롤되는 뷰포트 내에서 현재 보이는 항목만 렌더링하므로, 한 번에 수천개의 행 데이터를 렌더링 하는 데 드는 리소스를 절약할 수 있다.

<br>

### 💠 윈도잉/가상화의 작동방식

: 리스트 가상화는 현재 회면에 보이는 항목만 렌더링하여 성능을 최적화하는 기술.

> #### react-virtualized 작동 방식

- 상대적인 위치(position: relative) 를 가진 작은 컨테이너 DOM 요소 (예: `<ul>`) 를 윈도우로 사용한다.
- 스크롤을 위한 큰 DOM 요소를 가진다.
- 컨테이너 내부에 자식 요소를 절대 위치(position: absolute) 로 배치하고, top, left, width, height 등의 스타일을 설정한다.
- 한 번에 수천 개의 목록 요소를 렌더링하여 초기 렌더링 속도 저하 또는 스크롤 성능 저하를 유발하는 대신, 가상화는 사용자에게 보이는 항목만 렌더링하는 데 집중한다.

### \* react- window

### 💠 List 컴포넌트

: 윈도잉된 리스트의 아이템을 렌더링한다.

- 화면에 보이는 행만 사용자에게 전달된다.
- List 컴포넌트는 내부적으로 Grid 컴포넌트를 사용하여 행을 렌더링하고, prop 을 전달한다.

#### \* 리액트를 사용한 리스트(itemsArray) 렌더링

```jsx
import React from "react";
import ReactDOM from "react-dom";

const itemsArray = [
  { name: "Drake" },
  { name: "Halsey" },
  { name: "Camillo Cabello" },
  { name: "Travis Scott" },
  { name: "Bazzi" },
  { name: "Lil Wayne" }, ...
];

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

#### \* react-window 이용한 데이터 리스트 렌더링

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { FixedSizeList as List } from "react-window";

const itemsArray = [...];

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

<br>

### 💠 Grid 컴포넌트

: 수직 및 수평 방향으로 가상화된 표 형태의 데이터를 렌더링한다.

- 수평/수직의 현재 스크롤 위치에 따라 필요한 Grid 셀만 렌더링한다.

### 💠 웹 플랫폼의 발전

#### \* content-visibility: auto

: 화면 밖 콘텐츠의 렌더링과 페인팅을 필요한 시점까지 지연할 수 있다.

- 동적인 콘텐츠 목록을 렌더링하는 경우에는 여전히 react-window 와 같은 라이브러리를 사용하는 것이 좋다.
- 화면 밖 요소를 display: none 으로 설정하거나 DOM 노드를 제거하는 등의 방식으로 렌더링 성능을 최적화한다.
