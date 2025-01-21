import { api } from '../api.js';

export const getAllContainer = async ({ userId }) => {

  const response = await fetch(`${api}/project/user/${userId}`)
  .then(response => response.json())
  .catch(error => console.log('Error:', error));

  return response;
}