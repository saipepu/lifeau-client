import { api } from '../api.js';

export const deleteContainer = async ({ name }) => {

  const response = await fetch(`${api}/container/${name}`,{
    method: 'DELETE',
  })
  .then(response => response.json())
  .catch(error => console.error('Error:', error));

  return response;
}