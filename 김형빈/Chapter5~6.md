## 자바스크립트 모듈 (mjs)

- import문
    - 내보내기된 모듈을 지역 변수로 가져올 수 있습니다.
    - 기존 변수명과의 충돌을 피하고자 이름을 바꿔서 가져올 수도 있습니다.
- export문
    - 지역 모듈을 외부에서 읽을 수 있지만 수정할 수는 없도록 만들어 줍니다.
    - 이름을 바꿔 내보낼 수 있습니다.

### import 예시

#### 정적 모듈 호출

- 사용할 모듈만 호출
```js
import {baker, assistant} from "/modules/staff.mjs";

baker.bake();
```

- 모듈을 객체로 호출

```js
import * as Staff from "/modules/staff.mjs";

Staff.baker.bake();
```

- 외부 소스로부터 호출

```js
import {cakeFactory} from "https://example.com/modules/cakeFactory.mjs";

cakeFactory.oven.makeCupcake();
```
#### 동적 모듈 호출

- 동적 모듈 호출 (Promise)

```js
btn.addEventListener("submit", e => {
    e.preventDefault();
    import("/modules/cakeFactory.js")
        .then((module) => {
            // 가져온 모듈 사용하기
            modlue.oven.makeCupcake();
        })
})
```

- 동적 모듈 호출 (await)

```js
let module = await import("/modules/cakeFactory.js")
```

### export 예시

```js
//staff.mjs

const baker = {
    //baker 관련 함수
}

const pastryChef = {
    //pastry chef 관련 함수
}

const assistant = {
    //assistant 관련 함수
}

export { baker, pastryChef, assistant };
```

### 브라우저에 모듈 명시

- 모듈 사용

```js
<script type="module" scr="main.mjs"></script>
```

- 모듈 미사용

```js
<script nomodule scr="fallback.js"></script>
```

### 서버에서 모듈 사용

- package.json

```json
{
    "name": "js-modules",
    "version": "1.0.0",
    "type": "module" // .js로 끝나는 파일은 자바스크립트 모듈로 취급 (.mjs 포함)
}
``` 

### 모듈 사용시의 이점

- 한 번만 실행된다.
- 자동으로 지연 로드된다.
- 유지보수와 재사용이 쉽다.
- 네임스페이스를 제공한다.
- 사용하지 않는 코드를 자동으로 제공하다. (트리쉐이킹)

## 클래스

- 클래스 기본
```js
class Cake{
    
    // 생성자
    constuctor(name){
        this.name = name
    }

    // 메서드
    addTopping( topping ){
        this.topping.push( topping );
    }

    // 세터
    set size( size ){
        if(size < 0){
            throw new Error()
        }
        this.cakeSize = size;
    }

    // 게터
    get allToppings(){
        return this.toppings
    }
}
```

- 클래스 상속

```js
class BirthdayCake extends Cake {
    surprise(){
        console.log('Happy Birthday!');
    }
}
```

- 클래스 super
부모클래스의 메서드 혹은 프로퍼티티를 호출하는 방법

```js
class BirthdayCake extends Cake {
    surprise(){
        this.toppings = super.allToppings();
        console.log('Happy Birthday!');
        console.log('Today Topping is' + this.toppings);
    }
}
```

- 클래스 private
클래스 멤버를 클래스 외부에서 사용할 수 없게 만드는 방법

```js
class PrivateClass{
    #privateField;
}
```

- 클래스 static
클래스를 초기화하지 않고 정적 메서드와 프로퍼티를 사용가능하게 만드는 방법

```js
class Cookie{
    constructor(){}
    static brandName = "Best Cookie"
}

console.log(Cookie.brandName) // Best Cookie
```

- 리액트와 클래스

과거에는 상태와 라이프사이크을 다루기 위해 클래스 컴포넌트를 사용해야 했지만 현재는 `리액트 Hooks`를 통해 사용가능합니다.

## 디자인 패턴의 종류

### 생성패턴

#### 클래스
- 팩토리 메서드

#### 객체
- 추상 팩토리
- 빌더
- 프로토타입
- 싱글톤

### 구조 패턴

#### 클래스
- 어댑터

#### 객체
- 브랫지
- 컴포지트
- 데코레이터
- 퍼사드
- 플라이웨이트

### 행위 패턴

#### 클래스
- 인터프리터
- 템플릿 메서드

#### 객체
- 책임 연쇄
- 커멘드
- 이터레이터
- 중재자
- 메멘토
- 관찰자
- 상태
- 전략
- 방문자