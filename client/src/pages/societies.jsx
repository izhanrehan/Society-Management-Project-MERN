import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import http from '../lib/http';

const Societies = () => {
  const [societies, setSocieties] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [societiesRes, eventsRes] = await Promise.all([
          http.get('/societies'),
          http.get('/events'),
        ]);

        setSocieties(Array.isArray(societiesRes.data) ? societiesRes.data : []);
        setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching societies/events:', err);
        setError('Failed to load societies and events. Please try again later.');
        setSocieties([]);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRelatedEvents = (society) => {
    return events.filter((event) => {
      const eventSocietyId =
        event.society_id ||
        event.societyId ||
        event.society?._id ||
        event.society;

      return String(eventSocietyId) === String(society._id);
    });
  };

  const filteredSocieties = useMemo(() => {
    return societies.filter((society) => {
      const name = society?.name || '';
      const about = society?.about || society?.description || '';
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        about.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [societies, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Loading societies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white shadow-md rounded-2xl p-8 max-w-lg w-full text-center border border-red-100">
          <h2 className="text-2xl font-bold text-red-600 mb-3">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
      <nav className="bg-white/95 backdrop-blur shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-10 py-4 flex flex-col md:flex-row justify-between items-center fixed w-full z-20 top-0 gap-4">
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-extrabold text-blue-700 tracking-tight hover:text-blue-800"
        >
          SociNexus
        </Link>

        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-5">
          <Link
            to="/events"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
          >
            Events
          </Link>
          <Link
            to="/societies"
            className="text-blue-600 font-bold transition-colors duration-200 text-sm"
          >
            Societies
          </Link>
          <Link
            to="/registration-form"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 text-sm font-medium"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm font-medium"
          >
            Login
          </Link>
        </div>
      </nav>

      <main className="pt-32 md:pt-28 pb-14 px-4 sm:px-8 lg:px-16 xl:px-24">
        <div className="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-2">
              Explore Communities
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
              Student Societies & Their Events
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
              Discover active societies, learn what they do, and view the events they are organizing.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search societies by name or description..."
              className="w-full lg:w-[360px] p-3.5 text-sm border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredSocieties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
            {filteredSocieties.map((society) => {
              const relatedEvents = getRelatedEvents(society);

              return (
                <div
                  key={society._id}
                  className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden group"
                >
                  <div className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6 border-b border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={
                            society.logo ||
                            society.logoUrl ||
                            `https://via.placeholder.com/160x160?text=${(society.name || 'S').charAt(0).toUpperCase()}`
                          }
                          alt={`${society.name} Logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                          {society.name || 'Unnamed Society'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                          {society.about ||
                            society.description ||
                            'No description available for this society.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap gap-3 mb-5">
                      <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1">
                        Events: {relatedEvents.length}
                      </span>

                      <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1">
                        Members: {society.memberCount || society.members || 'N/A'}
                      </span>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
                        Recent / Related Events
                      </h3>

                      {relatedEvents.length > 0 ? (
                        <div className="space-y-3">
                          {relatedEvents.slice(0, 3).map((event) => (
                            <div
                              key={event._id}
                              className="border border-gray-200 rounded-2xl p-4 bg-gray-50"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                    {event.title || event.name || 'Untitled Event'}
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {event.description || 'No event description available.'}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-2">
                                {event.date && (
                                  <span className="text-[11px] bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600">
                                    {new Date(event.date).toLocaleDateString()}
                                  </span>
                                )}
                                {event.location && (
                                  <span className="text-[11px] bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-600">
                                    {event.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}

                          {relatedEvents.length > 3 && (
                            <p className="text-xs text-blue-600 font-medium">
                              +{relatedEvents.length - 3} more events
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="border border-dashed border-gray-300 rounded-2xl p-5 text-sm text-gray-500 bg-gray-50">
                          No related events found for this society yet.
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={`/society-detail/${society._id}`}
                        className="flex-1 inline-flex justify-center items-center bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        View Society
                      </Link>

                      <Link
                        to="/events"
                        className="inline-flex justify-center items-center px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-semibold"
                      >
                        All Events
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No societies found</h3>
            <p className="text-gray-600">
              Try searching with a different keyword.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Societies;