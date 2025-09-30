import React, { useState, useEffect } from 'react';
import { CraftsmanProfile, AddRatingRequest, Rating } from '../../types';
import { ratingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BookingModal from './BookingModal';

interface CraftsmanModalProps {
  craftsman: CraftsmanProfile;
  onClose: () => void;
  onRatingAdded: () => void;
}

const CraftsmanModal: React.FC<CraftsmanModalProps> = ({
  craftsman,
  onClose,
  onRatingAdded,
}) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [myRating, setMyRating] = useState<Rating | null>(null);
  const [showRatingForm, setShowRatingForm] = useState<boolean>(false);
  const [ratingForm, setRatingForm] = useState<AddRatingRequest>({
    stars: 5,
    comment: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const { isClient } = useAuth();

  useEffect(() => {
    loadRatings();
    if (isClient) {
      loadMyRating();
    }
  }, [craftsman.id, isClient]);

  const loadRatings = async () => {
    try {
      const ratingsData = await ratingService.getRatingsForCraftsman(craftsman.id);
      setRatings(ratingsData);
    } catch (error) {
      console.error('Failed to load ratings:', error);
    }
  };

  const loadMyRating = async () => {
    try {
      const rating = await ratingService.getMyRatingForCraftsman(craftsman.id);
      setMyRating(rating);
      setRatingForm({ stars: rating.stars, comment: rating.comment });
    } catch (error) {
      setMyRating(null);
    }
  };

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await ratingService.addRating(craftsman.id, ratingForm);
      await loadRatings();
      await loadMyRating();
      setShowRatingForm(false);
      onRatingAdded();
    } catch (error) {
      console.error('Failed to add rating:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= rating ? 'full' : 'empty'}`}
        >
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{craftsman.name}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="craftsman-details">
            <div className="detail-row">
              <strong>Category:</strong> {craftsman.category}
            </div>
            <div className="detail-row">
              <strong>Location:</strong> {craftsman.location}
            </div>
            <div className="detail-row">
              <strong>Phone:</strong> {craftsman.phone}
            </div>
            <div className="detail-row">
              <strong>Email:</strong> {craftsman.email}
            </div>
            <div className="detail-row">
              <strong>Working Hours:</strong> {craftsman.workingHours}
            </div>
            <div className="detail-row">
              <strong>Qualifications:</strong> {craftsman.qualifications}
            </div>
            <div className="detail-row">
              <strong>Average Rating:</strong>
              <div className="stars">
                {renderStars(craftsman.averageRating)}
              </div>
              <span>({craftsman.averageRating.toFixed(1)} - {ratings.length} reviews)</span>
            </div>
          </div>

          {isClient && (
            <>
              <div className="booking-section">
                <button
                  className="book-button"
                  onClick={() => setShowBookingModal(true)}
                >
                  Book Appointment
                </button>
              </div>

              <div className="rating-section">
                <h3>Your Rating</h3>
              {myRating ? (
                <div className="my-rating">
                  <div className="stars">{renderStars(myRating.stars)}</div>
                  <p>{myRating.comment}</p>
                  <button
                    className="edit-rating-button"
                    onClick={() => setShowRatingForm(true)}
                  >
                    Edit Rating
                  </button>
                </div>
              ) : (
                <button
                  className="add-rating-button"
                  onClick={() => setShowRatingForm(true)}
                >
                  Add Rating
                </button>
              )}

              {showRatingForm && (
                <form className="rating-form" onSubmit={handleRatingSubmit}>
                  <div className="form-group">
                    <label>Stars:</label>
                    <select
                      value={ratingForm.stars}
                      onChange={(e) =>
                        setRatingForm({ ...ratingForm, stars: parseInt(e.target.value) })
                      }
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <option key={star} value={star}>
                          {star} Star{star !== 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Comment:</label>
                    <textarea
                      value={ratingForm.comment}
                      onChange={(e) =>
                        setRatingForm({ ...ratingForm, comment: e.target.value })
                      }
                      placeholder="Write your review..."
                      rows={3}
                    />
                  </div>
                  <div className="form-buttons">
                    <button type="submit" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit Rating'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRatingForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
            </>
          )}

          <div className="reviews-section">
            <h3>Reviews</h3>
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
                    <div className="review-comment">{rating.comment}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showBookingModal && (
        <BookingModal
          craftsman={craftsman}
          onClose={() => setShowBookingModal(false)}
          onBookingCreated={() => {
            setShowBookingModal(false);
            // Could add a success message here
          }}
        />
      )}
    </div>
  );
};

export default CraftsmanModal;