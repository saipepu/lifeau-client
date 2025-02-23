import { api, k8Api } from '../api.js';

export const getAllDeployments = async () => {

  const response = await fetch(`${k8Api}/deployments`, {
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