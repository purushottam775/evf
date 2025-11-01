import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { showSuccess, showError } from '../../utils/toast';
import { FaCalendar, FaClock, FaChargingStation, FaMapMarkerAlt } from 'react-icons/fa';

const UpdateBookingModal = ({ booking, onClose, onUpdate }) => {
  const [stations, setStations] = useState([]);
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    slot_id: '',
    station_id: '',
    booking_date: '',
    start_time: '',
    end_time: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({
        slot_id: booking.slot_id.toString(),
        station_id: booking.station_id.toString(),
        booking_date: booking.booking_date.split('T')[0],
        start_time: booking.start_time,
        end_time: booking.end_time
      });
      fetchStations();
      fetchSlotsForStation(booking.station_id);
    }
  }, [booking]);

  const fetchStations = async () => {
    try {
      const response = await api.get('/stations');
      setStations(response.data.stations);
    } catch (error) {
      console.error('Failed to fetch stations:', error);
      showError('Failed to load stations. Please try again.');
    }
  };

  const fetchSlotsForStation = async (stationId) => {
    if (!stationId) return;
    setFetchingSlots(true);
    try {
      const response = await api.get(`/slots/station/${stationId}`);
      setSlots(response.data.slots);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      showError('Failed to load slots. Please try again.');
    }
    setFetchingSlots(false);
  };

  const handleStationChange = (e) => {
    const newStationId = e.target.value;
    setFormData({
      ...formData,
      station_id: newStationId,
      slot_id: '' // Reset slot when station changes
    });
    if (newStationId) {
      fetchSlotsForStation(newStationId);
    } else {
      setSlots([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/bookings/user/${booking.booking_id}`, {
        slot_id: formData.slot_id,
        station_id: formData.station_id,
        booking_date: formData.booking_date,
        start_time: formData.start_time,
        end_time: formData.end_time
      });
      
      showSuccess('Booking updated successfully!');
      if (onUpdate) onUpdate();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update booking. Please try again.');
    }
    
    setLoading(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const selectedStation = stations.find(s => s.station_id.toString() === formData.station_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaChargingStation className="mr-2 text-green-600" />
              Update Booking
            </h2>
            <p className="text-sm text-gray-600 mt-1">Modify your booking details</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-light transition transform hover:rotate-90 duration-300"
          >
            ×
          </button>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select Station */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-green-600" />
              Select Station
            </label>
            <select
              required
              value={formData.station_id}
              onChange={handleStationChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition hover:border-green-300"
            >
              <option value="">Choose a station...</option>
              {stations.map((station) => (
                <option key={station.station_id} value={station.station_id}>
                  {station.station_name} - {station.location}
                </option>
              ))}
            </select>
          </div>

          {/* Select Slot */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaChargingStation className="mr-2 text-green-600" />
              Select Charging Slot
            </label>
            <select
              required
              value={formData.slot_id}
              onChange={(e) => setFormData({ ...formData, slot_id: e.target.value })}
              disabled={!formData.station_id || fetchingSlots}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition hover:border-green-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {fetchingSlots ? 'Loading slots...' : !formData.station_id ? 'Select a station first' : 'Choose your slot...'}
              </option>
              {slots.filter(s => s.slot_status === 'available').map((slot) => (
                <option key={slot.slot_id} value={slot.slot_id}>
                  🔌 Slot {slot.slot_number} - {slot.slot_status}
                </option>
              ))}
            </select>
          </div>

          {/* Booking Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaCalendar className="mr-2 text-green-600" />
              Booking Date
            </label>
            <input
              type="date"
              required
              min={getTodayDate()}
              value={formData.booking_date}
              onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition hover:border-green-300"
            />
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <FaClock className="mr-2 text-green-600" />
                Start Time
              </label>
              <input
                type="time"
                required
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition hover:border-green-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <FaClock className="mr-2 text-green-600" />
                End Time
              </label>
              <input
                type="time"
                required
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition hover:border-green-300"
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 flex items-start">
              <span className="mr-2 text-lg">ℹ️</span>
              <span>
                <strong>Note:</strong> Only pending bookings can be updated. 
                Your updated booking request will be reviewed by the admin. ⚡
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition duration-300 shadow-lg hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </span>
              ) : (
                '💾 Update Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBookingModal;

