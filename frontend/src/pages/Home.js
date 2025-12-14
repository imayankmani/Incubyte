import React, { useState, useEffect } from 'react';
import SweetCard from '../components/SweetCard';
import { getAllSweets, searchSweets } from '../services/api';
import './Home.css';

const Home = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  const categories = ['All', 'Chocolate', 'Candy', 'Gummy', 'Hard Candy', 'Lollipop', 'Other'];

  const fetchSweets = async () => {
    setLoading(true);
    try {
      const response = await getAllSweets();
      setSweets(response.data);
    } catch (error) {
      console.error('Error fetching sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchParams.name) params.name = searchParams.name;
      if (searchParams.category && searchParams.category !== 'All') {
        params.category = searchParams.category;
      }
      if (searchParams.minPrice) params.minPrice = searchParams.minPrice;
      if (searchParams.maxPrice) params.maxPrice = searchParams.maxPrice;

      const response = await searchSweets(params);
      setSweets(response.data);
    } catch (error) {
      console.error('Error searching sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
    fetchSweets();
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🍬 Welcome to Sweet Shop</h1>
        <p>Discover the sweetest treats in town!</p>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchParams.name}
            onChange={(e) => setSearchParams({...searchParams, name: e.target.value})}
          />
          
          <select
            value={searchParams.category}
            onChange={(e) => setSearchParams({...searchParams, category: e.target.value})}
          >
            {categories.map(cat => (
              <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={searchParams.minPrice}
            onChange={(e) => setSearchParams({...searchParams, minPrice: e.target.value})}
          />

          <input
            type="number"
            placeholder="Max Price"
            value={searchParams.maxPrice}
            onChange={(e) => setSearchParams({...searchParams, maxPrice: e.target.value})}
          />

          <button onClick={handleSearch} className="btn-search">Search</button>
          <button onClick={handleReset} className="btn-reset">Reset</button>
        </div>
      </div>

      <div className="sweets-container">
        {loading ? (
          <div className="loading">Loading delicious sweets...</div>
        ) : sweets.length === 0 ? (
          <div className="no-results">No sweets found. Try different search criteria!</div>
        ) : (
          <div className="sweets-grid">
            {sweets.map(sweet => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                onUpdate={fetchSweets}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;