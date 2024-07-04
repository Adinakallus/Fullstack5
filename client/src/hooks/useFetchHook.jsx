// useFetch.js
import { useState, useCallback } from 'react';

function useFetch(baseURL) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async (urlPart, method = 'GET', body = null) => {
    setError(false);
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
      setData(result);
    } catch (err) {
      setError(true);
      console.log(err.message);
      alert('Server error');
    } 
  }, []);

  return { data, error, fetchData };
}

export default useFetch;

