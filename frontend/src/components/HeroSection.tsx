'use client';

interface HeroSectionProps {
  onSearch: (search: string, category?: string, location?: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    const location = formData.get('location') as string;
    onSearch(search, undefined, location);
  };

  return (
    <section className="relative bg-linear-to-r from-blue-600 to-purple-700 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Dream Explore Discover
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            People Don't Take, Trips Take People
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  name="search"
                  placeholder="Search Now"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                Search Now
              </button>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-6 text-center">
            <p className="text-white opacity-80 mb-2">Popular:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Saloon', 'Restaurant', 'Game', 'Counter', 'Train Station', 'Parking', 'Shopping'].map((item) => (
                <button
                  key={item}
                  onClick={() => onSearch(item)}
                  className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm hover:bg-opacity-30 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
