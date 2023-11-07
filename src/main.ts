// App class interface
class App {
  constructor() {
    this.loadEventListeners();
  }

  loadEventListeners() {
    const form: HTMLFormElement | null = document.querySelector('form');
    const buttons: HTMLDivElement | null = document.querySelector('.buttons');

    if (form instanceof HTMLFormElement && buttons instanceof HTMLDivElement) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
      buttons.addEventListener('click', (e) => this.setType(e));
    } else {
      throw new Error('Form or button element does not exist');
    }
  }

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const radioTV = document.getElementById('tv-radio') as HTMLInputElement;
    const radioMovie = document.getElementById(
      'movie-radio'
    ) as HTMLInputElement;

    if (radioTV.checked) {
      this.fetchMoviesOrSeries('tv');
    } else if (radioMovie.checked) {
      this.fetchMoviesOrSeries('movie');
    } else {
      alert('You have to choose movie or series');
      return;
    }
  }

  async fetchMoviesOrSeries(type: string) {
    const options: RequestInit = {
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
      const data: ApiResponse = await res.json();
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

  displaySeries(show: ResultsInterface) {
    const imgUrl: string = `https://image.tmdb.org/t/p/w500${show.poster_path}`;
    const releaseDate = show.first_air_date;
    const responseContainer = document.querySelector(
      '.response-container'
    ) as HTMLDivElement;
    // Set backdrop
    const overlayDiv = document.querySelector('.overlay') as HTMLDivElement;
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`;

    // Set information
    responseContainer.innerHTML = `
          <img src="${imgUrl}" class="poster" alt="${show.name}">
          <div class="information">
          <h2>${show.name}</h2>
              <p><i class="fa-solid fa-star"></i>${show.vote_average.toFixed(
                1
              )}/10</p>
  
              <p class="air-date">First Air Date: ${releaseDate}</p>
              <p>${show.overview}</p>
          </div>
          `;
  }

  displayMovie(movie: ResultsInterface) {
    const releaseDate = movie.release_date;
    const imgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    const overlayDiv = document.querySelector('.overlay') as HTMLDivElement;
    const responseContainer = document.querySelector(
      '.response-container'
    ) as HTMLDivElement;
    // Set backdrop
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

    // Set information
    responseContainer.innerHTML = `
        <img src="${imgUrl}" class="poster" alt="${movie.title}">
        <div class="information">
        <h2>${movie.title}</h2>
            <p><i class="fa-solid fa-star"></i>${movie.vote_average.toFixed(
              1
            )}/10</p>

            <p class="air-date">Release Date: ${releaseDate}</p>
            <p>${movie.overview}</p>
        </div>
        `;
  }

  setType(e: MouseEvent) {
    if (e.target && e.target instanceof HTMLElement) {
      e.stopPropagation();

      if (e.target.className !== 'buttons') {
        if (e.target.id === 'movie-radio') {
          const activeRadio = document.querySelector(
            'label:first-of-type'
          ) as HTMLLabelElement;
          const inactiveRadio = document.querySelector(
            'label:last-of-type'
          ) as HTMLDivElement;

          activeRadio.style.border = '1px solid yellow';
          inactiveRadio.style.border = '1px solid transparent';
          document.querySelector('button')!.textContent = 'Generate Movie';
        } else if (e.target.id === 'tv-radio') {
          const inactiveRadio = document.querySelector(
            'label:first-of-type'
          ) as HTMLLabelElement;
          inactiveRadio.style.border = '1px solid transparent';
          const activeRadio = document.querySelector(
            'label:last-of-type'
          ) as HTMLLabelElement;
          activeRadio.style.border = '1px solid yellow';
          document.querySelector('button')!.textContent = 'Generate Series';
        }
      }
    }
  }
}

interface ApiResponse {
  results: ResultsInterface[];
}

interface ResultsInterface {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string | undefined;
  first_air_date: string | undefined;
  title: string | undefined;
  name: string | undefined;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

const app = new App();
