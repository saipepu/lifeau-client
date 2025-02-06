import { api } from '../api.js';

export const getAllUsersContainers = async () => {

  const response = await fetch(`${api}/project`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .catch(error => console.log('Error:', error));

  return response;
}