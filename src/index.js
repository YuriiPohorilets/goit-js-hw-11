import ImagesApiService from './js/components/images-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  galleryContainer: document.querySelector('.gallery'),
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const imagesApiService = new ImagesApiService();
const gallery = new SimpleLightbox('.gallery a', { spinner: true });

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  imagesApiService.searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  imagesApiService.resetLoadedHits();
  imagesApiService.resetPage();

  imagesApiService.fetchImages().then(({ hits, totalHits }) => {
    if (imagesApiService.searchQuery === '' || hits.length === 0) {
      return erorrQuery();
    }

    imagesApiService.loadedHits += hits.length;
    clearGelleryContainer();
    createGalleryMarkup(hits);
    accessQuery(totalHits);
    refs.loadMoreBtn.classList.remove('load-more--is-hidden');
    gallery.refresh();

    if (hits.length === totalHits) {
      endOfSearch();
      refs.loadMoreBtn.classList.add('load-more--is-hidden');
    }
  });
}

function onLoadMore() {
  imagesApiService.fetchImages().then(({ hits, totalHits }) => {
    imagesApiService.loadedHits += hits.length;

    if (totalHits <= imagesApiService.loadedHits) {
      endOfSearch();
      refs.loadMoreBtn.classList.add('load-more--is-hidden');
    }

    console.log(imagesApiService.loadedHits);
    createGalleryMarkup(hits);
    gallery.refresh();
  });
}

function accessQuery(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}
function endOfSearch() {
  Notify.info("We're sorry, but you've reached the end of search results.");
}

function erorrQuery() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function clearGelleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function createGalleryMarkup(images) {
  const markup = images
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `
    <div class="photo-card">
      <a href="${webformatURL}">
        <img
          class="photo-card__img"
          src="${largeImageURL}" 
          alt="${tags}" 
          loading="lazy" 
          width="320"
          height="212"
        />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <span>${likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b>
          <span>${views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span>${comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <span>${downloads}</span>
        </p>
      </div>
    </div>
    `;
    })
    .join('');

  refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
}
