'use client';

import { useState, useEffect } from 'react';
import { Category } from '../types';
import { categoryApi } from '../lib/api';
import Link from 'next/link';

interface SearchBarProps {
  onSearch: (search: string, category?: string, location?: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [location, setLocation] = useState('Cerca de mí');
  const [customLocation, setCustomLocation] = useState('');
  const [isUsingCustomLocation, setIsUsingCustomLocation] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  // Lista de ciudades comunes de Colombia
  const colombianCities = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Soledad',
    'Ibagué', 'Bucaramanga', 'Santa Marta', 'Villavicencio', 'Pereira', 'Valledupar',
    'Manizales', 'Buenaventura', 'Pasto', 'Neiva', 'Armenia', 'Sincelejo', 'Montería',
    'Popayán', 'Riohacha', 'Tunja', 'Quibdó', 'Florencia', 'Yopal', 'Mocoa', 'Leticia'
  ];

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoryApi.getAll();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.category-dropdown') && !target.closest('.menu-dropdown')) {
        setShowCategoryDropdown(false);
        setShowMenuDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locationToUse = location === 'Cerca de mí' ? '' : location;
    onSearch(searchTerm, selectedCategory || undefined, locationToUse);
  };

  const handleNearMeClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          setLocation('Cerca de mí');
          setCustomLocation('');
          setIsUsingCustomLocation(false);
          onSearch(searchTerm || '', selectedCategory || undefined, `${userLat},${userLng}`);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          alert('No se pudo obtener tu ubicación. Por favor, verifica que hayas permitido el acceso a tu ubicación.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
    }
  };

  const handleCustomLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomLocation(value);
    if (value.trim()) {
      setIsUsingCustomLocation(true);
      setLocation(value);
      
      const filtered = colombianCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setCitySuggestions(filtered);
      setShowCitySuggestions(filtered.length > 0 && value.length > 0);
      
      if (filtered.length === 0 || colombianCities.includes(value)) {
        onSearch(searchTerm || '', selectedCategory || undefined, value);
      }
    } else {
      setIsUsingCustomLocation(false);
      setLocation('Cerca de mí');
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  };

  const handleCitySuggestionClick = (city: string) => {
    setCustomLocation(city);
    setLocation(city);
    setIsUsingCustomLocation(true);
    setShowCitySuggestions(false);
    setCitySuggestions([]);
    onSearch(searchTerm || '', selectedCategory || undefined, city);
  };

  const handleCustomLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocation.trim()) {
      setIsUsingCustomLocation(true);
      setLocation(customLocation);
      onSearch(searchTerm || '', selectedCategory || undefined, customLocation);
    }
  };

  const handleClearLocation = () => {
    setLocation('Cerca de mí');
    setCustomLocation('');
    setIsUsingCustomLocation(false);
    onSearch(searchTerm || '', selectedCategory || undefined, '');
  };

  return (
    <section className="relative bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-5 md:p-6">
          {/* Primera fila: Categorías, Búsqueda, Menú y Buscar */}
          <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0 md:gap-3 md:flex-nowrap">
            {/* Botón Categorías */}
            <div className="relative category-dropdown flex-shrink-0">
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowMenuDropdown(false);
                }}
                className="flex items-center gap-1 sm:gap-2 md:gap-2.5 px-2 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-gray-200 md:bg-gray-100 text-gray-700 rounded-lg md:rounded-xl hover:bg-gray-300 md:hover:bg-gray-200 transition-colors font-medium text-xs sm:text-sm md:text-base shadow-sm md:shadow"
              >
                <span className="font-semibold hidden sm:inline">Categorías</span>
                <span className="font-semibold sm:hidden">Cat.</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 sm:max-h-96 overflow-y-auto">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setShowCategoryDropdown(false);
                          const locationToUse = location === 'Cerca de mí' ? '' : location;
                          onSearch(searchTerm, category.name, locationToUse);
                        }}
                        className={`w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-100 transition-colors text-xs sm:text-sm font-medium ${
                          selectedCategory === category.name ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-900'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-500">Cargando categorías...</div>
                  )}
                </div>
              )}
            </div>

            {/* Campo de búsqueda con ubicación integrada en desktop */}
            <form id="search-form" onSubmit={handleSearchSubmit} className="flex-1 min-w-[120px] flex items-center gap-1 sm:gap-2 md:gap-0 md:bg-gray-100 md:rounded-xl md:shadow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="¿Qué buscas?"
                className="flex-1 px-2 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 bg-gray-200 md:bg-transparent rounded-lg md:rounded-l-xl md:rounded-r-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 md:focus:ring-purple-600 font-medium text-xs sm:text-sm md:text-base"
              />
              
              {/* Ubicación "Cerca de mí" o ciudad personalizada integrada en desktop */}
              <div className="hidden md:flex items-center gap-0 border-l border-gray-300 min-w-0 flex-shrink">
                {!isUsingCustomLocation ? (
                  <div className="flex items-center gap-2 px-3 py-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={handleNearMeClick}
                      className="flex items-center gap-2 hover:bg-gray-200 transition-colors cursor-pointer rounded px-2 py-1 min-w-0 flex-1"
                      aria-label="Buscar cerca de mí"
                    >
                      <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-900 font-semibold truncate max-w-[120px]">{location}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUsingCustomLocation(true);
                        setCustomLocation('');
                      }}
                      className="text-purple-600 hover:text-purple-800 text-xs font-medium px-2 py-1 rounded hover:bg-purple-50 transition-colors flex-shrink-0"
                      title="Escribir otra ciudad"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <div className="relative flex-1">
                    <form onSubmit={handleCustomLocationSubmit} className="flex items-center gap-2 px-3 py-2.5">
                      <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="text"
                        value={customLocation}
                        onChange={handleCustomLocationChange}
                        onFocus={() => {
                          if (citySuggestions.length > 0 && customLocation.length > 0) {
                            setShowCitySuggestions(true);
                          }
                        }}
                        placeholder="Escribe una ciudad..."
                        className="text-sm text-gray-900 font-semibold bg-transparent border-none outline-none focus:outline-none flex-1 min-w-[120px] placeholder-gray-400"
                        autoFocus
                        onBlur={() => {
                          setTimeout(() => {
                            setShowCitySuggestions(false);
                            if (!customLocation.trim()) {
                              setIsUsingCustomLocation(false);
                              setLocation('Cerca de mí');
                            }
                          }, 200);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsUsingCustomLocation(false);
                          setCustomLocation('');
                          setLocation('Cerca de mí');
                          setShowCitySuggestions(false);
                        }}
                        className="text-purple-600 hover:text-purple-800 text-xs font-medium px-2 py-1 rounded hover:bg-purple-50 transition-colors"
                        title="Usar mi ubicación"
                      >
                        Mi ubicación
                      </button>
                    </form>
                    {/* Sugerencias de ciudades */}
                    {showCitySuggestions && citySuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-48 overflow-y-auto">
                        {citySuggestions.map((city, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleCitySuggestionClick(city)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-900"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleClearLocation}
                  className="text-gray-600 hover:text-gray-900 flex-shrink-0 px-2"
                  aria-label="Limpiar ubicación"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Botón con menú desplegable */}
            <div className="relative menu-dropdown flex-shrink-0">
              <button
                onClick={() => {
                  setShowMenuDropdown(!showMenuDropdown);
                  setShowCategoryDropdown(false);
                }}
                className="btn-orange px-2 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 text-white rounded-lg md:rounded-xl font-medium text-xs sm:text-sm md:text-base"
                aria-label="Menú"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {showMenuDropdown && (
                <div className="absolute top-full right-0 mt-2 w-56 sm:w-64 bg-purple-600 rounded-lg shadow-xl z-50">
                  <div className="py-2">
                    <Link href="/add-listing" className="block px-3 sm:px-4 py-2 text-white hover:bg-purple-700 transition-colors font-semibold text-xs sm:text-sm" onClick={() => setShowMenuDropdown(false)}>
                      ANUNCIA TU NEGOCIO
                    </Link>
                    <div className="border-t border-purple-500 my-1"></div>
                    <Link href="/admin/login" className="block px-3 sm:px-4 py-2 text-white hover:bg-purple-700 transition-colors font-medium text-xs sm:text-sm" onClick={() => setShowMenuDropdown(false)}>
                      INICIAR SESIÓN
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Botón de búsqueda (lupa) */}
            <button
              type="button"
              onClick={() => {
                const locationToUse = location === 'Cerca de mí' ? '' : location;
                onSearch(searchTerm, selectedCategory || undefined, locationToUse);
              }}
              className="btn-orange px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-white rounded-lg md:rounded-xl flex-shrink-0"
              aria-label="Buscar"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Segunda fila: Filtro de ubicación (solo en móvil) */}
          <div className="flex md:hidden items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2.5 bg-gray-100 rounded-lg mt-2 w-full">
            {!isUsingCustomLocation ? (
              <div className="flex items-center gap-2 flex-1">
                <button
                  type="button"
                  onClick={handleNearMeClick}
                  className="flex items-center gap-2 flex-1 hover:bg-gray-50 transition-colors rounded px-2 py-1"
                  aria-label="Buscar cerca de mí"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs sm:text-sm text-gray-900 font-semibold truncate flex-1 text-left">{location}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsUsingCustomLocation(true);
                    setCustomLocation('');
                  }}
                  className="text-purple-600 hover:text-purple-800 text-xs font-medium px-2 py-1 rounded hover:bg-purple-50 transition-colors whitespace-nowrap"
                  title="Escribir otra ciudad"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div className="relative flex-1">
                <form onSubmit={handleCustomLocationSubmit} className="flex items-center gap-2">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    value={customLocation}
                    onChange={handleCustomLocationChange}
                    onFocus={() => {
                      if (citySuggestions.length > 0 && customLocation.length > 0) {
                        setShowCitySuggestions(true);
                      }
                    }}
                    placeholder="Escribe una ciudad..."
                    className="text-xs sm:text-sm text-gray-900 font-semibold bg-transparent border-none outline-none focus:outline-none flex-1 placeholder-gray-400"
                    autoFocus
                    onBlur={() => {
                      setTimeout(() => {
                        setShowCitySuggestions(false);
                        if (!customLocation.trim()) {
                          setIsUsingCustomLocation(false);
                          setLocation('Cerca de mí');
                        }
                      }, 200);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsUsingCustomLocation(false);
                      setCustomLocation('');
                      setLocation('Cerca de mí');
                      setShowCitySuggestions(false);
                    }}
                    className="text-purple-600 hover:text-purple-800 text-xs font-medium px-2 py-1 rounded hover:bg-purple-50 transition-colors whitespace-nowrap"
                    title="Usar mi ubicación"
                  >
                    Mi ubicación
                  </button>
                </form>
                {/* Sugerencias de ciudades - móvil */}
                {showCitySuggestions && citySuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-48 overflow-y-auto">
                    {citySuggestions.map((city, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleCitySuggestionClick(city)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-xs sm:text-sm font-medium text-gray-900"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={handleClearLocation}
              className="text-gray-600 hover:text-gray-900 flex-shrink-0"
              aria-label="Limpiar ubicación"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}



