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
        this.rentHTML = '';
        this.buyHTML = '';
        this.radioMovie = document.getElementById('movie-radio');
        this.radioTV = document.getElementById('tv-radio');
        this.overlayDiv = document.querySelector('.overlay');
        this.imgURL = 'https://image.tmdb.org/t/p/original';
        this.responseContainer = document.querySelector('.response-container');
        this.submitBtn = document.querySelector('button');
        this.movieLabel = document.querySelector('label:first-of-type');
        this.seriesLabel = document.querySelector('label:last-of-type');
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
    setType(e) {
        if (e.target && e.target instanceof HTMLElement && this.submitBtn) {
            if (e.target.className !== 'buttons') {
                if (e.target.id === 'movie-radio') {
                    this.movieLabel.style.border = '1px solid yellow';
                    this.seriesLabel.style.border = '1px solid transparent';
                    this.submitBtn.textContent = 'Generate Movie';
                    this.submitBtn.classList.remove('disabled');
                    this.submitBtn.removeAttribute('disabled');
                }
                else if (e.target.id === 'tv-radio') {
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
        document.getElementById('spinner').style.display = 'block';
    }
    hideSpinner() {
        document.getElementById('spinner').style.display = 'none';
    }
    handleSubmit(e) {
        e.preventDefault();
        if (this.radioTV.checked) {
            this.fetchMoviesOrSeries('tv');
        }
        else if (this.radioMovie.checked) {
            this.fetchMoviesOrSeries('movie');
        }
        else {
            alert('You have to select movie or series');
            return;
        }
    }
    fetchMoviesOrSeries(type) {
        return __awaiter(this, void 0, void 0, function* () {
            this.buyHTML = '';
            this.rentHTML = '';
            this.responseContainer ? (this.responseContainer.innerHTML = '') : null;
            this.showSpinner();
            // Fetch popular movies or series
            try {
                const res = yield fetch(`https://api.themoviedb.org/3/${type}/popular`, this.options);
                if (!res.ok) {
                    throw new Error(`Response was not ok. Status: ${res.status}`);
                }
                const data = yield res.json();
                const { results } = data;
                const randomNumber = Math.floor(Math.random() * results.length);
                // Display random movie or series
                this.displayResults(results[randomNumber], type);
            }
            catch (error) {
                console.error('Error in fetchMoviesOrSeries: ' + error);
                throw error;
            }
        });
    }
    displayResults(data, type) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let showOrMovie = '';
            type === 'tv' ? (showOrMovie = 'series') : (showOrMovie = 'movie');
            // Check if movie or series is available for streaming.
            const streamingAt = yield this.checkIsStreaming(type, data.id);
            if (streamingAt !== undefined) {
                this.streamingServicesRent = streamingAt.rent;
                this.streamingServicesBuy = streamingAt.buy;
                this.rentHTML = `
      <h5>Rent ${showOrMovie} at:</h5>
      <ul>
      ${(_a = this.streamingServicesRent) === null || _a === void 0 ? void 0 : _a.map((service) => {
                    return `<li>${service.provider_name}</li>`;
                }).join('')}
      </ul>
      `;
                this.buyHTML = `
      <h5>Buy ${showOrMovie} at:</h5>
      <ul>
      ${(_b = this.streamingServicesBuy) === null || _b === void 0 ? void 0 : _b.map((service) => {
                    return `<li>${service.provider_name}</li>`;
                }).join('')}
      </ul>
      `;
            }
            this.hideSpinner();
            // Set backdrop
            this.overlayDiv.style.backgroundImage = `url(${this.imgURL}${data.backdrop_path})`;
            // Set information
            if (this.responseContainer) {
                this.responseContainer.innerHTML = `
            <img src="${this.imgURL + data.poster_path}" class="poster" alt="${data.name}">
            <div class="information">
              <h2>${type === 'movie' ? data.title : data.name}</h2>
                  <p><i class="fa-solid fa-star"></i>${data.vote_average.toFixed(1)}/10</p>
                  <p class="air-date">${type === 'movie'
                    ? `Release Date: ${data.release_date}`
                    : `First Air Date: ${data.first_air_date}`}</p>
                  <p>${data.overview === ''
                    ? 'No overview available.'
                    : data.overview}</p>
                  <div class="streaming-services">
                  <div class="rent">
                    ${this.streamingServicesRent
                    ? this.rentHTML
                    : 'Not available for rent.'}
                  </div>
                  <div class="buy">
                    ${this.streamingServicesBuy
                    ? this.buyHTML
                    : 'Not available for purchase.'}
                  </div>
                </div>
            </div>
            `;
            }
        });
    }
    checkIsStreaming(type, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(`https://api.themoviedb.org/3/${type}/${id}/watch/providers?justWatch`, this.options);
                if (!res.ok) {
                    throw new Error(`Response was not ok. Status: ${res.status}`);
                }
                const data = yield res.json();
                return data.results.SE || undefined;
            }
            catch (error) {
                console.error('Error: ' + error);
                throw error;
            }
        });
    }
}
const app = new App();
