import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { fetchImages, perPage } from './js/pixabay-api.js';
import { renderGallery, clearGallery } from './js/render-functions.js';

const form = document.querySelector('#search-form');
const loader = document.querySelector('#loader');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.btn-load-more');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

form.addEventListener('submit', async e => {
  e.preventDefault();

  const query = e.target.searchQuery.value.trim();

  if (query === '') {
    iziToast.warning({
      message: 'The field must not be empty',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  toggleLoadMore(false);
  moveLoaderAfter(form);
  toggleLoader(true);

  await new Promise(resolve => setTimeout(resolve, 1000)); // Тестовая задержка визуализации загрузчика

  try {
    const data = await fetchImages(currentQuery, currentPage);
    totalHits = data.totalHits;
    toggleLoader(false);

    if (data.hits.length === 0) {
      iziToast.info({
        message: 'Sorry, there are no images matching your search query.',
        position: 'topRight',
        color: 'red',
      });
      return;
    }

    renderGallery(data.hits);
    toggleLoadMore(data.hits.length >= perPage);
  } catch (error) {
    toggleLoader(false);
    iziToast.error({
      message: `Error: ${error.message}`,
      position: 'topRight',
    });
  }

  form.reset();
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  moveLoaderAfter(gallery);
  toggleLoader(true);
  toggleLoadMore(false);

  await new Promise(resolve => setTimeout(resolve, 1000)); // Тестовая задержка визуализации загрузчика

  try {
    const data = await fetchImages(currentQuery, currentPage);
    toggleLoader(false);
    renderGallery(data.hits);
    smoothScroll();

    const loadedImages = document.querySelectorAll('.gallery-item').length;
    if (loadedImages >= totalHits) {
      toggleLoadMore(false);
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        color: 'red',
      });
    } else {
      toggleLoadMore(true);
    }
  } catch (error) {
    toggleLoader(false);
    iziToast.error({
      message: `Error: ${error.message}`,
      position: 'topRight',
    });
  }
});

function toggleLoader(show) {
  loader.classList.toggle('hidden', !show);
}

function toggleLoadMore(show) {
  loadMoreBtn.classList.toggle('hidden', !show);
}

function moveLoaderAfter(targetElement) {
  if (!targetElement) return;
  targetElement.insertAdjacentElement('afterend', loader);
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery-item')
    .getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
