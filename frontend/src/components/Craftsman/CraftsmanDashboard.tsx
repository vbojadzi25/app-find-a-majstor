import React, { useState, useEffect } from 'react';
import { CraftsmanProfile, CreateProfileRequest, Rating } from '../../types';
import { craftsmanService, ratingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProfileForm from './ProfileForm';
import TimeSlotManager from './TimeSlotManager';
import BookingManager from './BookingManager';

const CraftsmanDashboard: React.FC = () => {
  const [profile, setProfile] = useState<CraftsmanProfile | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'profile' | 'timeslots' | 'bookings'>('profile');
  const { user, logout } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await craftsmanService.getMyProfile();
      setProfile(profileData);
      if (profileData) {
        loadRatings(profileData.id);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setProfile(null);
      } else {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadRatings = async (craftsmanId: number) => {
    try {
      const ratingsData = await ratingService.getRatingsForCraftsman(craftsmanId);
      setRatings(ratingsData);
    } catch (error) {
      console.error('Failed to load ratings:', error);
    }
  };

  const handleCreateProfile = async (data: CreateProfileRequest) => {
    setFormLoading(true);
    setError('');

    try {
      const newProfile = await craftsmanService.createProfile(data);
      setProfile(newProfile);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create profile');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProfile = async (data: CreateProfileRequest) => {
    setFormLoading(true);
    setError('');

    try {
      const updatedProfile = await craftsmanService.updateProfile(data);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setFormLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="craftsman-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Craftsman Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.email}</span>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}

        {!profile ? (
          <div className="no-profile">
            <h2>Create Your Profile</h2>
            <p>You need to create a profile to start receiving clients.</p>
            <ProfileForm onSubmit={handleCreateProfile} loading={formLoading} />
          </div>
        ) : (
          <>
            <div className="dashboard-tabs">
              <button
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`tab-button ${activeTab === 'timeslots' ? 'active' : ''}`}
                onClick={() => setActiveTab('timeslots')}
              >
                Time Slots
              </button>
              <button
                className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                Bookings
              </button>
            </div>

            {activeTab === 'profile' && (
              <div className="profile-container">
            <div className="profile-header">
              <h2>Your Profile</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="edit-button"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <ProfileForm
                initialData={{
                  name: profile.name,
                  phone: profile.phone,
                  qualifications: profile.qualifications,
                  workingHours: profile.workingHours,
                  category: profile.category,
                  location: profile.location,
                }}
                onSubmit={handleUpdateProfile}
                loading={formLoading}
                isEdit={true}
              />
            ) : (
              <div className="profile-view">
                <div className="profile-details">
                  <div className="detail-row">
                    <strong>Name:</strong> {profile.name}
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong> {profile.email}
                  </div>
                  <div className="detail-row">
                    <strong>Phone:</strong> {profile.phone}
                  </div>
                  <div className="detail-row">
                    <strong>Category:</strong> {profile.category}
                  </div>
                  <div className="detail-row">
                    <strong>Location:</strong> {profile.location}
                  </div>
                  <div className="detail-row">
                    <strong>Working Hours:</strong> {profile.workingHours}
                  </div>
                  <div className="detail-row">
                    <strong>Qualifications:</strong> {profile.qualifications}
                  </div>
                  <div className="detail-row">
                    <strong>Average Rating:</strong>
                    <div className="rating-display">
                      <div className="stars">
                        {renderStars(profile.averageRating)}
                      </div>
                      <span>({profile.averageRating.toFixed(1)} - {ratings.length} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="reviews-section">
                  <h3>Customer Reviews</h3>
                  {ratings.length === 0 ? (
                    <p>No reviews yet.</p>
                  ) : (
                    <div className="reviews-list">
                      {ratings.map((rating) => (
                        <div key={rating.id} className="review-item">
                          <div className="review-header">
                            <div className="stars">{renderStars(rating.stars)}</div>
                            <span className="review-date">{formatDate(rating.createdAt)}</span>
                          </div>
                          <div className="review-author">{rating.clientEmail}</div>
                          {rating.comment && (
                            <div className="review-comment">{rating.comment}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>
            )}

            {activeTab === 'timeslots' && (
              <div className="timeslots-tab">
                <TimeSlotManager />
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bookings-tab">
                <BookingManager />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CraftsmanDashboard;