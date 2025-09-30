import React, { useState, useEffect } from 'react';
import { CraftsmanProfile, SearchFilters as SearchFiltersType } from '../../types';
import { craftsmanService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SearchFilters from './SearchFilters';
import CraftsmanCard from './CraftsmanCard';
import CraftsmanModal from './CraftsmanModal';
import BookingsView from './BookingsView';

const ClientDashboard: React.FC = () => {
  const [craftsmen, setCraftsmen] = useState<CraftsmanProfile[]>([]);
  const [filteredCraftsmen, setFilteredCraftsmen] = useState<CraftsmanProfile[]>([]);
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [selectedCraftsman, setSelectedCraftsman] = useState<CraftsmanProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'search' | 'bookings'>('search');
  const { user, logout } = useAuth();

  useEffect(() => {
    loadCraftsmen();
  }, []);

  useEffect(() => {
    searchCraftsmen();
  }, [filters]);

  const loadCraftsmen = async () => {
    try {
      const data = await craftsmanService.getAllCraftsmen();
      setCraftsmen(data);
      setFilteredCraftsmen(data);
    } catch (error) {
      console.error('Failed to load craftsmen:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCraftsmen = async () => {
    try {
      const data = await craftsmanService.searchCraftsmen(filters);
      setFilteredCraftsmen(data);
    } catch (error) {
      console.error('Failed to search craftsmen:', error);
    }
  };

  const handleRatingAdded = () => {
    loadCraftsmen();
  };

  if (loading) {
    return <div className="loading">Loading craftsmen...</div>;
  }

  return (
    <div className="client-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Find a Majstor</h1>
          <div className="user-info">
            <span>Welcome, {user?.email}</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Find Craftsmen
          </button>
          <button
            className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            My Bookings
          </button>
        </div>

        {activeTab === 'search' ? (
          <>
            <div className="filter-bar">
              <SearchFilters filters={filters} onFiltersChange={setFilters} />
            </div>

            <div className="craftsmen-section">
              <div className="results-header">
                <h2>Available Craftsmen</h2>
                <div className="results-count">
                  <span className="count-badge">{filteredCraftsmen.length}</span>
                  <span>craftsmen found</span>
                </div>
              </div>

              {filteredCraftsmen.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No craftsmen found</h3>
                  <p>Try adjusting your search criteria or clear all filters to see all available craftsmen.</p>
                  <button onClick={() => setFilters({})} className="clear-filters-btn">
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="craftsmen-grid">
                  {filteredCraftsmen.map((craftsman) => (
                    <CraftsmanCard
                      key={craftsman.id}
                      craftsman={craftsman}
                      onClick={setSelectedCraftsman}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bookings-tab">
            <BookingsView />
          </div>
        )}
      </div>

      {selectedCraftsman && (
        <CraftsmanModal
          craftsman={selectedCraftsman}
          onClose={() => setSelectedCraftsman(null)}
          onRatingAdded={handleRatingAdded}
        />
      )}
    </div>
  );
};

export default ClientDashboard;