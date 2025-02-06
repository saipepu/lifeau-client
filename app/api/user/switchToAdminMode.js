import { api } from '../api.js';

export const switchToAdminMode = async (dto) => {

  console.log('SWITCHING TO ADMIN MODE');
  const response = await fetch(`${api}/user/switch-to-admin-mode`, {
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