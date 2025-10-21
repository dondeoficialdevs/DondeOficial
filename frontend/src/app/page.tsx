'use client';

import { useState, useEffect } from 'react';
import { businessApi, categoryApi } from '../lib/api';
import { Business, Category } from '../types';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeaturedListings from '../components/FeaturedListings';
import CategorySection from '../components/CategorySection';
import Footer from '../components/Footer';

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [businessesData, categoriesData] = await Promise.all([
        businessApi.getAll({ limit: 12 }).catch(() => []),
        categoryApi.getAll().catch(() => [])
      ]);
      setBusinesses(businessesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      setBusinesses([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <HeroSection onSearch={async (search: string, category?: string, location?: string) => {
          try {
            const results = await businessApi.getAll({
              search,
              category,
              location,
              limit: 20
            });
            setBusinesses(results);
          } catch (error) {
            console.error('Error searching:', error);
          }
        }} />

        <FeaturedListings businesses={businesses} loading={loading} />
        
        <CategorySection categories={categories} />
      </main>

      <Footer />
    </div>
  );
}