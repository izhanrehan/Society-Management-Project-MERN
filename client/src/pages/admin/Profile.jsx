import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import API_BASE_URL from '../../config/api';

const Profile = () => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllEventsPull = async () => {
      setLoadingEvents(true);
      setError('');

      try {
        const response = await axios.get(`${API_BASE_URL}/events`);
        setEvents(response.data || []);
      } catch (err) {
        console.error('Events fetch failed:', err);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchAllEventsPull();
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const upcomingEvents = useMemo(() => {
    return events.filter((e) => {
      const eventDate = e.date_time || e.date;
      const name = e.name || e.title || '';
      const venue = e.venue || e.location || '';
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        matchesSearch &&
        ((e.status === 'upcoming' || e.status === 'active') ||
          (eventDate && eventDate >= today))
      );
    });
  }, [events, searchTerm, today]);

  const pastEvents = useMemo(() => {
    return events.filter((e) => {
      const eventDate = e.date_time || e.date;
      const name = e.name || e.title || '';
      const venue = e.venue || e.location || '';
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        matchesSearch &&
        ((e.status === 'ended' || e.status === 'completed') ||
          (eventDate && eventDate < today))
      );
    });
  }, [events, searchTerm, today]);

  const totalEvents = events.length;
  const totalUpcoming = upcomingEvents.length;
  const totalPast = pastEvents.length;

  const renderEventCard = (event, isPast = false) => {
    const imageSrc =
      event.image ||
      event.imageUrl ||
      event.banner_image ||
      'https://via.placeholder.com/600x300?text=Event+Image';

    const venue = event.venue || event.location || 'Location TBA';
    const dt = event.date_time || event.date;
    const eventName = event.name || event.title || 'Untitled Event';

    return (
      <Link
        to={`/event-detail/${event._id}`}
        key={event._id}
        className="group block bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      >
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src={imageSrc}
            alt={eventName}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isPast ? 'grayscale group-hover:grayscale-0' : ''
            }`}
          />
          <div className="absolute top-3 left-3">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${
                isPast
                  ? 'bg-gray-900/70 text-white'
                  : 'bg-blue-600/90 text-white'
              }`}
            >
              {isPast ? 'Past Event' : 'Upcoming'}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-700 transition-colors">
            {eventName}
          </h4>

          <div className="space-y-2 text-sm text-gray-600">
            <p className="truncate">
              <span className="font-medium text-gray-800">Venue:</span> {venue}
            </p>
            <p>
              <span className="font-medium text-gray-800">Date:</span>{' '}
              {dt ? new Date(dt).toLocaleDateString() : 'TBA'}
            </p>
          </div>

          <div className="mt-4">
            <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
              {isPast ? 'View History' : 'View Details'}
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex bg-gray-100 min-h-screen font-sans antialiased">
      <Sidebar />

      <div className="flex-1 ml-0 md:ml-64 w-full bg-gray-50">
        <Header pageTitle="Society Profile" />

        <main className="p-4 md:p-8 min-h-[calc(100vh-64px)]">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 mb-8 text-white">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_white,_transparent_35%),radial-gradient(circle_at_bottom_right,_white,_transparent_30%)]" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-3xl">
                <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-3xl font-extrabold shadow-lg mb-5">
                  S
                </div>

                <p className="uppercase tracking-[0.2em] text-xs sm:text-sm text-blue-100 font-semibold mb-3">
                  Society Overview
                </p>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                  Society Profile & Event Management
                </h1>

                <p className="text-sm sm:text-base text-blue-50 max-w-2xl leading-relaxed">
                  Manage your society presence in a more organized way. Review
                  upcoming and past events, search records quickly, and keep
                  your admin workspace clean and professional.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 sm:p-6 w-full lg:max-w-sm">
                <p className="text-sm text-blue-100 mb-2 font-medium">
                  Quick Search
                </p>
                <input
                  type="text"
                  placeholder="Search events by name or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-blue-100/80 focus:outline-none focus:ring-2 focus:ring-white/40"
                />
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Total Events
              </p>
              <h3 className="text-3xl font-extrabold text-gray-900">
                {totalEvents}
              </h3>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Upcoming Events
              </p>
              <h3 className="text-3xl font-extrabold text-blue-600">
                {totalUpcoming}
              </h3>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <p className="text-sm font-medium text-gray-500 mb-2">
                Past Events
              </p>
              <h3 className="text-3xl font-extrabold text-purple-600">
                {totalPast}
              </h3>
            </div>
          </section>

          {/* Events Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-2">
                  Event Portfolio
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Organized Society Events
                </h2>
              </div>
            </div>

            {loadingEvents ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 text-base">
                  Retrieving events from database...
                </p>
              </div>
            ) : error ? (
              <div className="py-12 text-center bg-red-50 rounded-2xl border border-red-100">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            ) : (
              <>
                {/* Upcoming */}
                <div className="mb-12">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      Upcoming Events
                    </h3>
                    <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {totalUpcoming} items
                    </span>
                  </div>

                  {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {upcomingEvents.map((event) => renderEventCard(event, false))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                      <p className="text-gray-500">
                        No upcoming events found.
                      </p>
                    </div>
                  )}
                </div>

                {/* Past */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      Past Events
                    </h3>
                    <span className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                      {totalPast} items
                    </span>
                  </div>

                  {pastEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {pastEvents.map((event) => renderEventCard(event, true))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                      <p className="text-gray-500">
                        No past event history found.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;