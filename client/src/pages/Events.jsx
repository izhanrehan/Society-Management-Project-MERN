import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import http from '../lib/http';

const Events = () => {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const filter = queryParams.get('filter');

    if (filter === 'ended') setActiveTab('ended');
    else setActiveTab('upcoming');

    setSearchTerm('');
  }, [location.search]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      let endpoint = activeTab === 'upcoming' ? '/events/filter/upcoming' : '/events/filter/ended';

      try {
        const response = await http.get(endpoint);
        setEvents(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Please check network.';
        setError(`Failed to load ${activeTab} events. ${errorMessage}`);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [activeTab]);

  const filteredEvents = useMemo(() => {
    if (!searchTerm) return events;
    const lower = searchTerm.toLowerCase();

    return events.filter((event) => {
      const nameMatches = (event.name || '').toLowerCase().includes(lower);
      const organizerName = typeof event.organizer === 'object' ? (event.organizer?.name || '') : '';
      const organizerMatches = organizerName.toLowerCase().includes(lower);
      const venueOrLocation = (event.venue || event.location || '');
      const locationMatches = venueOrLocation.toLowerCase().includes(lower);

      return nameMatches || organizerMatches || locationMatches;
    });
  }, [events, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased pt-20 pb-12">
      <section className="px-4 sm:px-8 md:px-12 lg:px-24">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-8">All Events</h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex space-x-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 px-5 py-2.5 rounded-full font-bold transition-all duration-300 text-sm md:text-base ${
                activeTab === 'upcoming' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('ended')}
              className={`flex-1 px-5 py-2.5 rounded-full font-bold transition-all duration-300 text-sm md:text-base ${
                activeTab === 'ended' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Past
            </button>
          </div>

          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by name, venue..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-700 text-lg">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => {
              const image = event.banner_image || event.imageUrl || 'https://via.placeholder.com/400x200?text=Event+Image';
              const venue = event.venue || event.location || 'Location TBA';
              const dt = event.date_time || event.date;

              return (
                <Link
                  to={`/event-detail/${event._id}`}
                  key={event._id}
                  className="block bg-white rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden group h-full"
                >
                  <div className="h-40 w-full overflow-hidden">
                    <img src={image} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-5 flex flex-col justify-between h-[calc(100%-10rem)]">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-blue-700 transition-colors duration-200">
                        {event.name}
                      </h3>
                      <p className="text-gray-700 text-xs mb-1 truncate">📍 {venue}</p>
                      <p className="text-gray-600 text-xs">🗓️ {dt ? new Date(dt).toLocaleDateString() : 'Date TBA'}</p>
                    </div>
                    <button className="mt-4 flex items-center text-blue-600 hover:text-blue-800 font-semibold text-xs">
                      Details <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg py-12">No events match your criteria.</p>
        )}
      </section>
    </div>
  );
};

export default Events;