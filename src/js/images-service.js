import axios from 'axios';

const API_KEY = '29796536-5ed99ce8effe96d6d69c656a8';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.loadedHits = 0;
  }

  async fetchImages() {
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
    });

    const url = `${BASE_URL}?${searchParams}`;

    try {
      const response = await axios.get(url);
      this.incrementPage();

      return response.data;
    } catch (error) {
      console.warn(`${error}`);
    }
  }

  incrementLoadedHits(hits) {
    this.loadedHits += hits.length;
  }

  resetLoadedHits() {
    this.loadedHits = 0;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
