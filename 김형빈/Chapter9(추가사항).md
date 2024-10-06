<h2>비동기 병렬(Promise.all() vs Promise.allSettled())</h2>
<h3>Promise.all()</h3>

```js
async function main() {
    const [data1, data2] = await Promise.all([
        makeRequest("http://example.com/1"),
        makeRequest("http://example.com/2"),
    ]);

    console.log(data1, data2);
}
```

- 비동기 함수들을 병렬적으로 실행하기에 `독립적인 비동기 작업`을 수행할 때 성능이 향상될 수 있다.
- 그러나 Promise 함수 중 rejected로 반환되는 값이 하나라도 발생할 경우, 다른 모든 작업이 종료된다.

<h3>Promise.allSettled()</h3>

```js
async function main() {
    const [data1, data2] = await Promise.allSettled([
        makeRequest("http://example.com/1"),
        makeRequest("http://example.com/2"),
    ]);

    console.log(data1, data2);
}
```

-  병렬적으로 비동기 작업을 수행하면서, 항상 각 프로미스의 실행 결과를 알고 싶다면 `
Promise.allSettled()` 메서드를 사용한다.

<h3>실행 결과</h3>


