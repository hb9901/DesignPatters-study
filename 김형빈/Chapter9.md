
<h2>프로미스 패턴</h2>

- 프로미스는 자바스크립트에서 비동기 작업을 처리하는 최신 방법
- 프로미스는 비동기 작업의 결과를 나타내는 `객체`로 3가지 상태가 존재한다. 
  - 대기(pending)
  - 완료(fulfilled) 
  - 거부(rejected)
- Promise 생성자를 사용하여 만들 수 있으며, 이 생성자는 함수를 인수로 받는다.
- 또다시 이 함수는 resolve와 reject 두 개의 인수를 전달 받는다.
  - `resolve`: 비동기 작업이 성공적으로 완료되었을 때 호출
  - `reject`: 비동기 작업이 실패했을 때 호출

> **프로미스 패턴을 사용할 때의 장점**
- 콜백보다 체계적이고 가독성이 높은 방법으로 비동기 작업을 처리할 수 있다.


<h3>프로미스 패턴을 사용한 네트워크 요청 예시</h3>

```js
function makeRequest(url){
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
}

makeRequest('http://example.com/')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

<h3>프로미스 체이닝</h3>

```js
function makeRequest(url){
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
}

function processData(data){
    // process data
    return processData;
}


makeRequest('http://example.com/')
    .then(data => processData(data))
    .then(processedData => console.log(processedData))
    .catch(error => console.error(error));
```

<h3>프로미스 에러 처리</h3>

```js
makeRequest('http://example.com/')
    .then(data => processData(data))
    .then(processedData => console.log(processedData))
    .catch(error => console.error(error));
```

<h3>프로미스 병렬 처리</h3>

```js
Promise.all([
    makeRequest('http://example.com/1'),
    makeRequest('http://example.com/2')
]).then(([data1, data2]) => {
    console.log(data1, data2);
})
```

<h3>프로미스 순차 실행</h3>

```js
Promise.resolve()
    .then(() => makeRequest1())
    .then(() => makeRequest2())
    .then(() => makeRequest3())
    .then(() => {
        //모든 요청 완료
    })
```

<h3>프로미스 메모이제이션</h3>

```js
const cache = new Map();

function memoizedMakeRequest(url){
    if(cache.has(url)){
        return cache.get(url);
    }

    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                cache.set(url, data);
                resolve(data);
            })
            .catch(error => reject(error));
    })
}
```

```js
const button = document.querySelector('button');
button.addEventListener('click', () => {
    memoizedMakeRequest('http://example.com/')
        .then(data => console.log(data))
        .catch(error => console.log(error));
});
```

<h3>프로미스 파이프라인</h3>

```js
function transform1(data){
    //데이터 변환
    return transformedData;
}

function transform2(data){
    //데이터 변화
    return transformedData;
}

makeRequest('http://example.com/')
    .then(data => pipeline(data)
        .then(transform1)
        .then(transform2))
    .then(transformedData => console.log(transformedData))
    .catch(error => console.error(error));
```

<h3>프로미스 재시도</h3>

```js
function makeRequestWithRetry(url){
    let attempts = 0;

    const makeRequest = () => new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
    })

    const retry = error => {
        attempts++;
        if(attempts >= 3) {
            throw new Error('Request failed after 3 attempts.');
        }
        console.log(`Retrying request: attempt ${attempts}`);
        return makeRequest();
    }

    return makeRequest().catch(retry);
}
```

<h3>프로미스 데코레이터</h3>

```js
function logger(fn) {
    return function (...args) {
        console.log('Starting function...');
        return fn(...args).then(result => {
            console.log('Function completed.');
            return result;
        })
    }
}

const makeRequestWithLogger = logger(makeRequest);

makeRequsetWithLogger('http://example.com/')
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

<h3>프로미스 경쟁</h3>

```js
Promise.race([
    makeRequest('http://example.com/1'),
    makeRequest('http://example.com/2')
]).then(data => {
    console.lgo(data);
})
```

<h2>async/await 패턴</h2>

- 프로미스 기반
- 비동기 코드 작업을 보다 쉽고 간결하게 만들어 준다.

<h3>async/await를 사용한 네트워크 호출 패턴</h3>

```js
async function makeRequest() {
    try {
        const response = await fetch('http://example.com/');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
```

<h3>비동기 함수 조합</h3>

```js
async function makeRequest() {
    const response = await fetch('http://example.com/');
    const data = await response.json();
    console.log(data);
}

async function processData(data){
    //데이터 처리
    return processedData;
}

async function main() {
    const data = await makeRequest('http://example.com');
    const processedData = await processData(data);
    console.log(processedData);
}
```

<h3>비동기 반복</h3>

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

<h3>비동기 병렬</h3>

```js
async function main() {
    const [data1, data2] = await Promise.all([
        makeRequest("http://example.com/1"),
        makeRequest("http://example.com/2"),
    ]);

    console.log(data1, data2);
}
```

<h3>비동기 순차 실행</h3>

```js
async function main() {
    let result = await Promise.resolve();

    result = await makeRequest1(result);
    result = await makeRequest2(result);
    result = await makeRequest3(result);
}
```

<h3>비동기 메모이제이션</h3>

```js
const cache = new Map();

async function memoizedMakeRequest(url) {
    if(cache.has(url)) {
        return cache.get(url);
    }

    const response = await fetch(url);
    const data = await response.json();

    cache.set(url, data);
    return data;
}
```

<h3>비동기 이벤트 처리</h3>

```js
const button = document.querySelector("button");

async function handleClick(){
    const response = await makeRequest("http://example.com");
    console.log(response);
}

button.addEventListener("click", handleClick);
```

<h3>async/await 파이프라인</h3>

```js
async function transform1(data){
    // 변형된 데이터 반환
    return transformedData;
}

async function transform2(data){
    // 변형된 데이터 반환
    return transformeddata;
}

async function main() {
    const data = await makeRequest("http://example.com/");
    const transformedData  = await pipeline(data)
        .then(transform1)
        .then(transform2);

    console.log(transformedData);
}
```

<h3>비동기 재시도</h3>

```js
async function makeRequestWithRetry(url) {
    let attempts = 0;

    while(attempts < 3) {
        try{
            const response = await fetch(url);
            const data = await response.json();
            return data;
        }
        catch (error){
            attempts++;
            console.log(`Retrying request: attempt ${attempts}`);
        }
    }

    throw new Error("Request failed after 3 attempts.");
}
```

<h3>async/await 데코레이터</h3>

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
    console.log(data);
}
```

<h3>HTTP 요청 보내기</h3>

```js
async function makeRequest(url) {
    try { 
        const response  = await fetch(url);
        const data = await response.json();
        console.log(data);
    } catch(error) {
        console.error(error);
    }
}
```

<h3>파일 시스템에서 파일 읽어오기</h3>

```js
async function readFile(filePath) {
    try {
        const fileData = await fs.promises.readFile(filePath);
        console.log(fileData);
    } catch (error) {
        console.error(error);
    }
}
```

<h3>파일 시스템에 파일 쓰기</h3>

```js
async function writeFiel(filePath, data) {
    try{
        await fs.promises.writeFile(filePath, data);
        console.log("File written successfully");
    } catch (error) {
        console.error(error);
    }
}
```

<h3>여러 비동기 함수를 한 번에 실행하기</h3>

```js
async function main() {
    try {
        const [data1, data2] = await Promise.all([
            makeRequest1(),
            makeRequest2()
        ]);
        console.log(data1, data2);
    } catch (error) {
        console.error(error);
    }
}
```

<h3>여러 비동기 함수 순서대로 실행하기</h3>

```js
async function main() {
    try {
        const [data1, data2] = await Promise.all([
            makeRequest1(),
            makeRequest2()
        ]);
        console.log(data1, data2);
    } catch (error) {
        console.error(error);
    }
}
```

<h3>함수의 결과를 캐싱하기</h3>

```js
const cache = new Map();

async function makeRequest(url) {
    if (cache.has(url)) {
        return cache.get(url);
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        cache.set(url, data);
        return data;
    } catch (error) {
        throw error;
    }
}
```

<h3>async/await로 이벤트 처리하기</h3>

```js
const button = document.querySelector("button");

button.addEventListener("click", async () => {
    try {
        const data =  await makeRequest("http://example.com/");
        console.log(data);
    } catch (error) {
        console.error(error);
    }
});
```

<h3>비동기 함수 실패 시 자동으로 재시도하기</h3>

```js
async function makeRequest(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

async function retry (fn, maxRetries = 3, retryDelay = 1000) {
    let retries = 0;

    while (retries <= maxRetries) {
        try {
            return await fn();
        } catch (error) {
            retries++;
            console.error(error);
            await new Promise((resolve) => setTimeout (resolve, retryDelay));
        }
    }
    throw new Error(`Failed after ${retries} retries`);
}

retry(() => makeRequest("http://example.com/").then((data) => {
    console.log(data);
}))
```

<h3>async/await 데코레이터 작성하기</h3>

```js
function asyncDecorator(fn) {
    return async function (...args) {
        try {
            return await fn(...args);
        } catch (error) {
            throw error;
        }
    }
}

const makeRequest = asyncDecorator(async function (url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
});

makeRequest("http://example.com/").then((data) => {
    console.log(data);
})

