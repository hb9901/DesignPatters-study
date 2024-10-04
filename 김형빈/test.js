function makeRequest(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

makeRequest("http://localhost:3001/articles1")
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
