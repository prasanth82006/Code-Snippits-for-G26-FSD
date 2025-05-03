import React, { useState, useEffect } from 'react';
import './ProductList.css';

function ProductList({ products, addToCart, loading, error }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    gender: [],
    color: [],
    priceRange: {
      min: 0,
      max: 1000,
    },
    type: []
  });

  // Extract unique filter options
  const filterOptions = {
    gender: [...new Set(products.map(product => product.gender))],
    color: [...new Set(products.map(product => product.color))],
    type: [...new Set(products.map(product => product.type))]
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFiltersAndSearch();
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'priceRange') {
      setFilters({
        ...filters,
        priceRange: { ...filters.priceRange, ...value }
      });
    } else {
      const updatedFilters = filters[filterType].includes(value)
        ? filters[filterType].filter(item => item !== value)
        : [...filters[filterType], value];
      
      setFilters({
        ...filters,
        [filterType]: updatedFilters
      });
    }
  };

  // Apply filters and search
  const applyFiltersAndSearch = () => {
    let results = [...products];
    
    // Apply search
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchTermLower) ||
        product.color.toLowerCase().includes(searchTermLower) ||
        product.type.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Apply gender filter
    if (filters.gender.length > 0) {
      results = results.filter(product => filters.gender.includes(product.gender));
    }
    
    // Apply color filter
    if (filters.color.length > 0) {
      results = results.filter(product => filters.color.includes(product.color));
    }
    
    // Apply type filter
    if (filters.type.length > 0) {
      results = results.filter(product => filters.type.includes(product.type));
    }
    
    // Apply price range filter
    results = results.filter(product => 
      product.price >= filters.priceRange.min && 
      product.price <= filters.priceRange.max
    );
    
    setFilteredProducts(results);
  };

  // Apply filters whenever they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [filters, searchTerm, products]);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="product-page">
      <div className="sidebar">
        <div className="filter-section">
          <h3>Filters</h3>
          
          {/* Gender Filter */}
          <div className="filter-group">
            <h4>Gender</h4>
            {filterOptions.gender.map(gender => (
              <label key={gender} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.gender.includes(gender)}
                  onChange={() => handleFilterChange('gender', gender)}
                />
                {gender}
              </label>
            ))}
          </div>
          
          {/* Color Filter */}
          <div className="filter-group">
            <h4>Color</h4>
            {filterOptions.color.map(color => (
              <label key={color} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.color.includes(color)}
                  onChange={() => handleFilterChange('color', color)}
                />
                {color}
              </label>
            ))}
          </div>
          
          {/* Type Filter */}
          <div className="filter-group">
            <h4>Type</h4>
            {filterOptions.type.map(type => (
              <label key={type} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.type.includes(type)}
                  onChange={() => handleFilterChange('type', type)}
                />
                {type}
              </label>
            ))}
          </div>
          
          {/* Price Range Filter */}
          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                min="0"
                max={filters.priceRange.max}
                value={filters.priceRange.min}
                onChange={(e) => handleFilterChange('priceRange', { min: parseInt(e.target.value) || 0 })}
                placeholder="Min"
              />
              <span>to</span>
              <input
                type="number"
                min={filters.priceRange.min}
                value={filters.priceRange.max}
                onChange={(e) => handleFilterChange('priceRange', { max: parseInt(e.target.value) || 0 })}
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="main-content">
        {/* Search Section */}
        <div className="search-container">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <button type="submit" className="search-button-container">Search</button>
          </form>
        </div>

        {/* Product List */}
        <div className="product-list">
          {filteredProducts.length === 0 ? (
            <div className="no-products">No products found matching your criteria.</div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.imageURL} alt={product.name} className="product-image" />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">₹{product.price}</p>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;