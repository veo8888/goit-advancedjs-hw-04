import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '50732849-21223ac287faa79ee0d00336e';

export const perPage = 15;

export async function fetchImages(query, page = 1) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page,
    per_page: perPage,
  });

  const url = `${BASE_URL}?${params}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}
