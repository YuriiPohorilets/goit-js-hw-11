import ImagesApiService from './js/images-service';
// import LoadMoreBtn from './js/load-more';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  galleryContainer: document.querySelector('.gallery'),
  searchForm: document.querySelector('.search-form'),
  toTopBtn: document.querySelector('.to-top'),
  wrapper: document.querySelector('.wrapper'),
};

const imagesApiService = new ImagesApiService();
const gallery = new SimpleLightbox('.gallery a');
// const loadMoreBtn = new LoadMoreBtn({
//   selector: '.load-more',
//   hidden: true,
// });
const optionsForObserver = {
  rootMargin: '250px',
};
const observer = new IntersectionObserver(onEntry, optionsForObserver);

// observer.observe(refs.wrapper);
refs.searchForm.addEventListener('submit', onSearch);
refs.toTopBtn.addEventListener('click', onTopScroll);
// loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
window.addEventListener('scroll', onScrollToTopBtn);

function onSearch(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  imagesApiService.resetLoadedHits();
  imagesApiService.resetPage();
  // loadMoreBtn.show();
  // loadMoreBtn.disable();
  clearGelleryContainer();

  if (!imagesApiService.query) {
    return erorrQuery();
  }

  imagesApiService.fetchImages().then(({ hits, totalHits }) => {
    if (!hits.length) {
      // setTimeout(() => {
      //   loadMoreBtn.hide();
      // }, 1_500);

      return erorrQuery();
    }

    observer.observe(refs.wrapper);
    // loadMoreBtn.enable();
    imagesApiService.incrementLoadedHits(hits);
    createGalleryMarkup(hits);
    accessQuery(totalHits);
    gallery.refresh();

    if (hits.length === totalHits) {
      // loadMoreBtn.hide();
      observer.unobserve(refs.wrapper);
      endOfSearch();
    }
  });

  observer.unobserve(refs.wrapper);
}

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && imagesApiService.query) {
      imagesApiService
        .fetchImages()
        .then(({ hits, totalHits }) => {
          imagesApiService.incrementLoadedHits(hits);
          if (totalHits <= imagesApiService.loadedHits) {
            observer.unobserve(refs.wrapper);
            endOfSearch();
          }

          createGalleryMarkup(hits);
          smoothScrollGallery();
          gallery.refresh();
        })
        .catch(error => {
          console.warn(`${error}`);
        });
    }
  });
}

// function onLoadMore() {
//   loadMoreBtn.disable();

//   imagesApiService.fetchImages().then(({ hits, totalHits }) => {
//     imagesApiService.incrementLoadedHits(hits);
//     loadMoreBtn.enable();

//     if (totalHits <= imagesApiService.loadedHits) {
//       loadMoreBtn.hide();
//       endOfSearch();
//     }

//     createGalleryMarkup(hits);
//     gallery.refresh();
//   });
// }

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

function onScrollToTopBtn() {
  const offsetTrigger = 100;
  const pageOffset = window.pageYOffset;

  pageOffset > offsetTrigger
    ? refs.toTopBtn.classList.remove('is-hidden')
    : refs.toTopBtn.classList.add('is-hidden');
}

function onTopScroll() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

function smoothScrollGallery() {
  const { height } = refs.galleryContainer.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}
