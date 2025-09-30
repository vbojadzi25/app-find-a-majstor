import React from 'react';
import { CraftsmanProfile } from '../../types';

interface CraftsmanCardProps {
  craftsman: CraftsmanProfile;
  onClick: (craftsman: CraftsmanProfile) => void;
}

const CraftsmanCard: React.FC<CraftsmanCardProps> = ({ craftsman, onClick }) => {
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

  return (
    <div className="craftsman-card" onClick={() => onClick(craftsman)}>
      <div className="craftsman-header">
        <h3>{craftsman.name}</h3>
        <div className="rating-container">
          <div className="stars">
            {renderStars(craftsman.averageRating)}
          </div>
          <span className="rating-text">
            ({craftsman.averageRating.toFixed(1)} - {craftsman.ratings.length} reviews)
          </span>
        </div>
      </div>

      <div className="craftsman-info">
        <p><strong>Category:</strong> {craftsman.category}</p>
        <p><strong>Location:</strong> {craftsman.location}</p>
        <p><strong>Working Hours:</strong> {craftsman.workingHours}</p>
        <p><strong>Phone:</strong> {craftsman.phone}</p>
      </div>

      <div className="craftsman-qualifications">
        <p><strong>Qualifications:</strong> {craftsman.qualifications}</p>
      </div>
    </div>
  );
};

export default CraftsmanCard;