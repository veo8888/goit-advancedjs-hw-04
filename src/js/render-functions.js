import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;

export function renderGallery(images) {
  const gallery = document.querySelector('.gallery');

  const markup = images
    .map(
      img => `
    <li class="gallery-item">
      <a href="${img.largeImageURL}" title="${img.tags}">
        <img class="gallery-image" src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
      </a>
      <div class="info">
        <ul class="info-list">
          <li><span>Likes</span><br>${img.likes}</li>
          <li><span>Views</span><br>${img.views}</li>
          <li><span>Comments</span><br>${img.comments}</li>
          <li><span>Downloads</span><br>${img.downloads}</li>
        </ul>
      </div>
    </li>
  `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

export function clearGallery() {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
}
