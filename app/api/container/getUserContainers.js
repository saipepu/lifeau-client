import { api } from '../api.js';

export const getUserContainers = async ({ userId }) => {

  const response = await fetch(`${api}/project/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .catch(error => console.log('Error:', error));

  return response;
}