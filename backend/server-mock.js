const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Mock data
const mockBusinesses = [
  {
    id: 1,
    name: "Food Corner",
    description: "Delicious local cuisine with fresh ingredients and authentic flavors. A perfect place for family dinners and special occasions.",
    category_name: "Restaurant",
    phone: "+98 (265) 3652 - 05",
    address: "California, USA",
    opening_hours: "Open",
    price_range: "$05.00 - $80.00",
    rating: 4.5,
    reviews_count: 24
  },
  {
    id: 2,
    name: "Central History",
    description: "Explore the rich history of our city through interactive exhibits and guided tours. Perfect for history enthusiasts and families.",
    category_name: "Museums",
    phone: "+98 (265) 3652 - 05",
    address: "California, USA",
    opening_hours: "Open",
    price_range: "$05.00 - $80.00",
    rating: 4.3,
    reviews_count: 18
  },
  {
    id: 3,
    name: "Xtream Gym",
    description: "State-of-the-art fitness center with modern equipment and professional trainers. Achieve your fitness goals with us.",
    category_name: "Fitness Zone",
    phone: "+98 (265) 3652 - 05",
    address: "California, USA",
    opening_hours: "Close",
    price_range: "$05.00 - $80.00",
    rating: 4.7,
    reviews_count: 32
  },
  {
    id: 4,
    name: "Mega Agency",
    description: "Professional services agency offering comprehensive business solutions and career development opportunities.",
    category_name: "Job & Feed",
    phone: "+98 (265) 3652 - 05",
    address: "California, USA",
    opening_hours: "Open",
    price_range: "$05.00 - $80.00",
    rating: 4.2,
    reviews_count: 15
  },
  {
    id: 5,
    name: "Central Plaza",
    description: "Modern shopping and entertainment complex with diverse retail stores, restaurants, and entertainment options.",
    category_name: "Shopping",
    phone: "+98 (265) 3652 - 05",
    address: "California, USA",
    opening_hours: "Close",
    price_range: "$05.00 - $80.00",
    rating: 4.4,
    reviews_count: 28
  },
  {
    id: 6,
    name: "National Art",
    description: "Contemporary art gallery featuring works from local and international artists. A cultural hub for art lovers.",
    category_name: "Art Gallery",
    phone: "+98 (265) 3652 - 05",
    address: "California, USA",
    opening_hours: "Open",
    price_range: "$05.00 - $80.00",
    rating: 4.6,
    reviews_count: 21
  }
];

const mockCategories = [
  { id: 1, name: "Restaurant", description: "Food and dining establishments" },
  { id: 2, name: "Museums", description: "Cultural and historical sites" },
  { id: 3, name: "Game Field", description: "Sports and recreational facilities" },
  { id: 4, name: "Job & Feed", description: "Professional services and employment" },
  { id: 5, name: "Party Center", description: "Event venues and party spaces" },
  { id: 6, name: "Fitness Zone", description: "Gyms and fitness centers" }
];

// Routes
app.get('/api/businesses', (req, res) => {
  const { search, category, location, limit = 20, offset = 0 } = req.query;
  
  let filteredBusinesses = [...mockBusinesses];
  
  // Apply filters
  if (search) {
    filteredBusinesses = filteredBusinesses.filter(business => 
      business.name.toLowerCase().includes(search.toLowerCase()) ||
      business.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category) {
    filteredBusinesses = filteredBusinesses.filter(business => 
      business.category_name.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (location) {
    filteredBusinesses = filteredBusinesses.filter(business => 
      business.address.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  // Apply pagination
  const startIndex = parseInt(offset);
  const endIndex = startIndex + parseInt(limit);
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedBusinesses,
    count: paginatedBusinesses.length,
    total: filteredBusinesses.length
  });
});

app.get('/api/businesses/:id', (req, res) => {
  const { id } = req.params;
  const business = mockBusinesses.find(b => b.id === parseInt(id));
  
  if (!business) {
    return res.status(404).json({
      success: false,
      message: 'Business not found'
    });
  }
  
  res.json({
    success: true,
    data: business
  });
});

app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: mockCategories,
    count: mockCategories.length
  });
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running', status: 'OK' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
