'use client';

import { Business } from '../types';
import Link from 'next/link';

interface FeaturedListingsProps {
  businesses: Business[];
  loading: boolean;
}

export default function FeaturedListings({ businesses, loading }: FeaturedListingsProps) {
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Featured List</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Explore Destination</h2>
        </div>

        {businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((business) => (
              <div key={business.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  {business.category_name && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {business.category_name}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      business.opening_hours?.toLowerCase().includes('close') 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {business.opening_hours?.toLowerCase().includes('close') ? 'Close' : 'Open'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{business.name}</h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {business.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-2">(02 Reviews)</span>
                  </div>

                  {business.phone && (
                    <p className="text-sm text-gray-600 mb-2">{business.phone}</p>
                  )}

                  {business.address && (
                    <p className="text-sm text-gray-500 mb-4">{business.address}</p>
                  )}

                  <div className="flex justify-between items-center">
                    <Link
                      href={`/businesses/${business.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No listings available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
