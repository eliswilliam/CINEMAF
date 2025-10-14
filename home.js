let post = [];
let listElement = document.querySelector("#Filme");
let listElementerror = document.querySelector("#FilmeTerror")
function filmeApp(){
    fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=df85c4be593e70ae32d1595288534f7a&language=pt-BR").then((r)=> r.json()).then((json)=>{
        post = json.results;
        post.map((item)=>{
            let lielement = document.createElement("li");
            let titleElement = document.createElement("h1");
            let imgElement = document.createElement("img")
            let buttonElement = document.createElement("button")

            let titleText = document.createTextNode(item.title)
            titleElement.appendChild(titleText);
            lielement.appendChild(titleElement);
            
            
            imgElement.src = `https://image.tmdb.org/t/p/original/${item.poster_path}`;
            lielement.appendChild(imgElement);
            
            buttonElement.textContent = "Viziualizar"
            lielement.appendChild(buttonElement);

            listElement.appendChild(lielement)
        })
    })
    .catch(()=>(
        console.log("Deu algum erro")
    ))
}
filmeApp()