'use client';

import { Category } from '../types';

interface CategorySectionProps {
  categories: Category[];
}

const getCategoryIcon = (categoryName: string): string => {
  const icons: { [key: string]: string } = {
    'Restaurant': 'RB',
    'Museums': 'MS',
    'Game Field': 'GF',
    'Job & Feed': 'JF',
    'Party Center': 'PC',
    'Fitness Zone': 'FZ',
    'Restaurantes': 'RS',
  };
  return icons[categoryName] || 'BC';
};

export default function CategorySection({ categories }: CategorySectionProps) {
  // If no categories from API, show default ones like the original site
  const defaultCategories = [
    { id: 1, name: 'Museums', description: 'Explore museums and galleries' },
    { id: 2, name: 'Restaurant', description: 'Find great restaurants' },
    { id: 3, name: 'Game Field', description: 'Sports and gaming venues' },
    { id: 4, name: 'Job & Feed', description: 'Professional services' },
    { id: 5, name: 'Party Center', description: 'Event and party venues' },
    { id: 6, name: 'Fitness Zone', description: 'Gyms and fitness centers' },
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Explore By Destination</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {displayCategories.map((category) => {
            const icon = getCategoryIcon(category.name);
            
            return (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 hover:border-blue-200"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">{icon}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">10 Listing</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
