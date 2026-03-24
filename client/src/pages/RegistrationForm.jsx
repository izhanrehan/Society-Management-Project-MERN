import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const eventIdFromUrl = queryParams.get('eventId') || '';

  const [formData, setFormData] = useState({
    name: '', // 👈 Changed from 'fullName' to 'name' to match backend schema!
    email: '',
    phone: '', // schema has whatsapp_number, you can rename this too if you want it to save in whatsapp_number
    address: '',
    event_id: eventIdFromUrl,
  });

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await axios.get(`${API_BASE_URL}/events`);
        setEvents(response.data || []);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (eventIdFromUrl) {
      setFormData((prev) => ({ ...prev, event_id: eventIdFromUrl }));
    }
  }, [eventIdFromUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    if (!formData.event_id) {
      setMessage('Error: Please select an event to register.');
      setIsError(true);
      setLoading(false);
      return;
    }

    try {
      // ✅ Sending matching keys to backend!
      await axios.post(`${API_BASE_URL}/registrations`, formData);
      setMessage('Registration successful!');
      setIsError(false);
      
      setFormData({ name: '', email: '', phone: '', address: '', event_id: '' });

      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (err) {
      setIsError(true);
      const errorMsg = err.response?.data?.error || 'Registration failed.';
      setMessage(`Registration failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-xl border border-gray-200">
        
        <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">
          Event Registration
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Fill out the form below to secure your spot.
        </p>

        {message && (
          <div className={`mb-4 p-3 rounded-md text-center text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="md:col-span-2">
            <label htmlFor="event_id" className="block text-xs font-bold text-gray-700 mb-1">Select Event</label>
            <select
              id="event_id"
              name="event_id"
              value={formData.event_id}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md text-sm bg-white"
              required
              disabled={loadingEvents}
            >
              <option value="">-- Choose an Event --</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name} 
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="name" // 👈 Name changed to match state
              name="name" // 👈 Name changed to match state
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-xs font-bold text-gray-700 mb-1">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="City, Area"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md w-full sm:w-auto text-sm disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;