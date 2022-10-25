const titleUrl = "http://localhost:8000/api/v1/titles/";
const genresUrl = "http://localhost:8000/api/v1/genres/";
const bestMoviesUrl = "http://localhost:8000/api/v1/titles/?sort_by=-votes&page_size=7";
const all = "http://localhost:8000/api/v1/titles/?page_size=7"
const baseCatUrl ="http://localhost:8000/api/v1/titles/?sort_by=-votes&page_size=7"

const apiUrl = "http://localhost:8000/api/v1/titles/?movie_title_contains=";

document.addEventListener("DOMContentLoaded", function() {
    console.log("loaded")
    showMovies(bestMoviesUrl, "bestNote");
    showMovies(baseCatUrl + "&genre=action", "action");
    showMovies(baseCatUrl + "&genre=adventure", "adventure");
    showMovies(baseCatUrl + "&genre=animation", "animation");
})



showBestMovies(bestMoviesUrl)
function showBestMovies(url){
  fetch(url).then(res => res.json())
  .then(function(data){
  console.log("BEST", data.results[2]);
  fetch(data.results[2].url)
        .then((response) => response.json())
        .then((movieDetails) => {
            console.log("movieDetails :", movieDetails)
    const { image_url, title, year, duration, imdb_score, genres, directors, long_description, date_published, actors } = movieDetails;
      const image = document.getElementById("banare-img")
      const text = document.getElementById("banare-title");
      const pubYear = document.getElementById("banare-year");
      const movieDuration = document.getElementById("banare-duration");
      const movieWriters = document.getElementById("banare-writers");

      const type = document.getElementById("banare-category");
      const movieDescription = document.getElementById("banareDescription");

      text.innerHTML = `${title}`;
      pubYear.innerText = year
      movieDuration.innerText = imdb_score
      type.innerHTML  = `${genres}`;
      image.src = image_url;
      movieDescription.innerText = `${long_description}` ? long_description : "";
      movieWriters.innerText = `${directors}`;
});
});
}

function showMovies(url, category){
  fetch(url).then(res => res.json())
  .then(function(data){
  console.log(data.results);
  data.results.forEach(movie => {
    const { image_url, title, year, genres, writers, actors } = movie;
      const movieEl = document.createElement('div');
      const movieInfoEl = document.createElement('div');
      const movieOverview = document.createElement('div');

      movieEl.classList.add("movie");
      movieEl.addEventListener("click", displayMovieModal(movieEl, movie.id))
      movieInfoEl.classList.add("movie-info");
      movieOverview.classList.add("overview");

      const image = document.createElement('img');
      const text = document.createElement('h3');
      const span = document.createElement('span');

      const actorsList = document.createElement('h3');
      const writer = document.createElement('h3');
      const genresList = document.createElement('h3');

      text.innerHTML = `${title}`;
      image.src = image_url;
      span.innerHTML = `${year} ${genres}`;
      actorsList.innerHTML = `${actors}`;
      writer.innerHTML = `${writers}`;
      genresList.innerHTML = `${genres}`;

      movieEl.appendChild(image);
      movieEl.appendChild(text);
      movieInfoEl.appendChild(span);
      
      movieOverview.appendChild(actorsList);
      movieOverview.appendChild(writer);
      movieOverview.appendChild(genresList);

      movieEl.appendChild(movieInfoEl);
      movieEl.appendChild(movieOverview);

      element_h = document.getElementById(category)
      element_h.appendChild(movieEl);
  }); 
});
}


function displayMovieModal(movieEl, movieId) {
    movieEl.addEventListener("click", () => {
        console.log("MOVIE ID : ", movieId)
        let modalContainer = document.getElementById("modal-container")
        console.log("modalContainer : ", modalContainer)
        modalContainer.style.display = "flex"
        url = `http://localhost:8000/api/v1/titles/${movieId}`
        fetch(url)
        .then((response) => response.json())
        .then((movieDetails) => {
            console.log("movieDetails :", movieDetails)
            const { image_url, title, year, duration, votes, genres, description, long_description, date_published, actors } = movieDetails;
            
              const image = document.getElementById("modal-image")
              const text = document.getElementById("modal-title");
              const pubYear = document.getElementById("modal-year");
              const movieDuration = document.getElementById("modal-duration");
        
              const type = document.getElementById("modal-category");
              const movieDescription = document.getElementById("movieDescription");
              const movieVotes = document.getElementById("modal-votes");
        
              text.innerHTML = `${title}`;
              pubYear.innerText = year
              movieDuration.innerText = `${duration} min`
              type.innerHTML  = `${genres}`;
              image.src = image_url;
              movieDescription.innerHTML = `${long_description}`;
              movieVotes.innerText = `${votes}`;

              const span = document.getElementsByClassName("close")[0];

              span.onclick = function() {
                document.getElementById("modal-container").style.display  = "none";
                console.log(document.getElementById("modal-container"))
              }
            
        });  
    })
}
document.addEventListener("click", e => {
  // To be used for manipulating the ><
  let handle;
  if (e.target.matches(".handle")) {
    handle = e.target
  } else {
    handle = e.target.closest(".handle")
  }
  if (handle != null) onHandleClick(handle)
})

const throttleProgressBar = throttle(() => {
  document.querySelectorAll(".progress-bar").forEach(calculateProgressBar)
}, 250)

window.addEventListener("resize", throttleProgressBar)
throttleProgressBar()

document.querySelectorAll(".progress-bar").forEach(calculateProgressBar)

function calculateProgressBar(progressBar) {
  progressBar.innerHTML = ""
  const slider = progressBar.closest(".row").querySelector(".slider")
  const itemCount = slider.children.length
  const itemsPerScreen = parseInt(
    getComputedStyle(slider).getPropertyValue("--items-per-screen")
  )
  let sliderIndex = parseInt(
    getComputedStyle(slider).getPropertyValue("--slider-index")
  )
  const progressBarItemCount = Math.ceil(itemCount / itemsPerScreen)
  console.log(sliderIndex)
  if (sliderIndex > progressBarItemCount) {
    slider.style.setProperty("--slider-index", progressBarItemCount - 1)
    sliderIndex = progressBarItemCount - 1
  }

  for (let i = 0; i < progressBarItemCount; i++) {
    const barItem = document.createElement("div")
    barItem.classList.add("progress-item")
    if (i === sliderIndex) {
      barItem.classList.add("active")
    }
    progressBar.append(barItem)
  }
}

function onHandleClick(handle) {
  const progressBar = handle.closest(".row").querySelector(".progress-bar")
  calculateProgressBar(progressBar)
  const slider = handle.closest(".movie-container").querySelector(".slider")
  const sliderIndex = parseInt(
    getComputedStyle(slider).getPropertyValue("--slider-index")
  )
  const progressBarItemCount = progressBar.children.length
  if (handle.classList.contains("left-handle")) {
    if (sliderIndex - 1 < 0) {
      
      slider.style.setProperty("--slider-index", progressBarItemCount - 1)
      progressBar.children[sliderIndex].classList.remove("active")
      progressBar.children[progressBarItemCount - 1].classList.add("active")
    } else {
      slider.style.setProperty("--slider-index", sliderIndex - 1)
      progressBar.children[sliderIndex].classList.remove("active")
      progressBar.children[sliderIndex - 1].classList.add("active")
    }
  }

  if (handle.classList.contains("right-handle")) {
    if (sliderIndex + 1 >= progressBarItemCount) {
      slider.style.setProperty("--slider-index", 0)
      progressBar.children[sliderIndex].classList.remove("active")
      progressBar.children[0].classList.add("active")
    } else {
      slider.style.setProperty("--slider-index", sliderIndex + 1)
      progressBar.children[sliderIndex].classList.remove("active")
      progressBar.children[sliderIndex + 1].classList.add("active")
    }
  }
}

function throttle(cb, delay = 1000) {
  let shouldWait = false
  let waitingArgs
  const timeoutFunc = () => {
    if (waitingArgs == null) {
      shouldWait = false
    } else {
      cb(...waitingArgs)
      waitingArgs = null
      setTimeout(timeoutFunc, delay)
    }
  }

  return (...args) => {
    if (shouldWait) {
      waitingArgs = args
      return
    }

    cb(...args)
    shouldWait = true
    setTimeout(timeoutFunc, delay)
  }
}

