import { api } from '../api.js';

export const getAllContainer = async () => {

  const response = await fetch(`${api}/container`)
  .then(response => response.json())
  .catch(error => console.error('Error:', error));

  return response;
}