import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts, fetchNewArrivals } from '../../store/slices/productSlice'; 
import HeroSlider from './components/HeroSlider';
import StatsSection from './components/StatsSection';
import FeaturedProducts from './components/FeaturedProducts';
import PromotionalBanner from './components/PromotionalBanner';
import NewArrivals from './components/NewArrivals';
import BestSellers from './components/BestSellers';
import BenefitsSection from './components/BenefitsSection';
import Newsletter from './components/Newsletter';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CollectionCards from './components/CollectionCards';

const HomePage = () => {
  const dispatch = useDispatch();
  const { featuredProducts, newArrivals, loading } = useSelector(state => state.products);
  
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadHomepageData = async () => {
      setIsInitialLoading(true);
      try {
        await Promise.all([
          dispatch(fetchFeaturedProducts()).unwrap(),
          dispatch(fetchNewArrivals()).unwrap()
        ]);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadHomepageData();
  }, [dispatch]);

  if (isInitialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      <HeroSlider />
      <StatsSection />
      <CollectionCards />
      <FeaturedProducts products={featuredProducts || []} />
      {/* <PromotionalBanner /> */}
      <NewArrivals products={newArrivals || []} />
      <BestSellers />
      <BenefitsSection />
      <Newsletter />
    </div>
  );
};

export default HomePage;