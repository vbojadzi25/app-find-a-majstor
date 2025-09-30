import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus, UpdateBookingStatusRequest } from '../../types';
import { bookingService } from '../../services/api';

const BookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showStatusForm, setShowStatusForm] = useState<boolean>(false);
  const [statusForm, setStatusForm] = useState<UpdateBookingStatusRequest>({
    status: BookingStatus.Pending,
    notes: '',
    estimatedPrice: undefined,
  });

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const bookingsData = await bookingService.getMyCraftsmanBookings();
      setBookings(bookingsData);
    } catch (error) {
      setError('Failed to load bookings');
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (booking: Booking) => {
    setSelectedBooking(booking);
    setStatusForm({
      status: booking.status,
      notes: booking.notes || '',
      estimatedPrice: booking.estimatedPrice,
    });
    setShowStatusForm(true);
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      await bookingService.updateBookingStatus(selectedBooking.id, statusForm);
      await loadBookings();
      setShowStatusForm(false);
      setSelectedBooking(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setStatusForm({
      ...statusForm,
      [name]: name === 'estimatedPrice' ? (value ? parseFloat(value) : undefined) : value,
    });
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

  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(booking => new Date(booking.startTime) > now);
  };

  const getPastBookings = () => {
    const now = new Date();
    return bookings.filter(booking => new Date(booking.startTime) <= now);
  };

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  const upcomingBookings = getUpcomingBookings();
  const pastBookings = getPastBookings();

  return (
    <div className="booking-manager">
      <h2>Booking Management</h2>

      {error && <div className="error-message">{error}</div>}

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>No bookings yet.</p>
          <p>Clients will be able to book your available time slots.</p>
        </div>
      ) : (
        <div className="bookings-sections">
          <div className="upcoming-bookings">
            <h3>Upcoming Bookings ({upcomingBookings.length})</h3>
            {upcomingBookings.length === 0 ? (
              <p>No upcoming bookings.</p>
            ) : (
              <div className="bookings-list">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-header">
                      <h4>Booking #{booking.id}</h4>
                      <span className={`booking-status ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="booking-details">
                      <div className="detail-row">
                        <strong>Client:</strong> {booking.clientName}
                      </div>
                      <div className="detail-row">
                        <strong>Phone:</strong> {booking.clientPhone}
                      </div>
                      <div className="detail-row">
                        <strong>Email:</strong> {booking.clientEmail}
                      </div>
                      <div className="detail-row">
                        <strong>Appointment:</strong> {formatDateTime(booking.startTime)}
                      </div>
                      <div className="detail-row">
                        <strong>Service:</strong> {booking.serviceDescription}
                      </div>
                      {booking.notes && (
                        <div className="detail-row">
                          <strong>Notes:</strong> {booking.notes}
                        </div>
                      )}
                      {booking.estimatedPrice && (
                        <div className="detail-row">
                          <strong>Estimated Price:</strong> ${booking.estimatedPrice}
                        </div>
                      )}
                    </div>

                    <div className="booking-actions">
                      <button
                        className="update-status-button"
                        onClick={() => handleUpdateStatus(booking)}
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="past-bookings">
            <h3>Past Bookings ({pastBookings.length})</h3>
            {pastBookings.length === 0 ? (
              <p>No past bookings.</p>
            ) : (
              <div className="bookings-list">
                {pastBookings.map((booking) => (
                  <div key={booking.id} className="booking-card past">
                    <div className="booking-header">
                      <h4>Booking #{booking.id}</h4>
                      <span className={`booking-status ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="booking-details">
                      <div className="detail-row">
                        <strong>Client:</strong> {booking.clientName}
                      </div>
                      <div className="detail-row">
                        <strong>Appointment:</strong> {formatDateTime(booking.startTime)}
                      </div>
                      <div className="detail-row">
                        <strong>Service:</strong> {booking.serviceDescription}
                      </div>
                      {booking.estimatedPrice && (
                        <div className="detail-row">
                          <strong>Final Price:</strong> ${booking.estimatedPrice}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showStatusForm && selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Booking Status</h3>
              <button
                className="close-button"
                onClick={() => setShowStatusForm(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="booking-summary">
                <p><strong>Booking #{selectedBooking.id}</strong></p>
                <p><strong>Client:</strong> {selectedBooking.clientName}</p>
                <p><strong>Service:</strong> {selectedBooking.serviceDescription}</p>
                <p><strong>Time:</strong> {formatDateTime(selectedBooking.startTime)}</p>
              </div>

              <form onSubmit={handleStatusSubmit}>
                <div className="form-group">
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    name="status"
                    value={statusForm.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={BookingStatus.Pending}>Pending</option>
                    <option value={BookingStatus.Confirmed}>Confirmed</option>
                    <option value={BookingStatus.InProgress}>In Progress</option>
                    <option value={BookingStatus.Completed}>Completed</option>
                    <option value={BookingStatus.Rejected}>Rejected</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="estimatedPrice">Estimated/Final Price ($)</label>
                  <input
                    type="number"
                    id="estimatedPrice"
                    name="estimatedPrice"
                    value={statusForm.estimatedPrice || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    placeholder="Enter price..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={statusForm.notes}
                    onChange={handleInputChange}
                    placeholder="Add any notes for the client..."
                    rows={3}
                  />
                </div>

                <div className="form-buttons">
                  <button type="submit">Update Status</button>
                  <button type="button" onClick={() => setShowStatusForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManager;