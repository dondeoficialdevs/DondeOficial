'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { businessApi, categoryApi } from '../lib/api';
import { Business, Category } from '../types';
import ActionCards from '../components/ActionCards';
import FeaturedListings from '../components/FeaturedListings';
import CategorySection from '../components/CategorySection';
import BusinessDetailModal from '../components/BusinessDetailModal';
import PromotionsSlider from '../components/PromotionsSlider';
import SmartSearch from '../components/SmartSearch';


// Importar componentes que requieren APIs del navegador solo en el cliente
const GoogleMapsSection = dynamic(() => import('../components/GoogleMapsSection'), { ssr: false });
const PWAInstaller = dynamic(() => import('../components/PWAInstaller'), { ssr: false });

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setError(null);
      // Cargar datos sin logs excesivos en producción

      const [businessesData, categoriesData] = await Promise.all([
        businessApi.getAll({ limit: 12 }).catch((err) => {
          console.error('❌ Error loading businesses:', err);
          const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
          setError(`Error al cargar negocios: ${errorMsg}`);
          return [];
        }),
        categoryApi.getAll().catch((err) => {
          console.error('❌ Error loading categories:', err);
          return [];
        })
      ]);

      setBusinesses(businessesData);
      setCategories(categoriesData);

      // Si ambos arrays están vacíos, podría ser un error de conexión
      if (businessesData.length === 0 && categoriesData.length === 0) {
        setError('No se pudieron cargar los datos. Verifica la conexión con el servidor. Revisa la consola para más detalles.');
      } else if (businessesData.length === 0) {
        setError('No se encontraron negocios en la base de datos.');
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar los datos';
      setError(errorMessage);
      setBusinesses([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (search: string, category?: string, location?: string) => {
    setSearching(true);
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
      setBusinesses([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      <div className={`min-h-screen bg-white transition-opacity duration-500`}>
        <main>
          <PromotionsSlider />

          <div className="hidden md:block">
            <SmartSearch
              onSearch={(term, loc) => handleSearch(term, '', loc)}
            />
          </div>

          <CategorySection
            categories={categories}
            onCategorySelect={(categoryName) => handleSearch('', categoryName)}
          />

          <div className="hidden md:block">
            <ActionCards />
          </div>

          {error && (
            <div className="container mx-auto px-4 py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800 font-medium">⚠️ {error}</p>
                <button
                  onClick={loadInitialData}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          )}
          <FeaturedListings
            businesses={businesses}
            loading={loading || searching}
            onBusinessClick={(businessId) => {
              setSelectedBusinessId(businessId);
              setIsModalOpen(true);
            }}
          />
        </main>

        <PWAInstaller />

        {/* Business Detail Modal */}
        <BusinessDetailModal
          businessId={selectedBusinessId}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBusinessId(null);
          }}
        />
      </div>
    </>
  );
}