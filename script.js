class App {
  constructor() {
    this.loadEventListeners();
    this.movies;
    this.userChoice = '';
    this.randNumbersUsed = [];
  }

  loadEventListeners(e) {
    document
      .querySelector('form')
      .addEventListener('submit', this.handleSubmit.bind(this));
    document
      .querySelector('.buttons')
      .addEventListener('click', this.setType.bind(this));
  }

  handleSubmit(e) {
    e.preventDefault();
    const radioTV = document.getElementById('tv-radio');
    const radioMovie = document.getElementById('movie-radio');

    if (radioTV.checked) {
      this.userChoice = 'series';
      this.fetchMoviesOrSeries('tv');
    } else if (radioMovie.checked) {
      this.fetchMoviesOrSeries('movie');
    } else {
      alert('You have to choose series or movies');
      return;
    }
  }

  async fetchMoviesOrSeries(type) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTYxZTBiNjFlYTY5MDhlM2IzNGZkYzhlMDViZGQwZCIsInN1YiI6IjY0MjAxNmZlMmRjOWRjMDBmZDFiMzZiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.f5VD8-Y1HJ8yI6ISuM9nql6F5sWAnPO7eZTs3cEa2O0',
      },
    };

    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/popular`,
      options
    );

    try {
      if (!res.ok) {
        throw new Error(`Response was not ok. Error: ${Error}`);
      }
      const data = await res.json();
      const { results } = data;

      const randomNumber = Math.floor(Math.random() * results.length);

      if (type === 'tv') {
        this.displaySeries(results[randomNumber]);
      } else {
        this.displayMovie(results[randomNumber]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  displaySeries(show) {
    const imgUrl = `https://image.tmdb.org/t/p/w500${show.poster_path}`;
    // Set backdrop
    document.querySelector(
      '.overlay'
    ).style.backgroundImage = `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`;

    // Set information
    document.querySelector('.response-container').innerHTML = `
        <img src="${imgUrl}" class="poster" alt="${show.name}">
        <div class="information">
        <h2>${show.name}</h2>
            <p><i class="fa-solid fa-star"></i>${show.vote_average.toFixed(
              1
            )}/10</p>

            <p class="air-date">First Air Date: ${show.first_air_date}</p>
            <p>${show.overview}</p>
        </div>
        `;
  }

  displayMovie(movie) {
    const imgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    // Set backdrop
    document.querySelector(
      '.overlay'
    ).style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

    // Set information
    document.querySelector('.response-container').innerHTML = `
        <img src="${imgUrl}" class="poster" alt="${movie.title}">
        <div class="information">
        <h2>${movie.title}</h2>
            <p><i class="fa-solid fa-star"></i>${movie.vote_average.toFixed(
              1
            )}/10</p>

            <p class="air-date">Release Date: ${movie.release_date}</p>
            <p>${movie.overview}</p>
        </div>
        `;
  }

  setType(e) {
    e.stopPropagation();
    if (e.target.className !== 'buttons') {
      if (e.target.id === 'movie-radio') {
        document.querySelector('label:first-of-type').style.border =
          '1px solid yellow';
        document.querySelector('label:last-of-type').style.border =
          '1px solid transparent';
        document.querySelector('button').textContent = 'Generate Movie';
      } else if (e.target.id === 'tv-radio') {
        document.querySelector('label:first-of-type').style.border =
          '1px solid transparent';
        document.querySelector('label:last-of-type').style.border =
          '1px solid yellow';
        document.querySelector('button').textContent = 'Generate Series';
      }
    }
  }
}

const app = new App();
