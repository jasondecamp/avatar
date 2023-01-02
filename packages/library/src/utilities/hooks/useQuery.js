/*
*   Utility for fetching the url query parameters more easily
*   use this hook to return either a specific param or all params as an object:
*     EXAMPLES:
*     const params = useQuery();
*     const { param1, param2 } = useQuery();
*     const myParam = useQuery('param1');
*/
import { useLocation } from 'react-router-dom';

export const useQuery = (param) => {
  const params = new URLSearchParams(useLocation().search);
  if(param) return params.get(param);
  const query = {};
  params.forEach((value, key) => query[key] = value);
  return query;
};
