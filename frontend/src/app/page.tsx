'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { businessApi, categoryApi } from '../lib/api';
import { Business, Category } from '../types';
import LoadingScreen from '../components/LoadingScreen';
import Header from '../components/Header';
import ActionCards from '../components/ActionCards';
import FeaturedListings from '../components/FeaturedListings';
import CategorySection from '../components/CategorySection';
import StatsSection from '../components/StatsSection';
import Footer from '../components/Footer';
import BusinessDetailModal from '../components/BusinessDetailModal';
import PromotionalCarousel from '../components/PromotionalCarousel';
import SearchBar from '../components/SearchBar';

// Importar componentes que requieren APIs del navegador solo en el cliente
const GoogleMapsSection = dynamic(() => import('../components/GoogleMapsSection'), { ssr: false });
const PWAInstaller = dynamic(() => import('../components/PWAInstaller'), { ssr: false });

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Mostrar loading screen por 2 segundos
    const loadingTimer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 2000);

    loadInitialData();

    return () => clearTimeout(loadingTimer);
  }, []);

  const loadInitialData = async () => {
    try {
      setError(null);
      setLoading(true);
      console.log('🔍 Cargando datos iniciales...');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      console.log('📍 API URL:', apiUrl);
      
      let businessesError: Error | null = null;
      let categoriesError: Error | null = null;
      
      const [businessesData, categoriesData] = await Promise.all([
        businessApi.getAll({ limit: 12 }).catch((err) => {
          console.error('❌ Error loading businesses:', err);
          businessesError = err instanceof Error ? err : new Error('Error desconocido');
          return [];
        }),
        categoryApi.getAll().catch((err) => {
          console.error('❌ Error loading categories:', err);
          categoriesError = err instanceof Error ? err : new Error('Error desconocido');
          return [];
        })
      ]);
      
      console.log('✅ Datos cargados:', {
        businesses: businessesData.length,
        categories: categoriesData.length
      });
      
      setBusinesses(businessesData);
      setCategories(categoriesData);
      
      // Determinar el tipo de error y mostrar mensaje apropiado
      if (businessesError || categoriesError) {
        const errorMsg = businessesError?.message || categoriesError?.message || 'Error desconocido';
        
        // Verificar si es un error de conexión
        if (errorMsg.includes('conectar') || errorMsg.includes('Network') || errorMsg.includes('ECONNREFUSED') || errorMsg.includes('ERR_NETWORK')) {
          setError(`No se pudo conectar con el servidor. Verifica que el backend esté corriendo en ${apiUrl}. Revisa la consola para más detalles.`);
        } else {
          setError(`Error al cargar los datos: ${errorMsg}. Revisa la consola para más detalles.`);
        }
      } else if (businessesData.length === 0 && categoriesData.length === 0) {
        // Si no hay errores pero ambos arrays están vacíos, podría ser un problema de conexión
        setError('No se pudieron cargar los datos. Verifica la conexión con el servidor. Revisa la consola para más detalles.');
      } else if (businessesData.length === 0) {
        // Si hay categorías pero no negocios, es probable que simplemente no haya negocios
        setError(null); // No mostrar error si solo no hay negocios pero sí hay categorías
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar los datos';
      setError(`Error inesperado: ${errorMessage}. Revisa la consola para más detalles.`);
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
      {showLoadingScreen && <LoadingScreen />}
      
      <div className={`min-h-screen bg-white transition-opacity duration-500 ${
        showLoadingScreen ? 'opacity-0' : 'opacity-100'
      }`}>
        <Header />

        <main>
          <CategorySection
            categories={categories}
            onCategorySelect={(categoryName) => handleSearch('', categoryName)}
          />
          
          {/* Buscador encima del hero */}
          <SearchBar onSearch={handleSearch} />
          
          {/* Carrusel promocional */}
          <PromotionalCarousel />
          
          <GoogleMapsSection businesses={businesses} onSearch={handleSearch} />
          
          <ActionCards />
          
          {error && (
            <div className="container mx-auto px-4 py-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-xl font-bold text-red-800">Error al cargar los datos</h3>
                </div>
                <p className="text-red-800 font-medium mb-4">⚠️ {error}</p>
                <div className="bg-white rounded p-4 mb-4 text-left text-sm text-gray-700">
                  <p className="font-semibold mb-2">Información de diagnóstico:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>URL del API: <code className="bg-gray-100 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}</code></li>
                    <li>Verifica que el backend esté corriendo en el puerto 5000</li>
                    <li>Abre la consola del navegador (F12) para ver más detalles</li>
                  </ul>
                </div>
                <button
                  onClick={loadInitialData}
                  className="btn-orange mt-4 px-6 py-3 rounded-lg"
                >
                  🔄 Reintentar
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
          
          <StatsSection />
        </main>

        <Footer />

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