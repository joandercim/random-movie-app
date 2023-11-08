"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class App {
    constructor() {
        this.options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTYxZTBiNjFlYTY5MDhlM2IzNGZkYzhlMDViZGQwZCIsInN1YiI6IjY0MjAxNmZlMmRjOWRjMDBmZDFiMzZiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.f5VD8-Y1HJ8yI6ISuM9nql6F5sWAnPO7eZTs3cEa2O0',
            },
        };
        this.loadEventListeners();
    }
    loadEventListeners() {
        const form = document.querySelector('form');
        const buttons = document.querySelector('.buttons');
        if (form instanceof HTMLFormElement && buttons instanceof HTMLDivElement) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
            buttons.addEventListener('click', (e) => this.setType(e));
        }
        else {
            throw new Error('Form or button element does not exist');
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        const radioTV = document.getElementById('tv-radio');
        const radioMovie = document.getElementById('movie-radio');
        if (radioTV.checked) {
            this.fetchMoviesOrSeries('tv');
        }
        else if (radioMovie.checked) {
            this.fetchMoviesOrSeries('movie');
        }
        else {
            alert('You have to select movie or series');
            return;
        }
    }
    fetchMoviesOrSeries(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`https://api.themoviedb.org/3/${type}/popular`, this.options);
            try {
                if (!res.ok) {
                    throw new Error(`Response was not ok. Error: ${Error}`);
                }
                const data = yield res.json();
                const { results } = data;
                const randomNumber = Math.floor(Math.random() * results.length);
                if (type === 'tv') {
                    this.displaySeries(results[randomNumber]);
                }
                else {
                    this.displayMovie(results[randomNumber]);
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    displaySeries(show) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const streamingAt = yield this.checkIsStreaming('tv', show.id);
            if (streamingAt !== undefined) {
                this.streamingServicesRent = streamingAt.rent;
                this.streamingServicesBuy = streamingAt.buy;
                this.rentHTML = `
      <h5>Rent series at:</h5>
      <ul>
      ${(_a = this.streamingServicesRent) === null || _a === void 0 ? void 0 : _a.map((service) => {
                    return `<li>${service.provider_name}</li>`;
                }).join('')}
      </ul>
      `;
                this.buyHTML = `
      <h5>Buy series at:</h5>
      <ul>
      ${(_b = this.streamingServicesBuy) === null || _b === void 0 ? void 0 : _b.map((service) => {
                    return `<li>${service.provider_name}</li>`;
                }).join('')}
      </ul>
      `;
            }
            const imgUrl = `https://image.tmdb.org/t/p/w500${show.poster_path}`;
            const releaseDate = show.first_air_date;
            const responseContainer = document.querySelector('.response-container');
            // Set backdrop
            const overlayDiv = document.querySelector('.overlay');
            overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`;
            // Set information
            responseContainer.innerHTML = `
          <img src="${imgUrl}" class="poster" alt="${show.name}">
          <div class="information">
            <h2>${show.name}</h2>
                <p><i class="fa-solid fa-star"></i>${show.vote_average.toFixed(1)}/10</p>
                <p class="air-date">First Air Date: ${releaseDate}</p>
                <p>${show.overview}</p>
                <div class="streaming-services">
                <div class="rent">
                  ${this.streamingServicesRent ? this.rentHTML : ''}
                </div>
                <div class="buy">
                  ${this.streamingServicesBuy ? this.buyHTML : ''}
                </div>
              </div>
          </div>
          `;
        });
    }
    displayMovie(movie) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const streamingAt = yield this.checkIsStreaming('movie', movie.id);
            if (streamingAt !== undefined) {
                this.streamingServicesRent = streamingAt.rent;
                this.streamingServicesBuy = streamingAt.buy;
                this.rentHTML = `
      <h5>Rent movie at:</h5>
      <ul>
      ${(_a = this.streamingServicesRent) === null || _a === void 0 ? void 0 : _a.map((service) => {
                    return `<li>${service.provider_name}</li>`;
                }).join('')}
      </ul>
      `;
                this.buyHTML = `
      <h5>Buy movie at:</h5>
      <ul>
      ${(_b = this.streamingServicesBuy) === null || _b === void 0 ? void 0 : _b.map((service) => {
                    return `<li>${service.provider_name}</li>`;
                }).join('')}
      </ul>
      `;
            }
            const releaseDate = movie.release_date;
            const imgUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            const overlayDiv = document.querySelector('.overlay');
            const responseContainer = document.querySelector('.response-container');
            // Set backdrop
            overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
            // Set information
            responseContainer.innerHTML = `
        <img src="${imgUrl}" class="poster" alt="${movie.title}">
        <div class="information">
        <h2>${movie.title}</h2>
            <p><i class="fa-solid fa-star"></i>${movie.vote_average.toFixed(1)}/10</p>
            <p class="air-date">Release Date: ${releaseDate}</p>
            <p>${movie.overview}</p>
            <div class="streaming-services">
              <div class="rent">
                ${this.streamingServicesRent ? this.rentHTML : 'This movie is not available for streaming in Sweden.'}
              </div>
              <div class="buy">
                ${this.streamingServicesBuy ? this.buyHTML : 'This movie is not available for purchase in Sweden.'}
              </div>
            </div>
        </div>
        `;
        });
    }
    checkIsStreaming(type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`https://api.themoviedb.org/3/${type}/${id}/watch/providers?justWatch`, this.options);
            try {
                if (!res.ok) {
                    throw new Error(`Response was not ok. Error: ${Error}`);
                }
                const data = yield res.json();
                if (data.results.SE) {
                    return data.results.SE;
                }
                else {
                    return undefined;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    setType(e) {
        if (e.target && e.target instanceof HTMLElement) {
            e.stopPropagation();
            if (e.target.className !== 'buttons') {
                if (e.target.id === 'movie-radio') {
                    const activeRadio = document.querySelector('label:first-of-type');
                    const inactiveRadio = document.querySelector('label:last-of-type');
                    activeRadio.style.border = '1px solid yellow';
                    inactiveRadio.style.border = '1px solid transparent';
                    document.querySelector('button').textContent = 'Generate Movie';
                }
                else if (e.target.id === 'tv-radio') {
                    const inactiveRadio = document.querySelector('label:first-of-type');
                    inactiveRadio.style.border = '1px solid transparent';
                    const activeRadio = document.querySelector('label:last-of-type');
                    activeRadio.style.border = '1px solid yellow';
                    document.querySelector('button').textContent = 'Generate Series';
                }
            }
        }
    }
}
const app = new App();
