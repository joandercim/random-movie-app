class App {
  constructor() {
    this.loadEventListeners();
  }

  //Define global variables
  private streamingServicesBuy: any[] | undefined;
  private streamingServicesRent: any[] | undefined;
  private rentHTML: string | undefined = '';
  private buyHTML: string | undefined = '';
  private radioMovie = document.getElementById(
    'movie-radio'
  ) as HTMLInputElement;
  private radioTV = document.getElementById('tv-radio') as HTMLInputElement;
  private overlayDiv: HTMLDivElement | null =
    document.querySelector('.overlay');
  private imgURL: string = 'https://image.tmdb.org/t/p/original';
  private responseContainer: HTMLDivElement | null = document.querySelector(
    '.response-container'
  );
  private submitBtn: HTMLButtonElement | null =
    document.querySelector('button');
  private movieLabel = document.querySelector(
    'label:first-of-type'
  ) as HTMLLabelElement;
  private seriesLabel = document.querySelector(
    'label:last-of-type'
  ) as HTMLLabelElement;

  private options: RequestInit = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTYxZTBiNjFlYTY5MDhlM2IzNGZkYzhlMDViZGQwZCIsInN1YiI6IjY0MjAxNmZlMmRjOWRjMDBmZDFiMzZiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.f5VD8-Y1HJ8yI6ISuM9nql6F5sWAnPO7eZTs3cEa2O0',
    },
  };

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

  setType(e: MouseEvent) {
    if (e.target && e.target instanceof HTMLElement && this.submitBtn) {
      if (e.target.className !== 'buttons') {
        if (e.target.id === 'movie-radio') {
          this.movieLabel.style.border = '1px solid yellow';
          this.seriesLabel.style.border = '1px solid transparent';

          this.submitBtn.textContent = 'Generate Movie';
          this.submitBtn.classList.remove('disabled');
          this.submitBtn.removeAttribute('disabled');
        } else if (e.target.id === 'tv-radio') {
          this.movieLabel.style.border = '1px solid transparent';
          this.seriesLabel.style.border = '1px solid yellow';

          this.submitBtn.textContent = 'Generate Series';
          this.submitBtn.classList.remove('disabled');
          this.submitBtn.removeAttribute('disabled');
        }
      }
    }
  }

  showSpinner() {
    document.getElementById('spinner')!.style.display = 'block';
  }

  hideSpinner() {
    document.getElementById('spinner')!.style.display = 'none';
  }

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (this.radioTV.checked) {
      this.fetchMoviesOrSeries('tv');
    } else if (this.radioMovie.checked) {
      this.fetchMoviesOrSeries('movie');
    } else {
      alert('You have to select movie or series');
      return;
    }
  }

  async fetchMoviesOrSeries(type: string) {
    this.buyHTML = '';
    this.rentHTML = '';
    this.responseContainer ? (this.responseContainer.innerHTML = '') : null;

    this.showSpinner();

    // Fetch popular movies or series
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/popular`,
        this.options
      );

      if (!res.ok) {
        throw new Error(`Response was not ok. Status: ${res.status}`);
      }

      const data: ApiResponsePopular = await res.json();
      const { results } = data;

      const randomNumber = Math.floor(Math.random() * results.length);

      // Display random movie or series
      this.displayResults(results[randomNumber], type);
    } catch (error) {
      console.error('Error in fetchMoviesOrSeries: ' + error);
      throw error;
    }
  }

  async displayResults(data: PopularResultsInterface, type: string) {
    let showOrMovie: string = '';
    type === 'tv' ? (showOrMovie = 'series') : (showOrMovie = 'movie');

    // Check if movie or series is available for streaming.
    const streamingAt = await this.checkIsStreaming(type, data.id);

    if (streamingAt !== undefined) {
      this.streamingServicesRent = streamingAt.rent;
      this.streamingServicesBuy = streamingAt.buy;

      this.rentHTML = `
      <h5>Rent ${showOrMovie} at:</h5>
      <ul>
      ${this.streamingServicesRent
        ?.map((service) => {
          return `<li>${service.provider_name}</li>`;
        })
        .join('')}
      </ul>
      `;

      this.buyHTML = `
      <h5>Buy ${showOrMovie} at:</h5>
      <ul>
      ${this.streamingServicesBuy
        ?.map((service) => {
          return `<li>${service.provider_name}</li>`;
        })
        .join('')}
      </ul>
      `;
    }

    this.hideSpinner();

    // Set backdrop
    this.overlayDiv!.style.backgroundImage = `url(${this.imgURL}${data.backdrop_path})`;

    // Set information
    if (this.responseContainer) {
      this.responseContainer!.innerHTML = `
            <img src="${this.imgURL + data.poster_path}" class="poster" alt="${
        data.name
      }">
            <div class="information">
              <h2>${type === 'movie' ? data.title : data.name}</h2>
                  <p><i class="fa-solid fa-star"></i>${data.vote_average.toFixed(
                    1
                  )}/10</p>
                  <p class="air-date">${
                    type === 'movie'
                      ? `Release Date: ${data.release_date}`
                      : `First Air Date: ${data.first_air_date}`
                  }</p>
                  <p>${
                    data.overview === ''
                      ? 'No overview available.'
                      : data.overview
                  }</p>
                  <div class="streaming-services">
                  <div class="rent">
                    ${
                      this.streamingServicesRent
                        ? this.rentHTML
                        : 'Not available for rent.'
                    }
                  </div>
                  <div class="buy">
                    ${
                      this.streamingServicesBuy
                        ? this.buyHTML
                        : 'Not available for purchase.'
                    }
                  </div>
                </div>
            </div>
            `;
    }
  }

  async checkIsStreaming(type: string, id: number) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}/watch/providers?justWatch`,
        this.options
      );

      if (!res.ok) {
        throw new Error(`Response was not ok. Status: ${res.status}`);
      }

      const data: StreamingResultsInterface = await res.json();

      return data.results.SE || undefined;
    } catch (error) {
      console.error('Error: ' + error);
      throw error;
    }
  }
}

interface ApiResponsePopular {
  results: PopularResultsInterface[];
}

interface StreamingResultsInterface {
  id: number;
  results: {
    SE: {
      link: string;
      buy: StreamingProvider[];
      rent: StreamingProvider[];
    };
  };
}

interface StreamingProvider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

interface PopularResultsInterface {
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
