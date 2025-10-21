export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">DondeOficial</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Comprehensive directory platform to discover and explore the best businesses and destinations.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                Facebook
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Instagram
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="/listings" className="text-gray-400 hover:text-white transition-colors">Listings</a></li>
              <li><a href="/add-listing" className="text-gray-400 hover:text-white transition-colors">Add Listing</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><a href="/category/restaurant" className="text-gray-400 hover:text-white transition-colors">Restaurant</a></li>
              <li><a href="/category/museum" className="text-gray-400 hover:text-white transition-colors">Museum</a></li>
              <li><a href="/category/party-center" className="text-gray-400 hover:text-white transition-colors">Party Center</a></li>
              <li><a href="/category/game-field" className="text-gray-400 hover:text-white transition-colors">Game Field</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              Copyright © 2025. All rights reserved to DondeOficial
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms & Conditions
              </a>
              <a href="/services" className="text-gray-400 hover:text-white text-sm transition-colors">
                Services
              </a>
              <a href="/career" className="text-gray-400 hover:text-white text-sm transition-colors">
                Career
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
