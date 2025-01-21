import { api } from '../api.js';

export const getPublicProfile = async () => {

  const response = await fetch(`${api}/auth/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('life.au-token')}`
    },
  })
  .then(response => response.json())
  .catch(error => console.error('Error:', error));

  return response;
}