import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import API_BASE_URL from '../../config/api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/events`);
        setEvents(res.data || []);
      } catch (err) {
        setError('Failed to fetch events. Ensure backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Compute analytics dynamically
  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = events.filter(e => {
    const eventDate = e.date_time || e.date;
    return (e.status === 'upcoming' || e.status === 'active') || (eventDate && eventDate >= today);
  });
  const pastEventsCount = events.length - upcomingEvents.length;

  return (
    <div className="flex w-full overflow-x-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64 w-full max-w-full transition-all duration-300">
        <Header pageTitle="Dashboard Overview" />
        <main className="p-4 md:p-8 min-h-[calc(100vh-64px)] w-full">

          {/* 📊 Metrics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center h-32 hover:shadow-md transition">
              <span className="text-sm font-medium text-gray-500">Total System Events</span>
              <span className="text-3xl font-extrabold text-gray-900 mt-2">{events.length}</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center h-32 hover:shadow-md transition">
              <span className="text-sm font-medium text-gray-500">Upcoming Events Tracked</span>
              <span className="text-3xl font-extrabold text-blue-600 mt-2">{upcomingEvents.length}</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center h-32 hover:shadow-md transition">
              <span className="text-sm font-medium text-gray-500">Archived/Past Events</span>
              <span className="text-3xl font-extrabold text-purple-600 mt-2">{pastEventsCount}</span>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl overflow-hidden shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="p-6 md:p-12">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                  Discover Events <br className="hidden md:block" /> At a Glance.
                </h1>
                <p className="text-base md:text-lg text-blue-100 mb-6">
                  Stay informed and engaged with system tracking metrics.
                </p>
                <button 
                  onClick={() => document.getElementById('eventsList').scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-blue-700 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-md w-full sm:w-auto text-center"
                >
                  Explore Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Events List */}
          <div id="eventsList" className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-8 border border-gray-200">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Upcoming Scheduled Timeline</h3>
            {loading ? (
              <div className="text-center text-gray-600 py-12">Loading events from system...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-12">{error}</div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {upcomingEvents.slice(0, 8).map(event => {
                  const eventImage = event.image || event.imageUrl || event.banner_image || 'https://via.placeholder.com/300x180?text=Event+Image';
                  const eventDate = event.date_time || event.date;

                  return (
                    <div
                      key={event._id}
                      className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all h-full flex flex-col"
                    >
                      <div className="h-40 overflow-hidden bg-gray-200">
                        <img
                          src={eventImage}
                          alt={event.name}
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=Broken+Image'; }}
                        />
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="text-md font-bold text-gray-900 mb-1 truncate">{event.name}</h4>
                          <p className="text-xs text-gray-600 mb-1 truncate">🗓️ Date: {eventDate ? new Date(eventDate).toLocaleDateString() : 'TBA'}</p>
                          <p className="text-xs text-gray-500 truncate">📍 Venue: {event.venue || event.location || 'Location TBA'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-12">No upcoming events found. Create one in Manage Events!</div>
            )}
          </div>
        </main> 
      </div>
    </div>
  );
};

export default Dashboard;