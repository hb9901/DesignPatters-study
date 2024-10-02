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

## ✔️ 9.2 배경

- 자바스크립트에서 콜백 함수는 다른 함수에 인수로서 전달되어, 비동기 작업이 완료된 후 실행된다.
- **`콜백지옥`** : `중첩된 콜백 구조`로 인해 코드의 가독성과 유지보수성이 크게 저하되는 상황.
  - 네트워크 요청을 수행하고, 요청 결과를 매개변수로 하여 콜백 함수를 호출한다. 호출된 콜백 함수에서 또 다른 네트워크 요청을 수행하고 그에 대한 결과를 또 다른 콜백함수로 전달한다.
