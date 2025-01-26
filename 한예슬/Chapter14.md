## \* Chapter 14 | 리액트 애플리케이션 구조

> 💡기능별 그룹화
> 💡파일 유형별 그룹화

---

### ✔️ 도메인 및 공통 컴포넌트 기반의 혼합 그룹화

- 3~4 단계 이상의 깊은 중첩은 피하는게 좋음. -> 경로 업데이트의 어려움

---

### ✔️ Redux

- 특정 기능에 대한 로직 한곳에 모아둠
  - slice 파일로 작성
  - 가급적 RTK 의 createSlice api 사용
  - 이 파일을 {actionTypes, actions, reducer} 를 독립적이고 캡슐화된 모듈로 묶음 <br>
    -> ducks 패턴

### ✔️ 기타 사례

- `Import aliasing 사용` : 공통 가져오기에 대한 긴 상대 경로를 줄이기 위해 import aliasing 을 사용
- `외부 라이브러리 API로 감싸기` : 필요한 경우 교체할 수 있도록 외부 라이브러리를 자체 API 로 감싸서 사용
- `PropTypes 사용` : 컴포넌트에 PropTypes 를 사용하여 속성 값의 유형 검사를 수행

---

### ✔️ 빌드 성능시간 개선

- 로더 사용 시, 변환이 필요한 모듈에만 적용해야 함
- 다른 모듈을 참조하는 import, require, define 이 없는 파일은 의존성 분석을 할 필요가 없음
  - noParse 옵션 사용하여 이런 파일의 파싱을 건너뜀

```jsx
module.exports = {
  module: {
    noParse: /jquery|lodash/, // 특정 모듈을 noParse 대상으로 설정
  },
};
```
