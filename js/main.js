let moviesArr = movies.slice().map(movie => {
  return {
    title: movie.Title.toString(),
    fulTitle: movie.fulltitle,
    movieYear: movie.movie_year,
    category: movie.Categories.split("|"),
    summary: movie.summary,
    imdbId: movie.imdb_id,
    imdbRating: movie.imdb_rating,
    runtime: movie.runtime,
    trailer: `https://www.youtube.com/watch?v=${movie.ytid}`,
    imgBig: `http://i3.ytimg.com/vi/${movie.ytid}/maxresdefault.jpg`,
    imgSmall: `http://i3.ytimg.com/vi/${movie.ytid}/hqdefault.jpg`
  }
});

let sortMovie = moviesArr.slice(0);
sortMovie = sortMovie.sort( function (a, b) {
  return a.movieYear - b.movieYear
})

let rangeInput = document.querySelector('.year-input')
let rangeText = document.querySelector('.range-text')
let elHeader = document.querySelector('.header')
let elToggle = document.querySelector('.menu-burger')
let elSelect = document.querySelector('.select')
let elForm = document.querySelector('.filter-form')
let elRatingInput = document.querySelector('.rating-input')
let elNameInput = document.querySelector('.text-input')
let elFilterResult = document.querySelector('.filter-result')

let elModal = document.querySelector('.modal')
let elModalBtn = document.querySelector('.modal-btn')



elToggle.addEventListener('click', () => {
  elHeader.classList.toggle('header-active')
})

let rangeInputMin = sortMovie[0].movieYear;
let rangeInputMax = sortMovie[sortMovie.length - 1].movieYear;


rangeInput.setAttribute('min', rangeInputMin)
rangeInput.setAttribute('max', rangeInputMax)


rangeInput.addEventListener('input', () => {
  rangeText.textContent = rangeInput.value
})

let generes = []

function sortCategories () {
  for (let movie of moviesArr) {
    for (let genre of movie.category) {
      if (!generes.includes(genre)) {
        generes.push(genre)
      }
    }
  }
}

function createOption () {
  let fragmentOption = document.createDocumentFragment();
  generes.forEach(function (genre) {
    let elOption = document.createElement('option')
    elOption.value = genre;
    elOption.textContent = genre;
    elOption.classList.add('select-option');

    fragmentOption.appendChild(elOption)
  })
  elSelect.appendChild(fragmentOption)
}


createOption(sortCategories());


function createCard(array) {
  elFilterResult.innerHTML = ''
  let cardFragment = document.createDocumentFragment()
  array.forEach(function (movie) {
    let cardMovie = document.createElement('li')
    cardMovie.classList.add('list-item')
    let cardImg = document.createElement('img')
    cardImg.src = movie.imgSmall;
    cardImg.classList.add('list-img')
    let cardBox = document.createElement('div')
    cardBox.classList.add('list-box')
    let cardName = document.createElement('p')
    cardName.classList.add('list-name')
    cardName.textContent = movie.title
    let cardRating = document.createElement('p')
    cardRating.classList.add('list-rating')
    cardRating.textContent = "Rating: "
    let cardRatingSpan = document.createElement('span')
    cardRatingSpan.textContent = movie.imdbRating
    cardRatingSpan.classList.add('rating')


    cardMovie.dataset.imdbId = movie.imdbId

    let cardGenreBox = document.createElement('div')
    cardGenreBox.classList.add('list-genre-box')


      movie.category.forEach(function (genre) {
        let cardGenre = document.createElement('p')
        cardGenre.classList.add('list-genre')
        cardGenre.textContent = genre;
        cardGenreBox.appendChild(cardGenre)

      })


    let cardRuntime = document.createElement('p')
    cardRuntime.classList.add('list-runtime')
    cardRuntime.textContent = "Runtime: "
    let cardRuntimeSpan = document.createElement('span')
    cardRuntimeSpan.classList.add('runtime')

    cardRuntimeSpan.textContent = movie.runtime

    cardRuntime.appendChild(cardRuntimeSpan)
    cardRating.appendChild(cardRatingSpan)


    cardBox.appendChild(cardRuntime)
    cardBox.appendChild(cardRating)
    cardBox.appendChild(cardGenreBox)
    cardBox.appendChild(cardName)

    cardMovie.appendChild(cardBox)
    cardMovie.appendChild(cardImg)


    cardFragment.appendChild(cardMovie)
  })
  elFilterResult.appendChild(cardFragment)
}


let genresfilter = elSelect.value

let searchMovies = (inputRegex = '', elRatingInputValue = 0, elSelectValue = 'all', rangeInputValue = 0) => {
  return moviesArr.filter(movie => {
    let doesCaregory = elSelectValue === 'all' || movie.category.includes(elSelectValue)
    return doesCaregory && movie.movieYear >= rangeInputValue && movie.imdbRating >= elRatingInputValue && movie.title.match(inputRegex)
  })
}


elForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  let inputRegex = new RegExp(elNameInput.value.trim(), 'gi')
  let elSelectValue = elSelect.value
  let elRatingInputValue = elRatingInput.value
  let rangeInputValue = rangeInput.value

  let foundMovies = searchMovies(inputRegex, elRatingInputValue, elSelectValue, rangeInputValue)

  createCard(foundMovies);
})



elFilterResult.addEventListener('click', function (evt) {
  if (evt.target.matches('.list-item')) {
    let movie = moviesArr.find(function (movieFind) {
      return movieFind.imdbId == evt.target.dataset.imdbId
    })
    elModal.classList.add('modal-open')
    document.querySelector('.modal-img').src = movie.imgBig;
    document.querySelector('.modal-name').textContent = movie.title;
    document.querySelector('.modal-runtime').textContent = `Runtime: ${movie.runtime}`
    document.querySelector('.modal-rating').textContent = `Rating: ${movie.imdbRating}`
  }
})


elModalBtn.addEventListener('click', () => {
  elModal.classList.remove('modal-open')
})
