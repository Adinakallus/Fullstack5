// useFetch.js
import { useCallback } from 'react';

function useFetch() {
  const fetchData = useCallback(async (urlPart, method = 'GET', body = null) => {
    try {
      console.log(`Fetching data from http://localhost:3000/${urlPart}`);
      const response = await fetch(`http://localhost:3000/${urlPart}`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : null,
      });
      if (!response.ok) {
        throw new Error(`http status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (err) {
      console.log(err.message);
      alert('Server error ' + err.message);
      return null;
    }
  }, []);

  return { fetchData };
}

export default useFetch;