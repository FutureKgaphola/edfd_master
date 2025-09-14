import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchOriginators = async (id: string) => {
  const resp = await axios.get(`/api/originators/retrive?districtd=${id}`);
  return resp.data || [];
};

type UseOriginatorsOptions = {
  enabled?: boolean;
};

const useOriginators = (id: string, options: UseOriginatorsOptions = {}) => {
  const { data, isLoading, error } = useQuery({
    queryFn: () => fetchOriginators(id),
    queryKey: ['originators', id], // changed to array key for proper caching
    enabled: options.enabled ?? !!id, // allow override, fallback to id presence
  });

  return { data, isLoading, error };
};

export default useOriginators;
