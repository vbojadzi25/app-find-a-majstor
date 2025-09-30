import React, { useState, useEffect } from 'react';
import { CraftsmanProfile, TimeSlot, CreateBookingRequest } from '../../types';
import { timeSlotService, bookingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface BookingModalProps {
  craftsman: CraftsmanProfile;
  onClose: () => void;
  onBookingCreated: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  craftsman,
  onClose,
  onBookingCreated,
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [bookingForm, setBookingForm] = useState<CreateBookingRequest>({
    timeSlotId: 0,
    serviceDescription: '',
    clientName: '',
    clientPhone: '',
    notes: '',
  });

  const { user } = useAuth();

  useEffect(() => {
    loadAvailableTimeSlots();
  }, [craftsman.id]);

  const loadAvailableTimeSlots = async () => {
    setLoading(true);
    setError('');
    try {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Next 30 days
      const slots = await timeSlotService.getAvailableTimeSlots(craftsman.id, startDate, endDate);
      setTimeSlots(slots);
    } catch (error) {
      setError('Failed to load available time slots');
      console.error('Failed to load time slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setBookingForm({
      ...bookingForm,
      timeSlotId: timeSlot.id,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedTimeSlot) {
      setError('Please select a time slot');
      return;
    }

    if (!bookingForm.clientName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!bookingForm.clientPhone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!bookingForm.serviceDescription.trim()) {
      setError('Please describe the service you need');
      return;
    }

    setSubmitting(true);

    try {
      await bookingService.createBooking(craftsman.id, bookingForm);
      onBookingCreated();
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const groupTimeSlotsByDate = (slots: TimeSlot[]) => {
    const grouped: { [key: string]: TimeSlot[] } = {};

    slots.forEach(slot => {
      const date = new Date(slot.startTime).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });

    return grouped;
  };

  const groupedTimeSlots = groupTimeSlotsByDate(timeSlots);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book {craftsman.name}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="craftsman-summary">
            <h3>{craftsman.name}</h3>
            <p><strong>Category:</strong> {craftsman.category}</p>
            <p><strong>Location:</strong> {craftsman.location}</p>
            <p><strong>Phone:</strong> {craftsman.phone}</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="time-slots-section">
              <h3>Available Time Slots</h3>

              {loading ? (
                <div className="loading">Loading available times...</div>
              ) : timeSlots.length === 0 ? (
                <div className="no-slots">
                  <p>No available time slots in the next 30 days.</p>
                </div>
              ) : (
                <div className="time-slots-list">
                  {Object.entries(groupedTimeSlots).map(([date, slots]) => (
                    <div key={date} className="date-group">
                      <h4 className="date-header">{new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</h4>
                      <div className="time-slots-grid">
                        {slots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            className={`time-slot-button ${selectedTimeSlot?.id === slot.id ? 'selected' : ''}`}
                            onClick={() => handleTimeSlotSelect(slot)}
                          >
                            <div className="time-range">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </div>
                            {slot.description && (
                              <div className="slot-description">{slot.description}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedTimeSlot && (
              <div className="booking-details">
                <h3>Booking Details</h3>

                <div className="selected-slot">
                  <p><strong>Selected Time:</strong> {formatDateTime(selectedTimeSlot.startTime)} - {formatTime(selectedTimeSlot.endTime)}</p>
                </div>

                <div className="form-group">
                  <label htmlFor="clientName">Your Name *</label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={bookingForm.clientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="clientPhone">Your Phone Number *</label>
                  <input
                    type="tel"
                    id="clientPhone"
                    name="clientPhone"
                    value={bookingForm.clientPhone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="serviceDescription">Service Description *</label>
                  <textarea
                    id="serviceDescription"
                    name="serviceDescription"
                    value={bookingForm.serviceDescription}
                    onChange={handleInputChange}
                    placeholder="Describe what service you need..."
                    rows={3}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Additional Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={bookingForm.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional information..."
                    rows={2}
                  />
                </div>

                <div className="form-buttons">
                  <button type="submit" disabled={submitting} className="submit-button">
                    {submitting ? 'Creating Booking...' : 'Book Appointment'}
                  </button>
                  <button type="button" onClick={onClose} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;