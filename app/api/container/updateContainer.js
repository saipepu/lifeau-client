import { api } from '../api.js';

export const updateContainer = async ({ container }) => {

  const response = await fetch(`${api}/container/${container.name}`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Application': 'application/json',
    },
    body: JSON.stringify(container)
  })
  .then(response => response.json())
  .catch(error => console.error('Error:', error));

  return response;
}