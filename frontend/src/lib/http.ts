import axios from 'axios';

const httpServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const http = (method: "GET" | "POST" | "PUT" | "DELETE", url: string, data?: any) => {
  return httpServer({
    method,
    url,
    data,
    headers: {
        Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : undefined
    }
  });
}

export default http;