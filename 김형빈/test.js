function makeRequest(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

// makeRequest("http://localhost:3001/articles")
//   .then((data) => console.log(data))
//   .catch((error) => console.error(error));

  

async function main() {
    const [data1, data2] = await Promise.allSettled([
      makeRequest("http://localhost:3001/articles"),
      makeRequest("http://localhost:3001/articles"),
    ]);

    console.log(data1, data2);
}

async function main2() {
  const [data1, data2] = await Promise.all([
    makeRequest("http://localhost:3001/articles"),
    makeRequest("http://localhost:3001/articles"),
  ]);

  console.log(data1, data2);
}

main();
main2();