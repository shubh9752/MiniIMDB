//console.log("Shubham kumar ")

//putting api links in variable
const POPULARAPI =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHMOVIEAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

//declaring variables
const allMovies = document.querySelector("#allMovies");
const search = document.querySelector("#search-me");
const fav = document.querySelector("#fav");
const favList = document.querySelector("#fav-movie-list");


//this function will fetch the movies data from POPULARAPI
const fetchMovies = async (api) => {
  const response = await fetch(api);
  const movieData = await response.json();
  console.log(movieData);
  showMovies(movieData.results);
 

  // showMovies(movieData.results)
};

//this function fetch the the by using id
async function getMovieById(id){
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=04c35731a5ee918f014970082a0088b1`);
  const movieData = await response.json();
  const movieDb=movieData;
  console.log(movieDb);
  return movieDb;

}

//this function will show popular movies list 
const showMovies = (data) => {
  allMovies.innerHTML = "";
  data.forEach((elem) => {
    var movieDiv = document.createElement('div');
    movieDiv.classList.add("col-sm-1");
    movieDiv.classList.add("col-md-6");
    movieDiv.classList.add("col-lg-4");
    movieDiv.classList.add("col-xxl-3");
    movieDiv.classList.add("d-flex");
    movieDiv.classList.add("card-size");

   

    movieDiv.innerHTML += `
    <div class="card bg-white" style="width: 18rem;">
        <img src="${IMGPATH + elem.poster_path}" class="card-img-top cardimage" alt="...">
        <div class="card-body">
          <h5 class="card-title " >${elem.original_title}</h5>
          <span class="text-info fs-3">${elem.vote_average}</span>
         <h5 class=" text-danger">Favourite</h5>
          <i class="fa-regular fa-heart fa-2x"></i>
        </div>
    </div>`;
    allMovies.appendChild(movieDiv);
    var cardImage=movieDiv.querySelector(".cardimage")
    cardImage.addEventListener("click",()=>{
    
      fetchSingleMovie(elem);
    })
    const btn = movieDiv.querySelector(".fa-heart");
    btn.addEventListener("click", () => {
      if (btn.classList.contains("fa-regular")) {
        btn.setAttribute("class", "fa-solid fa-heart fa-2x");
        addFavMov(elem.id);
       
      } else {
        btn.setAttribute("class", "fa-regular fa-heart fa-2x");
        removeMovie(elem.id);
      }
      fetchFavMovies()
    });
    
  });
};

//this function will show search results
search.addEventListener("keyup", (e) => {
  if (e.target.value != "") {
    fetchMovies(SEARCHMOVIEAPI + e.target.value);
  } else {
    fetchMovies(POPULARAPI);
  }
});

//this function will add movies in localstorage
function addFavMov(MovieId) {
  const favMovie = getFavMovie();
  let flag = false;

  favMovie.forEach(favItem=>{
        if(favItem === MovieId){
            flag = true;
        }
    })

    if(!flag){
        // push movie details in favItems so it will get added to favourite list
        favMovie.push(MovieId);
    }

    // as local storage only takes string elements for json data its necessary to use stringify
    // save the movie in local storage
   localStorage.setItem('favMovie', JSON.stringify(favMovie));
    
 
}

//this function will remove the id of movie from local storage
function removeMovie(MovieId) {
  const favMovie = getFavMovie();
  localStorage.setItem(
    "favMovie",
    JSON.stringify(favMovie.filter((id) => id !== MovieId))
   
  );  
 
}
fetchFavMovies();

//this function stores the data in local storage 
function getFavMovie() {
  // let data = localStorage.getItem('favMovies') ? JSON.parse(localStorage.getItem('favMovies')) : [];
  // return data;
  const favMovie = JSON.parse(localStorage.getItem("favMovie"));
  return favMovie === null ? [] : favMovie;
}

//this function will fetch the movies from the data base of our local storage 
async function fetchFavMovies(){
 favList.innerHTML = "";
 const movieIds= getFavMovie();
 console.log('a',movieIds);
 const movies=[];
 for(let i=0;i<movieIds.length;i++){
  const MovieId=movieIds[i];
  var movie=await getMovieById(MovieId);
  addMoviesToFav(movie); 
  movies.push(movie);
 }
}


//this function add the fav movies in fav movie container and show movie
function addMoviesToFav(movie){
 
  const favMovieLi=document.createElement("div");
  favMovieLi.classList.add("col-12");
  favMovieLi.classList.add("d-flex");
  favMovieLi.classList.add("justify-content-between");
  favMovieLi.classList.add("mb-2");
  favMovieLi.classList.add("my-favList");

  favMovieLi.innerHTML=`
        <div class="favItem"><img class="list-img listFav-img" src="${IMGPATH + movie.poster_path}"/><span class="favlist-para"><p  class="d-inline text-white ">${movie.original_title}</p></span></div> <i class="fa-solid fa-x text-dark py-4"></i>
  `;
  const favItem=favMovieLi.querySelector('.favItem');
  favItem.addEventListener('click',()=>{
    fetchSingleMovie(movie);
  })
 
  const x = favMovieLi.querySelector('.fa-x');
    x.addEventListener('click', () => {
        removeMovie(movie.id);
        fetchFavMovies();
       

        const heart_btns = document.querySelectorAll('.fa-heart');
        heart_btns.forEach(heart_btn => {
            heart_btn.setAttribute('class', 'fa-regular fa-heart');
        })

        
      });
      favList.appendChild(favMovieLi);
      
}
//this function show the clicked movies
function fetchSingleMovie(data){
  allMovies.innerHTML=`
    <div class="card mb-3">
    <img src="${IMGPATH + data.poster_path}" class="card-img-top singleMovie-img" alt="${data.original_title}"/>
    <div class="card-body">
      <h5 class="card-title text-center display-5">${data.original_title}</h5>
      <p class="card-text text-center">Ratings:<span class="text-success">
      ${data.vote_average
      }</span>
      <p class="card-text">
      ${data.overview
      }
      </p>
      <p class="card-text">
        Release Date: ${data.release_date}
      </p>
    </div>
  </div>
    
    `;
}



fetchMovies(POPULARAPI);