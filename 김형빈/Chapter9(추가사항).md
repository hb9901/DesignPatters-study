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

><h3>실행 결과</h3>

![스크린샷 2024-10-06 163008](https://github.com/user-attachments/assets/d16be18d-9c06-4086-8460-79507feb47d5)

<h2>Next.js와 비동기 에러 처리</h2>

```ts
//workspace-list/route.ts
export const GET = async (request: NextRequest) => {
  try {
    const {data, error} = await supabase.from("example");
    if(error){
        return NextResponse.json({
        message: 'Failed to fetch data',
        error,
        status: false,
        statusCode: 500
        });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({
      message: 'Failed to fetch data',
      error,
      status: false,
      statusCode: 500
    });
  }
};
```

```ts
//workspaceListAPI.ts
class WorkspaceListAPI {
  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }
  async getWorkspaceList(workspaceId: number, userId: string): Promise<TWorkSpaceListType> {
    try {
      const path = 'api/workspace-list';
      const response = await this.axios.get(path, {
        params: { workspaceId, userId }
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

export default WorkspaceListAPI;
```

- WorkConnect 프로젝트 당시의 api route.ts 코드
- route.ts에서 supabase와 통신하는 과정에서 오류가 생긴다면 NextResponse를 전송하여 오류가 발생하였음을 전달하였다.
- 그렇다면 의도한데로 error를 처리하였을까??

><h3>결과</h3>

![에러처리결과](https://github.com/user-attachments/assets/bc3621a8-2f83-4110-a13a-279f1a0b0e10)

- 의도와는 다른게 catch에서 error를 헨들링 하지 못하였다
- Promise 객체 자체는 정상적으로 fufilled 되었고, http status 또한 200으로 성공적인 통신을 하였기 때문에
- 따라서 위와 같은 경우에는 비동기 에러 처리를 try-catch가 아닌 별도의 에러 헨들링이 필요하다.
