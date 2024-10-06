# Chapter 9 | 비동기 프로그래밍 패턴

## ✔️ 9.1 비동기 프로그래밍

- 비동기 자바스크립트 프로그래밍은 브라우저가 이벤트에 응답하여 다른 코드를 실행하는 동안, 백그라운드에서 오랜 시간이 걸리는 작업을 수행하게 해준다.
- 동기코드 -> 블로킹 방식 : 코드가 순서대로 한번에 한 문장씩 실행됨
- 비동기 코드 -> 논블로킹 방식 : 현재 실행 중인 코드가 다른 작업을 기다리는 동안 백그라운드에서 해당 비동기 코드를 실행할 수 있다.

### 💠 동기함수

```js
function synchronousFunction() {
    // 동기 함수 동작
}

synchronousFunction();
// 이 줄이 오기 전에 함수 내부의 코드를 실행

// ex)
function synchronousFunction() {
    console.log("동기 함수 시작");
    for (let i = 0; i < 3; i++) {
        console.log(i);
    }
    console.log("동기 함수 끝");
}

console.log("동기 함수 호출 전");
synchronousFunction();
console.log("동기 함수 호출 후");

// 실행결과
동기 함수 호출 전
동기 함수 시작
0
1
2
동기 함수 끝
동기 함수 호출 후
```

### 💠 비동기함수

```js
function asynchronousFunction() {
    // 비동기 함수 동작
}

asynchronousFunction();
// 함수 내부의 코드는 백그라운드에서 실행되며
// 이 줄로 제어권을 반환

// ex)
function asynchronousFunction() {
    console.log("비동기 함수 시작");
    setTimeout(() => {
        console.log("3초 후 실행");
    }, 3000);
    console.log("비동기 함수 끝");
}

console.log("비동기 함수 호출 전");
asynchronousFunction();
console.log("비동기 함수 호출 후");

// 실행결과
비동기 함수 호출 전
비동기 함수 시작
비동기 함수 끝
비동기 함수 호출 후
3초 후 실행
```

- 비동기 코드는 일반적으로 코드의 나머지 부분을 차단하지 않고, 오래 실행되는 작업을 수행할 때 유용하다.
- 네트워크 요청, 데이터베이스 읽기/쓰기, 또는 기타 입/출력 작업에 적합하다.

### 💠 콜백 (Callback)

#### 콜백함수 : 호출자에 의해 전달된 함수

- 콜백을 사용하여 `네트워크 요청의 결과`를 반환한다.
- 호출자는 makeRequest 함수에 콜백 함수를 전달하고, 이 콜백 함수는 결과데이터 또는 에러를 매개변수로 가져와 사용할 수 있다.

```js
function makeRequest(url, callback) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(null, data))
    .catch((error) => callback(error));
}

makeRequest("http://example.com/", (error, data) => {
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
});

// 호출자: makeRequest 함수를 호출하는 코드 (makeRequest('http://example.com/', ...))
// 콜백 함수: 비동기 작업이 완료된 후에 실행되도록 makeRequest 함수에 전달된 함수 ((error, data) => { ... })
```

### 💠 프로미스 (Promise)

- 네트워크 요청의 결과로 해결되거나 에러로 거부되는 `Promise 객체`를 반환한다.
- 호출자는 Promise 객체의 `.then` 메서드와 `.catch` 메서드를 사용하여 요청 결과를 처리할 수 있다.

```js
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

makeRequest("http://example.com/")
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

### 💠 비동기 (async/await)

- `async 키워드로 선언`되어, 네트워크 요청의 결과를 기다리기 위해 `await` 키워드를 사용할 수 있다.
- 호출자는 함수 실행 중 발생할 수 있는 에러를 처리하기 위해 try-catch 키워드를 사용할 수 있다.

```js
async function makeRequest(url) {
  try {
    const response = await fetch(url); // fetch가 완료될때까지 기다림
    const data = await response.json(); // 응답을 JSON 으로 변환될 때까지 기다림
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

makeRequest("http://example.com/");
```

<br>

| 구분                | 프로미스(Promise)                                                  | async/await                                                             |
| ------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| **가독성**          | `then()` 체인으로 복잡해질 수 있음                                 | 동기 코드처럼 작성 가능, 가독성 좋음                                    |
| **에러 처리**       | `catch()`를 통해 처리                                              | `try...catch`로 동기 코드처럼 처리 가능                                 |
| **코드 흐름**       | 비동기 작업을 계속 체이닝으로 연결해야 함                          | `await` 키워드로 비동기 작업을 기다리면서 진행                          |
| **간결성**          | 복잡한 비동기 로직은 가독성이 떨어짐                               | 복잡한 비동기 로직도 간결하고 이해하기 쉬움                             |
| **구현 방법**       | 프로미스 객체를 반환하며 `then`, `catch` 사용                      | `async` 함수 안에서 `await` 사용                                        |
| **비동기 처리**     | 기본적으로 비동기 처리가 일어남                                    | 비동기 처리이지만 코드 흐름은 동기적                                    |
| **언제 사용되는지** | 간단한 비동기 작업이거나 다중 비동기 작업을 한 번에 처리할 때 유용 | 순차적으로 처리해야 하는 비동기 작업이 많은 경우에 가독성이 훨씬 뛰어남 |

<br>

---

## ✔️ 9.2 배경

- 자바스크립트에서 콜백 함수는 다른 함수에 인수로서 전달되어, 비동기 작업이 완료된 후 실행된다.
- **`콜백지옥`** : `중첩된 콜백 구조`로 인해 코드의 가독성과 유지보수성이 크게 저하되는 상황.
  - 네트워크 요청을 수행하고, 요청 결과를 매개변수로 하여 콜백 함수를 호출한다. 호출된 콜백 함수에서 또 다른 네트워크 요청을 수행하고 그에 대한 결과를 또 다른 콜백함수로 전달한다.

<br>

---

## ✔️ 9.3 프로미스 패턴

- Promise : 비동기 작업의 결과를 나타내는 객체<br>
  -> 작업이 성공적으로 완료되거나 거부되었을 때 결과를 제공하는 일종의 계약서 같은 존재

  - 대기 (pending)
  - 완료 (fulfilled)
  - 거부 (rejected)

- Promise 생성자를 사용하여 만들 수 있으며, 이 생성자는 함수를 인수로 받는다.
- 이 함수는 resolve 와 reject 두 개의 인수를 전달 받는다.
- resolve 함수는 비동기 작업이 성공적으로 완료되었을때 호출 / reject 함수는 실패했을때 호출
- 콜백보다 체계적이고 가독성이 높은 방법으로 비동기 작업을 처리할 수 있다.

```js
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

makeRequest("http://example.com/")
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

### 💠 프로미스 체이닝

- 여러 비동기 작업을 순차적으로 처리할 때, `then()`을 사용해 `메서드를 체인처럼 연결`할 수 있다.<br>
  -> 여러개의 프로미스를 함께 연결하여 보다 복잡한 비동기 로직을 만들 수 있다.<br>
  -> 코드가 길어지고 복잡해질 수 있음 <br>
  -> catch() 메서드를 사용해 에러를 처리한다. 비동기 작업 중간에 에러가 발생하면 이후 모든 then() 체인이 스킵되고 catch()로 넘어간다.

```js
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

function processData(data) {
  // process data
  return processedData;
}

makeRequest("http://example.com/")
  .then((data) => processData(data))
  .then((processedData) => console.log(processedData))
  .catch((error) => console.error(error)); // 프로미스 에러처리 (catch 메서드 사용)
```

### 💠 프로미스 병렬 처리

-> **`Promise.all`** 메서드를 사용하여 여러 프로미스를 동시에 실행할 수 있게 해준다.

```js
Promise.all([
  makeRequest("http://example.com/1")
  makeRequest("http://example.com/2")
]).then(([data1, data2]) => {
  console.log(data1, data2)
})
```

### 💠 프로미스 순차 실행

-> **`Promise.resolve`** 메서드를 사용하여 프로미스를 순차적으로 실행할 수 있도록 해준다.

```js
Promise.resolve()
  .then(() => makeRequest1())
  .then(() => makeRequest2())
  .then(() => makeRequest3())
  .then(() => {
    // 모든 요청 완료
  });
```

### 💠 프로미스 메모이제이션

-> `캐시`를 사용하여 프로미스 함수 호출의 `결과값을 저장`한다.<br>
-> 프로미스의 결과를 캐시에 저장하여 이후 동일한 요청에 대해 캐시된 결과를 반환하는 방식<br>
-> `중복된 요청을 방지`할 수 있다.

```js
const cache = new Map();

function memoizedMakeRequest(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        cache.set(url, data);
        resolve(data);
      })
      .catch((error) => reject(error));
  });
}

const button = document.querySelector("button");
button.addEventListener("click", () => {
  memoizedMakeRequest('"http://example.com/')
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
});
```

- 버튼을 클릭하면 memoizedMakeRequest 함수 호출
- 요청한 URL 이 이미 캐시에 존재한다면 캐시된 데이터가 반환된다.
- 그렇지 않으면 새로운 요청이 발생하고, 나중에 같은 요청이 들어올 때를 대비해 캐시에 저장된다.

### 🤔 캐시되는 시간도 설정할 수 있을까?

### 1. TTL (Time To Live) 방식

: TTL은 데이터에 유효 기간을 설정하고, 그 기간이 지나면 캐시 데이터를 무효화하는 방법<br>
-> 특히 주기적으로 갱신되는 데이터를 캐시할 때 매우 유용하다.

#### 많이 쓰이는 상황:

- API 응답 캐시: 일정 시간 내에 동일한 요청이 반복되면 서버 요청을 줄이고, 캐시된 데이터를 제공하여 응답 속도를 향상시킨다.
- 검색 자동완성: 사용자가 입력한 검색어에 대한 결과를 일정 시간 동안 캐시하여, 같은 검색어가 입력되면 서버 요청을 하지 않고 캐시된 결과를 사용한다.

#### 장점:

- 간단한 관리: 캐시 만료 시간이 지나면 데이터를 무효화하는 간단한 구조.
- 효율적인 리소스 관리: 일정 시간 동안만 캐시 데이터를 유지해 불필요한 서버 요청을 줄일 수 있음.

#### 예시:

```js
const cache = new Map();

function memoizedFetch(url, ttl = 30000) {
  const now = Date.now();
  const cached = cache.get(url);

  if (cached && now - cached.timestamp < ttl) {
    return Promise.resolve(cached.data);
  }

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      cache.set(url, { data, timestamp: now });
      return data;
    });
}
```

#### 2. LRU (Least Recently Used) 방식

: LRU는 캐시 용량이 꽉 차면 가장 오래 사용되지 않은 데이터를 먼저 삭제하는 방식. <br>
-> 메모리 제한이 있는 브라우저 환경에서 매우 유용하며, 캐시가 많아질수록 자주 사용된다.

#### 많이 쓰이는 상황:

- 이미지 및 리소스 캐싱: 웹사이트에서 자주 사용되는 이미지, 스크립트 등을 캐싱할 때, 오래된 리소스를 먼저 삭제해 메모리 관리에 효율적임
- 로그인 상태 유지: 유저 데이터나 세션 상태를 유지할 때, 가장 오래된 유저 데이터를 먼저 삭제할 수 있다.

#### 장점:

- 메모리 효율: 메모리 제한이 있을 때 유용하게 작동하며, 메모리를 초과하지 않도록 관리.
- 자주 사용되는 데이터 우선 유지: 사용자 경험을 높이는 데 도움.

#### 예시:

```js
class LRUCache {
  constructor(limit) {
    this.cache = new Map();
    this.limit = limit;
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value); // Move to the end (most recently used)
    return value;
  }

  set(key, value) {
    if (this.cache.size >= this.limit) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey); // Remove the least recently used
    }
    this.cache.set(key, value);
  }
}
```

- 검색 기능에서 API 결과를 캐시하는 경우: 주로 TTL 방식을 사용해 데이터가 최신 상태임을 보장.
- 리소스 최적화에서 LRU 방식: 메모리 한계가 있는 경우, 오래된 데이터를 자동으로 제거하여 최신 데이터를 유지.

<br>

---

### 💠 프로미스 파이프라인

-> `프로미스`와 `함수형 프로그래밍` 기법을 활용하여 비동기 처리의 파이프 라인을 생성한다.

```js
function transform1(data) {
  // 데이터 변환
  return transformedData;
}

function transform2(data) {
  // 데이터 변환
  return transformedData;
}

makeRequest("http://example.com/")
  .then((data) => pipeline(data))
  .then(transform1)
  .then(transform2)
  .then((transformedData) => console.log(transformedData))
  .catch((error) => console.error(error));
```

### 💠 프로미스 재시도

```js
function makeRequestWithRetry(url) {
  let attempts = 0;

  const makeRequest = () =>
    new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });

  const retry = (error) => {
    attempts++;
    if (attempts >= 3) {
      throw new Error("request failed after 3 attempts.");
    }
    console.log(`Retrying request : attempt ${atempts}`);
    return makeRequest();
  };
  return makeRequest().catch(retry);
}
```

### 💠 프로미스 데코레이터

-> `고차함수`를 사용하여 프로미스에 적용할 수 있는 데코레이터를 생성한다.<br>
-> 이를 통해 프로미스에 `추가적인 기능을 부여`할 수 있다.

```js
function logger(fn) {
  return function (...args) {
    console.log("starting function...");
    return fn(...args).then((result) => {
      console.log("Function completed.");
      return result;
    });
  };
}

const makeRequestWithLogger = logger(makeRequest);

makeRequestWithLogger("http://example.com/")
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

### 💠 프로미스 경쟁

-> 여러 프로미스를 `동시에 실행`하고 `가장 먼저 완료`되는 프로미스의 결과를 반환한다.

```js
Promise.race([
  makeRequest("http://example.com/1"),
  makeRequest("http://example.com/2"),
]).then((data) => {
  console.log(data);
});
```

<br>

---

## ✔️ 9.4 async / await 패턴

: 비동기 코드를 마치 동기 코드처럼 작성할 수 있게 해주는 자바스크립트 기능

- 프로미스 기반으로 구축

```js
async function makeRequest() {
  try {
    const response = await fetch("http://example.com/");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

<br>

### 💠 비동기 함수 조합

-> 여러 비동기 함수를 조합하여 보다 복잡한 비동기 로직을 구성하는 것

```js
async function makeRequest(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function processData(data) {
  // 데이터 처리
  return processedData;
}

async function main() {
  const data = await makeRequest("http://example.com/");
  const processedData = await ProcessData(data);
  console.log(processedData);
}
```

### 💠 비동기 반복

-> **`for-await-of`** 반복문을 사용하여 비동기 반복 가능 객체를 순회할 수 있도록 한다.

```js
async function* createAsyncIterable() {
  yield 1;
  yield 2;
  yield 3;
}

async function main() {
  for await (const value of createAsyncIterable()) {
    console.log(value);
  }
}
```

---

### 🤔 function\* 란?

### : 제너레이터 함수(Generator)<br>

- 일반 함수와 달리 값을 순차적으로 생성할 수 있고, 중간에 실행을 일시 중지 했다가 나중에 재개할 수 있다.
- 화살표 함수를 사용할 수 없다.
- 별표 \* 의 위치는 function 키워드와 함수 이름 사이면 아무데나 붙여도 되지만, 일관성 유지 목적으로 function 키워드 바로 뒤에 붙이는 것이 권장된다.

#### \* yield

: 제너레이터 함수를 멈추거나 다시 시작하게 하는데 사용되는 키워드

#### 특징:

- yield 키워드를 사용해 값을 반환하며, 함수 실행을 일시 중지할 수 있다.
- 제너레이터 함수는 호출되면 이터레이터 객체를 반환한다. 이 이터레이터 객체를 통해 next() 메서드를 호출하여 값을 하나씩 얻는다.
- async function\*는 비동기 제너레이터 함수로, `for await...of` 구문을 사용하여 비동기적으로 값을 처리할 수 있다.

---

### 💠 비동기 에러 처리

```js
async function main() {
  try {
    const data = await makeRequest("http://example.com/");
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

### 💠 비동기 병렬

-> **`Promise.all`** 메서드 사용

```js
async function main() {
  const [data1, data2] = await Promise.all([
    makeRequest("http://example.com/1");
    makeRequest("http://example.com/2");
  ])

  console.log(data1, data2)
}
```

### 💠 비동기 순차실행

-> **`Promise.resolve`** 메서드 사용

```js
async function main() {
  let result = await Promise.resolve();

  result = await makeRequest1(result);
  result = await makeRequest2(result);
  result = await makeRequest3(result);

  console.log(result);
}
```

### 💠 비동기 메모이제이션

-> `캐시`를 사용하여 비동기 함수 호출의 `결과값을 저장`한다.<br>

```js
const cache = new Map();

async function memoizedMakeRequest(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const response = await fetch(url);
  const data = await response.json();

  cache.set(url, data);
  return data;
}
```

### 💠 비동기 이벤트 처리

```js
const button = document.querySelector("button");

async function handleClick() {
  const response = await makeRequest("http://example.com/");
  console.log(response);
}

button.addEventListener("click", handleClick);
```

### 💠 async / await 파이프라인

```js
async function transform1(data) {
  // 변형된 데이터 반환
  return transformedData;
}

async function transform2(data) {
  // 변형된 데이터 반환
  return transformedData;
}

async function main() {
  const data = await makeRequest("http://example.com/");
  const transformedData = await pipeline(data)
    .then(transform1)
    .then(transform2);

  console.log(transformedData);
}
```

#### \* 실행순서

- main() 함수 호출.
- await makeRequest(...)에서 데이터를 요청하고, 응답을 받아 data에 저장.
- await pipeline(data)로 데이터를 파이프라인에 전달하고, 그 결과를 기다림.
- then(transform1)에서 transform1(data)가 호출되고, 변형된 데이터 반환.
- then(transform2)에서 transform2(변형된 데이터)가 호출되고, 최종 데이터 반환.
- 최종 변형된 데이터가 transformedData에 저장되고, 출력.

-> 이 과정에서 **await**는 각각의 비동기 작업이 완료될 때까지 코드 실행을 일시 중지하며, then() 체인은 각 변형 작업을 순차적으로 연결한다.

<br>

### 💠 비동기 재시도

```js
async function makeRequestWithRetry(url) {
  let attempts = 0;

  while (attempts < 3) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      attempts++;
      console.log(`Retrying request: attempt ${attempts}`);
    }
  }

  throw new Error("Request failed after 3 attempts");
}
```

### 💠 async/await 데코레이터

-> 고차함수를 사용하여 데코레이터를 생성한다.<br>
-> 비동기 함수에 적용되어 추가적인 기능을 제공한다.

```js
function asyncLogger(fn) {
  return async function (...args) {
    console.log("Starting async function...");
    const result = await fn(...args);
    console.log("Async function completed");
    return result;
  };
}

@asyncLogger
async function main() {
  const data = await makeRequest("http://example.com/");
  console.log(data)
}
```

- #### @asyncLogger에서 일어나는 일:
  - @asyncLogger는 main 함수에 데코레이터를 적용한다.<br>
    - main 함수가 asyncLogger 함수에 의해 감싸진다.
    ```js
    asyncLogger(main); // 이와 같은 역할을 하는 것이 @asyncLogger
    ```
  - asyncLogger(fn)은 데코레이터로서 main 함수를 인자로 받아, 새로운 함수를 반환한다.
  - 이 반환된 새로운 함수는 main 함수의 로직을 실행하면서, 추가적인 로직(로깅)을 포함한다.
  - 즉, main 함수가 실행되기 전에 "Starting async function..." 메시지가 출력되고, main 함수가 완료된 후에 "Async function completed" 메시지가 출력된다.

<br>

- #### 추가예제

```js
function asyncDecorator(fn) {
  return async function (...args) {
    try {
      return await fn(...args);
    } catch (error) {
      throw error;
    }
  };
}

const makeRequest = asyncDecorator(async function (url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
});

makeRequest("http://example.com/").then((data) => {
  console.log(data);
});
```

### 🤔 데코레이터

- 함수나 클래스의 선언에 추가적인 동작을 정의할 때 사용된다.
- 함수 / 클래스의 선언을 감싸서 실행되며, 원래 함수가 호출되기 전에 데코레이터 함수가 먼저 호출된다.
- 데코레이터는 현재 ECMAScript 표준의 일부로, 공식 채택되지는 않았지만 실험적 기능으로 자바스크립트 개발 환경에서 사용될 수 있다. 타입스크립트나 Babel과 같은 트랜스파일러를 사용하면 데코레이터를 적용할 수 있다.
