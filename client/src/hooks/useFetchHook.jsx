// useFetch.js
import { useCallback } from 'react';

function useFetch(baseURL) {
  const fetchData = useCallback(async (urlPart, method = 'GET', body = null) => {
    try {
      const response = await fetch(`http://localhost:3000/${urlPart}`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      return result;
    } catch (err) {
      console.log(err.message);
      alert('Server error');
      return null;
    }
  }, []);

  return { fetchData };
}

export default useFetch;