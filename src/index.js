import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios');

const searchForm = document.querySelector('.search-form');
const searchResult = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// loadMoreBtn.hidden = true;

console.dir(loadMoreBtn);


searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);
searchResult.addEventListener('click', onClickImage);


function onLoadMore() {
}


function onSearch(e) {
    e.preventDefault();
    const queryInput = e.currentTarget.elements.searchQuery.value.trim();
    if (queryInput !== '') {
        fetchPhoto(queryInput).then(data => {
            if (data.total === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            };
            if (data.total > 0) {
                Notify.success(`Hooray! We found ${data.totalHits} images.`);
                searchResult.innerHTML = photosMarkup(data.hits);
                console.log(data.hits);
                const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });
            };
        }).catch(err => {
            console.log(err);
        });
    }
    searchResult.innerHTML = "";
};

function photosMarkup(arr) {
    return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
        <a href="${largeImageURL}">
        <img width="320" src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b> <br> ${likes}
          </p>
          <p class="info-item">
            <b>Views</b> <br> ${views}
          </p>
          <p class="info-item">
            <b>Comments</b> <br> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> <br> ${downloads}
          </p>
        </div>
      </div>`).join('')
};

function fetchPhoto(name) {
    const url = 'https://pixabay.com/api/';
    const params = '?key=35729721-f6191ed3932b819a8a4bddcd2&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40&q=';
    return fetch(`${url}${params}${name}`
    ).then(resp => { if (!resp.ok) { throw new Error(resp.statusText) } return resp.json() });
}

function onClickImage(event) {
    event.preventDefault();
    if (event.target.nodeName !== "IMG") { return; }
}





// function onSearch(e) {
//     e.preventDefault();
//     const queryInput = e.currentTarget.elements.searchQuery.value.trim();
//     console.log(fetchPhoto(queryInput));
//     if (queryInput !== '') {
//         fetchPhoto(queryInput).then(data => {
//             // console.log(data);
//             if (data.total === 0) {
//                 Notify.failure('Sorry, there are no images matching your search query. Please try again.');
//             };
//             if (data.total > 0) {
//                 Notify.success(`Hooray! We found ${data.totalHits} images.`);
//                 searchResult.innerHTML = photosMarkup(data.hits)
//                 console.log(data.hits);
//             };
//         }).catch(err => {
//             console.log(err);
//         });
//     }
//     searchResult.innerHTML = "";
// };