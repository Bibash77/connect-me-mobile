import {useState, useCallback} from 'react';
import {
  useAllNearbyBussinessesMutation,
  useAllSearchedCategoriesMutation,
  useAllTopBussinessesMutation,
} from '@redux/features/businesses/businessService';

export function useBusinessData(location) {
  const [allTopBussinesses] = useAllTopBussinessesMutation();
  const [allNearbyBussinesses] = useAllNearbyBussinessesMutation();
  const [allSearchedCategories] = useAllSearchedCategoriesMutation();

  const [topSearchedCategories, setTopSearchedCategories] = useState([]);
  const [nearbyBusinesses, setNearbyBusinesses] = useState([]);
  const [topBusinesses, setTopBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState({
    categories: false,
    nearby: false,
    top: false,
  });

  const fetchAllData = useCallback(async () => {
    if (!location) return;

    const postData = {
      latitude: location.latitude,
      longitude: location.longitude,
      page: 1,
      limit: 10,
    };

    setIsLoading({categories: true, nearby: true, top: true});

    try {
      const [categoriesResp, nearbyResp, topResp] = await Promise.all([
        allSearchedCategories(postData).unwrap(),
        allNearbyBussinesses(postData).unwrap(),
        allTopBussinesses(postData).unwrap(),
      ]);

      setTopSearchedCategories(categoriesResp.results || []);
      setNearbyBusinesses(nearbyResp.results || []);
      setTopBusinesses(topResp.results || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading({categories: false, nearby: false, top: false});
    }
  }, [
    location,
    allSearchedCategories,
    allNearbyBussinesses,
    allTopBussinesses,
  ]);

  return {
    topSearchedCategories,
    nearbyBusinesses,
    topBusinesses,
    fetchAllData,
    isLoading,
  };
}
