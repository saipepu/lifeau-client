import { api } from '../api.js';

export const getOneContainer = async ({ name }) => {

  const response = await fetch(`${api}/container/${name}`)
  .then(response => response.json())
  .catch(error => console.error('Error:', error));

  return response;
}