import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../../types';
import { bookingService } from '../../services/api';

const BookingsView: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const bookingsData = await bookingService.getMyClientBookings();
      setBookings(bookingsData);
    } catch (error) {
      setError('Failed to load bookings');
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      await loadBookings(); // Reload bookings
    } catch (error) {
      setError('Failed to cancel booking');
      console.error('Failed to cancel booking:', error);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.Pending:
        return 'status-pending';
      case BookingStatus.Confirmed:
        return 'status-confirmed';
      case BookingStatus.InProgress:
        return 'status-in-progress';
      case BookingStatus.Completed:
        return 'status-completed';
      case BookingStatus.Cancelled:
        return 'status-cancelled';
      case BookingStatus.Rejected:
        return 'status-rejected';
      default:
        return 'status-default';
    }
  };

  const canCancelBooking = (booking: Booking) => {
    return booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed;
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div className="bookings-view">
      <h2>My Bookings</h2>

      {error && <div className="error-message">{error}</div>}

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You don't have any bookings yet.</p>
          <p>Browse craftsmen to book your first appointment!</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>Booking #{booking.id}</h3>
                <span className={`booking-status ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <div className="booking-time">
                  <strong>Appointment:</strong> {formatDateTime(booking.startTime)}
                </div>

                <div className="booking-service">
                  <strong>Service:</strong> {booking.serviceDescription}
                </div>

                <div className="booking-craftsman">
                  <strong>Craftsman:</strong> Contact directly at {booking.clientPhone}
                </div>

                {booking.notes && (
                  <div className="booking-notes">
                    <strong>Notes:</strong> {booking.notes}
                  </div>
                )}

                {booking.estimatedPrice && (
                  <div className="booking-price">
                    <strong>Estimated Price:</strong> ${booking.estimatedPrice}
                  </div>
                )}

                <div className="booking-created">
                  <strong>Booked on:</strong> {formatDateTime(booking.createdAt)}
                </div>
              </div>

              <div className="booking-actions">
                {canCancelBooking(booking) && (
                  <button
                    className="cancel-booking-button"
                    onClick={() => handleCancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsView;