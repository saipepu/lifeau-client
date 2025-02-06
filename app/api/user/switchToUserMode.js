import { api } from '../api.js';

export const switchToUserMode = async (dto) => {

  console.log('SWITCHING TO USER MODE');
  const response = await fetch(`${api}/user/switch-to-user-mode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  })
  .then(response => response.json())
  .catch(error => console.error('Error:', error));

  return response;
}