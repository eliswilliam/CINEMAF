let post = [];
let listElement = document.querySelector("#Carrosel");

function filmeApp() {
  fetch(
    "https://api.themoviedb.org/3/movie/popular?api_key=df85c4be593e70ae32d1595288534f7a&language=pt-BR"
  )
    .then((r) => r.json())
    .then((json) => {
      post = json.results;

      post.slice(0, 3).forEach((item) => {
        let lielement = document.createElement("li");
        let titleElement = document.createElement("h1");
        let imgElement = document.createElement("img");
        let buttonElement = document.createElement("button");

        let titleText = document.createTextNode(item.title);
        titleElement.appendChild(titleText);
        

        imgElement.src = `https://image.tmdb.org/t/p/w500/${item.poster_path}`;
        lielement.appendChild(imgElement);

        
       

        listElement.appendChild(lielement);
      });
    })
    .catch((error) => {
      console.error("Deu algum erro ao buscar os filmes:", error);
    });
}

filmeApp();
