## \* Chapter 5 | 최신 자바스크립트 문법과 기능

### ✔️ 애플리케이션 분리의 중요성

- 모듈형인 자바스크립트는 애플리케이션을 `모듈`이라는 단위로 쪼갤 수 있다.
- 모듈은 다른 모듈을 가져올 수 있으며, 이 모듈이 또 다른 모듈을 가져올 수도 있다.
- 즉, 애플리케이션은 여러개의 중첩된 모듈로 구성될 수 있다.

---

### ✔️ 모듈 가져오기와 내보내기

- 모듈을 사용하면 각 기능에 맞는 독립적인 단위로 코드를 분리할 수 있다.
- 모듈형 언어가 되기 위해서는 의존성을 가진 모듈을 `가져오고(import)` `내보낼(export)` 수 있어야 한다.
  - import 문을 이용하면 내보내기된 모듈을 지역 변수로 가져올 수 있으며, 기존 변수명과의 충돌을 피하고자 이름을 바꿔서 가져올 수도 있다.
  - export 문을 이용하면 지역 모듈을 외부에서 읽을 수 있지만, 수정할 수는 없도록 만들어준다.
    - 직속 하의 모듈은 내보낼 수 있지만, 다른 외부에서 정의된 모듈은 내보낼 수 없다. 또한 import 문처럼 이름을 바꿔 내보낼 수 있다.
- 일반적으로 모듈 파일은 여러 함수, 상수 및 변수를 가지고 있다. 파일 끝부분에서 내보내고 싶은 모듈을 객체로 정리하여 하나의 export문으로 단번에 내보낼 수 있다.
- 사용할 모듈만을 가져오는 것도 가능하다.
- `<script>` 태그에서 `type`에 모듈을 명시하여 브라우저에게 알릴 수 있다.
- `nomodule` 속성은 브라우저에 모듈이 아님을 알려준다.

```jsx
<script type="module" src="main.mjs"></script>
<script nomodule src="fallback.js"></script>
```

---

### ✔️ 모듈 객체

- 모듈을 객체로 가져오면 모듈 리소스를 깔끔하게 가져올 수 있다.
- 객체 하나만으로 여러 곳에 사용할 수 있다.

```jsx
import * as Staff from "/modules/staff/mjs";

export const oven = {
  makeCupcake(toppings) {
    Staff.baker.bake("cupcake", toppings);
  },
  makePastry(mSize) {
    Staff.pastryChef.make("Pastry", type);
  },
};
```

---

### ✔️ 외부 소스로부터 가져오는 모듈

- 외부 소스에서 가져오는 원격 모듈 (ex. 서드파티 라이브러리) 을 쉽게 가져올 수 있게 되었다.

```jsx
import { cakeFactory } from "http://example.com/modules/cakeFactory.mjs";
// 미리 로드된 정적 가져오기

cakeFactory.oven.makeCupcake("sprinkles");
cakeFactory.oven.makeMuffin("large");
```

---

### ✔️ 정적으로 모듈 가져오기

- 위의 방법들은 모두 정적 가져오기이다.
- 메인코드를 실행하기 전에 먼저 모듈을 다운로드하고 실행해야 한다.
- 초기 페이지 로드 시 많은 코드를 미리 로드해야 하므로, 성능에 문제가 생길 수 있다.

---

### ✔️ 동적으로 모듈 가져오기

- 모듈을 필요한 시점에만 로드하는 것이 더 이로울 때가 있다.
- 지연 로딩(lazy-loading) 모듈을 사용하면 필요한 시점에 로드할 수 있다.
  ex) 사용자가 링크나 버튼을 클릭할 때 로드하게 만들 수 있음. -> 초기 로딩 시간을 줄일 수 있다.
- `동적 가져오기 (dynamic import)`는 함수와 비슷한 새로운 형태의 가져오기이다.
  - import(url) 는 요청된 모듈의 네임스페이스 객체에 대한 프로미스 객체를 반환한다. 이 프로미스 객체는 모듈 자체와 모든 모듈 의존성을 가져온 후, 인스턴스화하고 평가한 뒤에 만들어진다.
  - await 과 함께 사용할 수 있다.
  - 동적 가져오기를 사용하면 모듈이 사용될 때만 다운로드되고 실행된다.
  - 사용자 상호작용에 반응하거나 화면에 보이면 실행하기 등 자주 사용되는 패턴은 동적 가져오기를 통해 바닐라 자바스크립트에서도 쉽게 구현할 수 있다.

```jsx
form.addEventListener("submit", (e) => {
  e.preventDefault();
  import("/modules/cakeFactory.js").then((module) => {
    //가져온 모듈 사용하기
    module.oven.makeCupcake("sprinkles");
    module.oven.makeMuffin("large");
  });
});

// await 과 함께 사용
let module = await import("/modules/cakeFactory.js");
```

---

### ✔️ 사용자 상호작용에 따라 가져오기

- ex) 채팅창, 다이얼로그, 비디오
- `lodash.sortby` 모듈을 동적으로 로드하여 정렬 기능을 구현하는 코드

```jsx
const btn = document.querySelector("button");

btn.addEventListener("click", (e) => {
  e.preventDefault();
  import("lodash.sortby")
    .then((module) => module.default)
    .then(sortInput()) // use the imported dependency
    .catch((err) => {
      console.log(err);
    });
});
```

---

### ✔️ 화면에 보이면 가져오기

- `intersectionObserver API` 사용 -> 컴포넌트가 화면에 보이는지 감지할 수 있음
  -> 이에따라 모듈을 동적으로 로드가능능
- ex) 무한스크롤

---

### ✔️ 서버에서 모듈 사용하기

- Node는 type 이 module 이라면 .mjs와 .js 로 끝나는 파일을 자바스크립트 모듈로 취급한다.

---

### ✔️ 모듈을 사용하면 생기는 이점

#### `1. 한 번만 실행된다.`</br>

-> 기존 스크립트는 DOM에 추가될 때마다 실행되는 반면에 모듈 스크립트는 한 번만 실행된다.
자바스크립트 모듈을 사용하면 의존성 트리의 가장 내부에 위치한 모듈이 먼저 실행된다.
가장 내부에 위치한 모듈이 먼저 평가되고 여기에 의존하는 모듈에 접근 할 수 있다는 점이 이점이다.

#### `2. 자동으로 지연 로드된다.`</br>

-> 즉시 로드되지 않기 위해 다른 스크립트 파일은 defer 속성을 붙여야 하지만, 모듈은 자동으로 지연되어 로드된다.

#### `3. 유지보수와 재사용이 쉽다.` </br>

-> 다른 모듈에 영향을 주지 않고 독립적으로 실행될 수 있는 코드 조각으로 관리된다.

#### `4. 네임스페이스를 제공한다.` </br>

-> 관련 변수와 상수를 위한 개별 공간을 생성하여 글로벌 네임스페이스를 오염시키지 않고 모듈 참조를 통해 사용할 수 있게 해준다.

#### `5. 사용하지 않는 코드를 제거한다.` </br>

-> 웹팩이나 롤업 같은 번들러를 사용해 사용하지 않는 모듈을 자동으로 제거할 수 있다.</br>
-> 이처럼 `번들에 추가하기 전에 사용하지 않는 코드를 제거하는 것`을 **트리쉐이킹 (tree-shaking)** 이라고 한다.

---

### ✔️ 생성자, 게터, 세터를 가진 클래스

- 생성자와 내부를 숨기는 기능을 가진 클래스(class) 가 추가되었다.
- class 키워드를 통해 사용할 수 있다.

```jsx
class Cake {
  // 생성자 안에서 변수를 정의한다.
  constructor(name, toppings, price, cakeSize) {
    this.name = name;
    this.cakeSize = cakeSize;
    this.toppings = toppings;
    this.price = price;
  }

  // ES2015 버전 이상에서는 모든 것을 함수로 만드는 것을 피하고자
  // 새로운 식별자를 사용하려고 했다.

  addTopping(topping) {
    this.toppings.push(topping);
  }

  // 게터는 메서드 이름 앞에 넣어 사용한다.
  get allToppings() {
    return this.toppings;
  }

  get qualifiesForDiscount() {
    return this.price > 5;
  }

  // 세터도 메서드 이름 앞에 넣어 사용한다.
  set size(size) {
    if (size < 0) {
        throw new Error ("~error message")
    }
    this.cakeSize = size;
  }

// 사용방법
let cake = new Cake("chocolate", ["chocolate chips"], 5, "large");

}
```
