import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from "axios";

const searchForm = document.querySelector('.search-form');
const searchResult = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 200 });

const link = 'https://pixabay.com/api/';
const key = '35729721-f6191ed3932b819a8a4bddcd2';
const params = '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';
let page = 1;
let query = '';

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);
searchResult.addEventListener('click', onClickImage);
loadMoreBtn.style.display = "none";

async function onSearch(e) {
  e.preventDefault();
  query = e.currentTarget.elements.searchQuery.value.trim();
  page = 1;

  if (!query) { return; }
  const data = await fetchPhoto();
  searchResult.innerHTML = "";
  console.log(data);
  if (data.hits.length === 0) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  };
  if (data.total > 0) {
    Notify.success(`Hooray! We found ${data.totalHits} images.`);
    photosMarkup(data);
    lightbox.refresh();
  };
};

async function onLoadMore() {
  page += 1;
  const data = await fetchPhoto();
  if (!data) return;
  photosMarkup(data);
  lightbox.refresh();

  window.scrollBy({
    top: 540,
    behavior: "smooth",
  });
}

function onClickImage(event) {
  event.preventDefault();
  if (event.target.nodeName !== "IMG") { return; }
}

async function fetchPhoto() {
  const url = `${link}?key=${key}${params}&q=${query}&page=${page}`;
  try {
    const response = await axios.get(url);
    const { data } = response; return data;
  }
  catch (error) {
    console.error(error);
  }
}

function photosMarkup(data) {
  let cards = "";
  data.hits.forEach((card) => {
    const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = card; cards +=
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
      </div>`;
  });
  searchResult.insertAdjacentHTML("beforeend", cards);

  if (data.hits.length < 40 || page === 13) {
    loadMoreBtn.style.display = "none";
    Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
    loadMoreBtn.style.display = "block";
  }
};





