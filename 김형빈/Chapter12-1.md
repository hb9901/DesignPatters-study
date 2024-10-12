<h1>리액트 디자인 패턴</h1>

<h2>고차 컴포넌트</h2>

- 여러 컴포넌트에 동일한 로직을 재사용하는 방법 중 하나

><h2>고차 컴포넌트 사용 예시</h2>

<h3>1. 여러 컴포넌트에 특정 스타일을 적용</h3>

```jsx
function withStyles(Component){
    return props => {
        const style = { padding: '0.2rem', margin: '1rem' }
        return <Component style={style} {...props}>
    }
}

const Button = () = <button>Click me!</button>
const Text = () = <p>Hello World!</p>

const StyledButton = widthStyles(Button);
const StyledText  = widthStyles(Text);
```

<h3>2. 로딩 컴폰너트 분리</h3>

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

    return <Element {...props} data={data}>
}
```