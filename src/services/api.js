import { create } from 'axios';

export const api = create({
  baseURL: 'https://fakestoreapi.com',
  timeout: 10000,
});
