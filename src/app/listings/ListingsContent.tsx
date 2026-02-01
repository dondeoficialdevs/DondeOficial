'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { businessApi, categoryApi } from '../../lib/api';
import { Business, Category } from '../../types';
import BusinessDetailModal from '../../components/BusinessDetailModal';
import ImageSlider from '../../components/ImageSlider';
import {
  Filter,
  X,
  ChevronRight,
  Check,
  RotateCcw,
  Search as SearchIcon,
  MapPin,
  Star,
  DollarSign,
  Store,
  Navigation,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';

export default function ListingsContent() {
  const searchParams = useSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('most_sold');
  const [priceFilters, setPriceFilters] = useState<string[]>(['all']);
  const [ratingFilters, setRatingFilters] = useState<string[]>(['all']);
  const [sellerFilters, setSellerFilters] = useState<string[]>(['Todas']);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'categories' | 'featured'>('featured');

  // Temporary states for filters (used in mobile drawer before applying)
  const [tempSelectedCategory, setTempSelectedCategory] = useState<string>('');
  const [tempLocation, setTempLocation] = useState('');
  const [tempPriceFilters, setTempPriceFilters] = useState<string[]>(['all']);
  const [tempRatingFilters, setTempRatingFilters] = useState<string[]>(['all']);
  const [tempSellerFilters, setTempSellerFilters] = useState<string[]>(['Todas']);
  const [tempSortBy, setTempSortBy] = useState('most_sold');
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllBusinesses, setShowAllBusinesses] = useState(false);

  // Cargar conteos de categorías de forma independiente y temprana
  const loadCategoryCounts = async () => {
    try {
      const countsData = await categoryApi.getCounts();
      const countsMap: Record<string, number> = {};
      countsData.forEach((item: { name: string; count: number }) => {
        countsMap[item.name.toUpperCase()] = item.count;
      });
      setCategoryCounts(countsMap);
    } catch (error) {
      console.error('Error loading category counts:', error);
      // En caso de error, mantener el objeto vacío
    } finally {
      setLoadingCounts(false);
    }
  };

  const loadInitialData = async (initialCategory?: string) => {
    try {
      const categoryToUse = initialCategory || selectedCategory;

      const [businessesData, categoriesData] = await Promise.all([
        businessApi.getAll({
          limit: 50,
          category: categoryToUse || undefined
        }).catch(() => []),
        categoryApi.getAll().catch(() => [])
      ]);

      setBusinesses(businessesData);
      setCategories(categoriesData);

      // Si hay una categoría inicial, actualizar el estado
      if (initialCategory) {
        setSelectedCategory(initialCategory);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar conteos de categorías inmediatamente al montar el componente
  useEffect(() => {
    loadCategoryCounts();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const decodedCategory = decodeURIComponent(categoryParam);
      setSelectedCategory(decodedCategory);
      loadInitialData(decodedCategory);
    } else {
      loadInitialData();
    }
    // Resetear showAll cuando cambien los parámetros de búsqueda
    setShowAllBusinesses(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Bloquear scroll cuando los filtros están abiertos en móvil
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileFilters]);

  // Sincronizar estados temporales cuando se abren los filtros en móvil
  const openMobileFilters = () => {
    setTempSelectedCategory(selectedCategory);
    setTempLocation(location);
    setTempPriceFilters(priceFilters);
    setTempRatingFilters(ratingFilters);
    setTempSellerFilters(sellerFilters);
    setTempSortBy(sortBy);
    setShowMobileFilters(true);
  };

  const applyMobileFilters = () => {
    setSelectedCategory(tempSelectedCategory);
    setLocation(tempLocation);
    setPriceFilters(tempPriceFilters);
    setRatingFilters(tempRatingFilters);
    setSellerFilters(tempSellerFilters);
    setSortBy(tempSortBy);

    // Si cambió la categoría o ubicación, recargar datos
    if (tempSelectedCategory !== selectedCategory || tempLocation !== location) {
      handleSearch(searchTerm, tempSelectedCategory, tempLocation);
    }

    setShowMobileFilters(false);
  };

  const resetFilters = () => {
    setTempSelectedCategory('');
    setTempLocation('');
    setTempPriceFilters(['all']);
    setTempRatingFilters(['all']);
    setTempSellerFilters(['Todas']);
    setTempSortBy('most_sold');
  };

  const isFilterChanged = useMemo(() => {
    return tempSelectedCategory !== selectedCategory ||
      tempLocation !== location ||
      JSON.stringify(tempPriceFilters) !== JSON.stringify(priceFilters) ||
      JSON.stringify(tempRatingFilters) !== JSON.stringify(ratingFilters) ||
      JSON.stringify(tempSellerFilters) !== JSON.stringify(sellerFilters) ||
      tempSortBy !== sortBy;
  }, [tempSelectedCategory, selectedCategory, tempLocation, location, tempPriceFilters, priceFilters, tempRatingFilters, ratingFilters, tempSellerFilters, sellerFilters, tempSortBy, sortBy]);

  const handleSearch = async (search: string, category?: string, loc?: string) => {
    setLoading(true);
    setSearchTerm(search);
    setSelectedCategory(category || '');
    setLocation(loc || '');

    try {
      const results = await businessApi.getAll({
        search,
        category,
        location: loc,
        limit: 50
      });
      setBusinesses(results);
    } catch (error) {
      console.error('Error searching:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryName: string) => {
    setSelectedCategory(categoryName);
    handleSearch('', categoryName, location);
  };

  const getCategoryCount = (categoryName: string) => {
    return businesses.filter(b => b.category_name?.toLowerCase() === categoryName.toLowerCase()).length;
  };

  const getCategoryIcon = (name: string) => {
    const iconStyle = {
      color: '#FF6B35',
      filter: 'drop-shadow(0 0 1px rgba(255, 107, 53, 0.4))',
    };

    const icons: { [key: string]: React.ReactElement } = {
      'Belleza': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Entretenimiento': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Gastronomía': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253c0-.855-.917-1.545-2.05-1.545-1.133 0-2.05.69-2.05 1.545 0 .855.917 1.545 2.05 1.545 1.133 0 2.05-.69 2.05-1.545zM12 6.253c0-.855.917-1.545 2.05-1.545 1.133 0 2.05.69 2.05 1.545 0 .855-.917 1.545-2.05 1.545-1.133 0-2.05-.69-2.05-1.545zM12 6.253v12.5" />
        </svg>
      ),
      'Viajes y turismo': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'Bienestar y salud': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      'Servicios': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
        </svg>
      ),
      'Productos': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      'Cerca de mí': (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };
    return icons[name] || (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={iconStyle}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  };

  const mainCategories = [
    'Belleza', 'Entretenimiento', 'Gastronomía', 'Viajes y turismo',
    'Bienestar y salud', 'Servicios', 'Productos'
  ];

  const getCategoryBackendName = (frontendName: string): string => {
    const foundCategory = categories.find(cat =>
      cat.name.toLowerCase() === frontendName.toLowerCase() ||
      cat.name.toLowerCase().includes(frontendName.toLowerCase()) ||
      frontendName.toLowerCase().includes(cat.name.toLowerCase())
    );

    if (foundCategory) {
      return foundCategory.name;
    }

    const categoryMap: { [key: string]: string } = {
      'Belleza': 'Belleza',
      'Entretenimiento': 'Entretenimiento',
      'Gastronomía': 'Gastronomía',
      'Viajes y turismo': 'Viajes y turismo',
      'Bienestar y salud': 'Bienestar y salud',
      'Servicios': 'Servicios',
      'Productos': 'Productos',
      'Cerca de mí': ''
    };
    return categoryMap[frontendName] || frontendName;
  };

  const togglePriceFilter = (value: string) => {
    if (value === 'all') {
      setPriceFilters(['all']);
    } else {
      setPriceFilters(prev => {
        const newFilters = prev.filter(f => f !== 'all');
        if (newFilters.includes(value)) {
          return newFilters.length > 1 ? newFilters.filter(f => f !== value) : ['all'];
        }
        return [...newFilters, value];
      });
    }
  };

  const toggleRatingFilter = (value: string) => {
    if (value === 'all') {
      setRatingFilters(['all']);
    } else {
      setRatingFilters(prev => {
        const newFilters = prev.filter(f => f !== 'all');
        if (newFilters.includes(value)) {
          return newFilters.length > 1 ? newFilters.filter(f => f !== value) : ['all'];
        }
        return [...newFilters, value];
      });
    }
  };

  const toggleSellerFilter = (value: string) => {
    if (value === 'Todas') {
      setSellerFilters(['Todas']);
    } else {
      setSellerFilters(prev => {
        const newFilters = prev.filter(f => f !== 'Todas');
        if (newFilters.includes(value)) {
          return newFilters.length > 1 ? newFilters.filter(f => f !== value) : ['Todas'];
        }
        return [...newFilters, value];
      });
    }
  };

  // Función para filtrar negocios según los filtros aplicados
  const getFilteredBusinesses = () => {
    let filtered = [...businesses];

    // Filtro por precio
    if (!priceFilters.includes('all') && priceFilters.length > 0) {
      filtered = filtered.filter(business => {
        // Usar el precio con oferta si existe, sino el precio normal
        const businessPrice = Number(business.offer_price) || Number(business.price) || 0;

        // Verificar si el precio del negocio está en alguno de los rangos seleccionados
        return priceFilters.some(priceFilter => {
          if (priceFilter === 'all') return true;

          if (priceFilter === '0-25000') {
            return businessPrice > 0 && businessPrice <= 25000;
          } else if (priceFilter === '25000-35000') {
            return businessPrice > 25000 && businessPrice <= 35000;
          } else if (priceFilter === '35000-55000') {
            return businessPrice > 35000 && businessPrice <= 55000;
          } else if (priceFilter === '55000+') {
            return businessPrice > 55000;
          }

          return false;
        });
      });
    }

    // Filtro por calificación
    if (!ratingFilters.includes('all') && ratingFilters.length > 0) {
      const minRating = Math.min(...ratingFilters.map(r => parseInt(r)));
      filtered = filtered.filter(business => {
        const rating = Number(business.average_rating) || 0;
        return rating >= minRating;
      });
    }

    // Filtro por vendedor (por ahora solo Marketplace, ya que eliminamos Cuponatic)
    if (!sellerFilters.includes('Todas') && sellerFilters.length > 0) {
      // Este filtro se puede implementar cuando se agregue información del vendedor
      // Por ahora, si está seleccionado "Marketplace", mostramos todos
      // Si no está seleccionado "Todas", no mostramos nada (lógica a ajustar según necesidades)
    }

    // Ordenamiento
    if (sortBy === 'rating') {
      filtered.sort((a, b) => {
        const ratingA = Number(a.average_rating) || 0;
        const ratingB = Number(b.average_rating) || 0;
        return ratingB - ratingA;
      });
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
    } else if (sortBy === 'price_low') {
      filtered.sort((a, b) => {
        const priceA = Number(a.offer_price) || Number(a.price) || 0;
        const priceB = Number(b.offer_price) || Number(b.price) || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'price_high') {
      filtered.sort((a, b) => {
        const priceA = Number(a.offer_price) || Number(a.price) || 0;
        const priceB = Number(b.offer_price) || Number(b.price) || 0;
        return priceB - priceA;
      });
    }

    return filtered;
  };

  return (
    <div className="min-h-screen bg-white">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top Categories Bar */}
        <div className="bg-white border-b border-gray-200 pb-4 mb-4">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            <div className="flex space-x-6 min-w-max px-2">
              {mainCategories.map((cat) => {
                const backendCategoryName = getCategoryBackendName(cat);
                const isSelected = selectedCategory.toLowerCase() === backendCategoryName.toLowerCase();

                return (
                  <button
                    key={cat}
                    onClick={() => {
                      handleCategoryFilter(backendCategoryName);
                    }}
                    className={`flex flex-col items-center gap-2 py-1 transition-all group relative`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 scale-90 sm:scale-100 ${isSelected
                      ? 'bg-orange-600 shadow-lg shadow-orange-600/20'
                      : 'bg-white shadow-sm group-hover:shadow-md border border-gray-100'
                      }`}>
                      <div className={isSelected ? 'text-white' : ''}>
                        {getCategoryIcon(cat)}
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isSelected ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                      {cat}
                    </span>
                    {isSelected && (
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-600 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Bar (Professional Desktop Version) */}
          <div className="hidden sm:flex justify-end items-center pt-6 border-t border-gray-50 mt-2">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Ordenar por</span>
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/5 cursor-pointer transition-all hover:bg-white hover:border-orange-500/30"
                >
                  <option value="most_sold">Tendencias</option>
                  <option value="price_low">Precio: Bajo</option>
                  <option value="price_high">Precio: Alto</option>
                  <option value="newest">Novedades</option>
                  <option value="rating">Mejor Calificados</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-600">
                  <ChevronDown size={14} strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md -mx-4 px-4 py-3 border-b border-gray-100 flex gap-3">
          <button
            onClick={openMobileFilters}
            className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.15em] flex items-center justify-center space-x-3 shadow-lg shadow-orange-600/20 active:scale-[0.98] transition-all"
          >
            <Filter size={16} />
            <span>Filtros y Orden</span>
          </button>

          {(selectedCategory || location || !priceFilters.includes('all') || !ratingFilters.includes('all')) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setLocation('');
                setPriceFilters(['all']);
                setRatingFilters(['all']);
                setSellerFilters(['Todas']);
                handleSearch('', '', '');
              }}
              className="p-3.5 bg-gray-100 text-gray-500 rounded-2xl active:scale-[0.98] transition-all"
              title="Limpiar Filtros"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>

        <div className="flex gap-4">
          {/* Desktop Sidebar (Legendary Style) */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)]">
              {/* Tabs */}
              <div className="flex p-1.5 bg-gray-50/50">
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`flex-1 px-4 py-2.5 text-[10px] font-black tracking-widest uppercase transition-all duration-300 rounded-xl ${activeTab === 'categories'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Categorías
                </button>
                <button
                  onClick={() => setActiveTab('featured')}
                  className={`flex-1 px-4 py-2.5 text-[10px] font-black tracking-widest uppercase transition-all duration-300 rounded-xl ${activeTab === 'featured'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  Explorar
                </button>
              </div>

              {/* Categories List */}
              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {activeTab === 'featured' && (
                  <div className="divide-y divide-gray-50">
                    {[
                      { name: 'BELLEZA' },
                      { name: 'ENTRETENIMIENTO' },
                      { name: 'GASTRONOMÍA' },
                      { name: 'VIAJES Y TURISMO' },
                      { name: 'BIENESTAR Y SALUD' },
                      { name: 'SERVICIOS' },
                      { name: 'PRODUCTOS' },
                    ].map((cat) => {
                      const count = loadingCounts ? "..." : (categoryCounts[cat.name] || 0);
                      const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                      return (
                        <button
                          key={cat.name}
                          onClick={() => handleCategoryFilter(cat.name.toLowerCase())}
                          className={`group w-full flex items-center justify-between px-5 py-4 text-xs tracking-tight transition-all ${isSelected ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          <span className={`font-bold transition-transform duration-300 ${isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>{cat.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-medium opacity-60`}>{count}</span>
                            <ChevronRight size={14} className={`opacity-20 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100' : ''}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {activeTab === 'categories' && (
                  <div className="p-2 space-y-1">
                    {categories.map((category) => {
                      const count = loadingCounts ? "..." : (categoryCounts[category.name.toUpperCase()] || 0);
                      const isActive = selectedCategory === category.name;
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryFilter(category.name)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs transition-all ${isActive
                            ? 'bg-orange-600 text-white font-black shadow-lg shadow-orange-600/20'
                            : 'hover:bg-gray-50 text-gray-500 font-bold'
                            }`}
                        >
                          <span className="uppercase truncate flex-1 text-left">{category.name}</span>
                          <span className={`text-[10px] opacity-60 ml-2`}>({count})</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sidebar Filters */}
              <div className="p-6 space-y-8 border-t border-gray-50 bg-gray-50/10">
                {/* Location Filter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ubicación</h4>
                    <MapPin size={12} className="text-gray-300" />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Barrio o ciudad..."
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        handleSearch(searchTerm, selectedCategory, e.target.value);
                      }}
                      className="w-full pl-4 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500/50 shadow-sm transition-all"
                    />
                  </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rango de Precio</h4>
                    <DollarSign size={12} className="text-gray-300" />
                  </div>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Todas las ofertas' },
                      { value: '0-25000', label: 'Inesperados (< $25k)' },
                      { value: '25000-35000', label: '$25.000 - $35.000' },
                      { value: '35000-55000', label: '$35.000 - $55.000' },
                      { value: '55000+', label: 'Premium (> $55k)' }
                    ].map((price) => (
                      <label key={price.value} className="flex items-center group cursor-pointer">
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={priceFilters.includes(price.value)}
                            onChange={() => togglePriceFilter(price.value)}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-gray-200 rounded-md transition-all peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center group-hover:border-orange-200">
                            <Check size={12} className="text-white scale-0 transition-transform duration-200 peer-checked:scale-100" strokeWidth={4} />
                          </div>
                        </div>
                        <span className={`ml-3 text-xs font-bold transition-colors ${priceFilters.includes(price.value) ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'}`}>{price.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Calificación</h4>
                    <Star size={12} className="text-gray-300" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'all', label: 'Cualquiera' },
                      { value: '5', label: '5' },
                      { value: '4', label: '4+' },
                      { value: '3', label: '3+' },
                      { value: '2', label: '2+' },
                      { value: '1', label: '1+' }
                    ].map((rating) => (
                      <button
                        key={rating.value}
                        onClick={() => toggleRatingFilter(rating.value)}
                        className={`py-2 rounded-xl text-[10px] font-black transition-all border ${ratingFilters.includes(rating.value)
                          ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                          : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'
                          }`}
                      >
                        {rating.label} {rating.value !== 'all' && '★'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Drawer (Glassmorphism & UX Masterpiece) */}
          <div className={`lg:hidden fixed inset-0 z-[100] transition-all duration-500 perspective-1000 ${showMobileFilters ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {/* Backdrop Layer */}
            <div
              className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${showMobileFilters ? 'opacity-100' : 'opacity-0'}`}
              onClick={() => setShowMobileFilters(false)}
            />

            {/* Drawer Container */}
            <div className={`absolute bottom-0 left-0 right-0 h-[92vh] flex flex-col transition-all duration-700 ease-out transform origin-bottom ${showMobileFilters ? 'translate-y-0 scale-100 rounded-t-[3rem]' : 'translate-y-full scale-95 opacity-0'}`}>

              {/* Animated Glowing Border for Drawer */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

              {/* Real Content Surface */}
              <div className="h-full bg-white/80 backdrop-blur-3xl rounded-t-[3rem] shadow-[0_-20px_80px_-20px_rgba(0,0,0,0.5)] border-t border-white/40 flex flex-col overflow-hidden">

                {/* Visual Handle */}
                <div className="flex justify-center pt-5 pb-2">
                  <div className="w-14 h-1.5 bg-gray-300/50 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="px-8 py-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">Filtros</h2>
                    <span className="text-[10px] font-black text-orange-600 tracking-widest uppercase mt-1">Refina tu búsqueda</span>
                  </div>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-12 h-12 rounded-2xl bg-gray-100/50 flex items-center justify-center text-gray-500 active:scale-90 transition-transform"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Scrollable Filters Area */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-12 no-scrollbar">

                  {/* Sort Selection (Integrated into mobile drawer) */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-gray-400 rounded-full"></div>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Ordenar por</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'most_sold', label: 'Tendencias' },
                        { value: 'newest', label: 'Novedades' },
                        { value: 'rating', label: 'Mejor Calificados' },
                        { value: 'price_low', label: 'Precio: Bajo' },
                        { value: 'price_high', label: 'Precio: Alto' },
                      ].map((item) => {
                        const isSelected = tempSortBy === item.value;
                        return (
                          <button
                            key={item.value}
                            onClick={() => setTempSortBy(item.value)}
                            className={`px-4 py-4 rounded-[1.5rem] font-black text-[10px] tracking-tight uppercase transition-all duration-300 border ${isSelected
                              ? 'bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-900/10'
                              : 'bg-white/50 border-gray-100 text-gray-500 hover:border-gray-200'}`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Selection Carousel */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-orange-600 rounded-full"></div>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Categoría</h4>
                    </div>
                    <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
                      {mainCategories.map((cat) => {
                        const backendName = getCategoryBackendName(cat);
                        const isSelected = tempSelectedCategory === backendName;
                        return (
                          <button
                            key={cat}
                            onClick={() => setTempSelectedCategory(isSelected ? '' : backendName)}
                            className={`shrink-0 h-16 px-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 ${isSelected
                              ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-600/30'
                              : 'bg-white/50 border-gray-100 text-gray-600'}`}
                          >
                            <span className="text-[11px] font-black tracking-tight whitespace-nowrap uppercase">{cat}</span>
                            {isSelected && <Check size={14} strokeWidth={4} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Location with Auto-Suggestion Look */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">¿En dónde buscas?</h4>
                    </div>
                    <div className="relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-600 transition-transform duration-300 group-focus-within:scale-110">
                        <Navigation size={22} strokeWidth={2.5} />
                      </div>
                      <input
                        type="text"
                        placeholder="Ej: Tunja, Unicentro, Sur..."
                        value={tempLocation}
                        onChange={(e) => setTempLocation(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 bg-gray-100/50 border border-transparent rounded-[2rem] text-sm font-black text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500/20 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Price Grid */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-emerald-600 rounded-full"></div>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Presupuesto</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { value: 'all', label: 'Todas las ofertas', icon: RotateCcw },
                        { value: '0-25000', label: 'Hasta $25.000', icon: DollarSign },
                        { value: '25000-35000', label: '$25.000 - $35.000', icon: DollarSign },
                        { value: '35000-55000', label: '$35.000 - $55.000', icon: DollarSign },
                        { value: '55000+', label: 'Más de $55.000', icon: DollarSign }
                      ].map((price) => {
                        const isSelected = tempPriceFilters.includes(price.value);
                        return (
                          <button
                            key={price.value}
                            onClick={() => {
                              if (price.value === 'all') {
                                setTempPriceFilters(['all']);
                              } else {
                                setTempPriceFilters(prev => {
                                  const newFilters = prev.filter(f => f !== 'all');
                                  if (newFilters.includes(price.value)) {
                                    return newFilters.length > 1 ? newFilters.filter(f => f !== price.value) : ['all'];
                                  }
                                  return [...newFilters, price.value];
                                });
                              }
                            }}
                            className={`flex items-center justify-between p-5 rounded-[2rem] transition-all duration-300 border ${isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-600/30'
                              : 'bg-white/50 border-gray-100 text-gray-900 hover:border-emerald-200'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}>
                                <price.icon size={18} />
                              </div>
                              <span className="text-sm font-black">{price.label}</span>
                            </div>
                            {isSelected && <Check size={20} strokeWidth={4} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rating Selection */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-yellow-500 rounded-full"></div>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Calificación</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: 'all', label: 'Todas' },
                        { value: '5', label: '5 ★' },
                        { value: '4', label: '4+ ★' },
                        { value: '3', label: '3+ ★' },
                        { value: '2', label: '2+ ★' }
                      ].map((rating) => {
                        const isSelected = tempRatingFilters.includes(rating.value);
                        return (
                          <button
                            key={rating.value}
                            onClick={() => {
                              if (rating.value === 'all') {
                                setTempRatingFilters(['all']);
                              } else {
                                setTempRatingFilters(prev => {
                                  const newFilters = prev.filter(f => f !== 'all');
                                  if (newFilters.includes(rating.value)) {
                                    return newFilters.length > 1 ? newFilters.filter(f => f !== rating.value) : ['all'];
                                  }
                                  return [...newFilters, rating.value];
                                });
                              }
                            }}
                            className={`px-6 py-4 rounded-2xl font-black text-xs transition-all border ${isSelected
                              ? 'bg-yellow-500 border-yellow-500 text-white shadow-lg shadow-yellow-500/20'
                              : 'bg-white/50 border-gray-100 text-gray-500'}`}
                          >
                            {rating.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="p-8 pb-10 border-t border-white/40 bg-white/40 backdrop-blur-3xl flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={resetFilters}
                      className="flex-[0.3] h-16 bg-gray-100/50 text-gray-500 rounded-3xl flex items-center justify-center active:scale-95 transition-all"
                      title="Reiniciar"
                    >
                      <RotateCcw size={20} />
                    </button>
                    <button
                      onClick={applyMobileFilters}
                      className={`flex-1 h-16 rounded-3xl font-black text-lg tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-500 ${isFilterChanged
                        ? 'bg-orange-600 text-white shadow-[0_15px_40px_-10px_rgba(234,88,12,0.5)] scale-100'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      {isFilterChanged ? (
                        <>
                          <Check size={22} strokeWidth={4} />
                          Guardar Cambios
                        </>
                      ) : (
                        'Sin cambios'
                      )}
                    </button>
                  </div>
                  <p className="text-center text-[10px] font-black text-gray-400 tracking-widest leading-none">
                    Tus cambios se aplicarán instantáneamente
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando...</p>
              </div>
            ) : (() => {
              const filteredBusinesses = getFilteredBusinesses();
              const initialDisplayCount = 9;
              const displayedBusinesses = showAllBusinesses
                ? filteredBusinesses
                : filteredBusinesses.slice(0, initialDisplayCount);
              const hasMore = filteredBusinesses.length > initialDisplayCount;

              return displayedBusinesses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {displayedBusinesses.map((business) => {
                      const primaryImage = business.images?.find(img => img.is_primary) || business.images?.[0];
                      // Usar precio real del negocio
                      // Convertir has_offer correctamente (puede venir como string 'true', boolean true, etc.)
                      const rawHasOffer = business.has_offer;
                      const hasOffer =
                        (typeof rawHasOffer === 'boolean' && rawHasOffer) ||
                        (typeof rawHasOffer === 'string' && ['true', 't'].includes(rawHasOffer.toLowerCase())) ||
                        (typeof rawHasOffer === 'number' && rawHasOffer === 1) ||
                        false;
                      const currentPrice = Number(business.offer_price) || Number(business.price) || 0;
                      const originalPrice = hasOffer && business.offer_price ? Number(business.price) : 0;
                      const distance = (Math.random() * 200 + 10).toFixed(1);

                      return (
                        <div key={business.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          {/* Slider de imágenes (máximo 3) */}
                          <div className="relative h-48">
                            {business.images && business.images.length > 0 ? (
                              <>
                                <ImageSlider
                                  images={business.images}
                                  alt={business.name}
                                  maxImages={3}
                                  className="w-full h-full"
                                />
                                {/* Badge de Ofertas */}
                                {hasOffer && (
                                  <div className="absolute top-2 left-2 px-3 py-1.5 rounded-md text-xs font-bold text-white z-20 bg-gradient-to-r from-red-500 to-orange-500 shadow-lg flex items-center space-x-1.5">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.179 4.455a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.179-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                                    </svg>
                                    <span>OFERTA</span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                                <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {/* Badge de Ofertas para negocio sin imagen */}
                                {hasOffer && (
                                  <div className="absolute top-2 left-2 px-3 py-1.5 rounded-md text-xs font-bold text-white z-20 bg-gradient-to-r from-red-500 to-orange-500 shadow-lg flex items-center space-x-1.5">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.179 4.455a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.179-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                                    </svg>
                                    <span>OFERTA</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                              {business.name}
                            </h3>

                            {/* Location */}
                            {business.address && (
                              <div className="flex items-center text-xs text-gray-600 mb-2">
                                <span className="font-medium">{distance} km, {business.address}</span>
                              </div>
                            )}

                            {/* Services Icons - Removed hardcoded labels */}
                            <div className="flex items-center space-x-3 mb-3 h-5">
                            </div>

                            {/* Price */}
                            {currentPrice > 0 && (
                              <div className="flex items-baseline space-x-2 mb-2">
                                <span className="text-xl font-bold text-gray-900">
                                  ${currentPrice.toLocaleString('es-CO')}
                                </span>
                                {hasOffer && originalPrice > 0 && (
                                  <>
                                    <span className="text-sm text-gray-500 line-through">
                                      ${originalPrice.toLocaleString('es-CO')}
                                    </span>
                                    <span className="text-xs font-bold text-red-500">
                                      -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                                    </span>
                                  </>
                                )}
                              </div>
                            )}

                            {/* Offer Description */}
                            {hasOffer && business.offer_description && (
                              <div className="mb-2">
                                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                  {business.offer_description}
                                </span>
                              </div>
                            )}

                            {/* Sold Count */}
                            {business.total_reviews !== undefined && business.total_reviews > 0 && (
                              <div className="mb-3">
                                <span className="text-xs text-gray-600 font-medium">
                                  {business.total_reviews} {business.total_reviews === 1 ? 'Reseña' : 'Reseñas'}
                                </span>
                              </div>
                            )}

                            {/* Button */}
                            <button
                              onClick={() => {
                                setSelectedBusinessId(business.id);
                                setIsModalOpen(true);
                              }}
                              className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm"
                            >
                              VER OFERTA
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div >
                  {hasMore && (
                    <div className="text-center mt-12">
                      <button
                        onClick={() => setShowAllBusinesses(!showAllBusinesses)}
                        className="inline-flex items-center space-x-2 bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <span>{showAllBusinesses ? 'Ver Menos' : 'Ver Más'}</span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${showAllBusinesses ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )
                  }
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600">No se encontraron negocios con los filtros seleccionados</p>
                </div>
              );
            })()}
          </div>
        </div>
      </main >

      {/* Business Detail Modal */}
      <BusinessDetailModal
        businessId={selectedBusinessId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBusinessId(null);
        }}
      />
    </div >
  );
}

