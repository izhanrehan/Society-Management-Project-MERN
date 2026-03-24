import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import API_BASE_URL from '../../config/api';

const ManageEvents = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllEventsWithoutFilter = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(`${API_BASE_URL}/events`);
                setEvents(response.data || []);
            } catch (err) {
                console.error("Fetch failed:", err);
                setError(`Failed to load events. Backend says: ${err.message}`);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllEventsWithoutFilter();
    }, []);

    const filteredEvents = events.filter(event => 
        (event.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditEvent = (eventId) => {
        navigate(`/admin/add-edit-event/${eventId}`);
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event? This action is permanent.')) {
            try {
                setLoading(true);
                await axios.delete(`${API_BASE_URL}/events/${eventId}`);
                setEvents(prev => prev.filter(e => e._id !== eventId));
            } catch (err) {
                setError(err.response?.data?.message || 'Delete failed.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-0 md:ml-64 w-full bg-gray-50">
                <Header pageTitle="Manage Events" />
                <main className="p-4 md:p-8 min-h-[calc(100vh-64px)]">
                    
                    {/* Search and Action Header */}
                    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-6 gap-4 bg-white p-4 rounded-xl shadow-sm">
                        <input
                            type="text"
                            placeholder="Filter events by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-full px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                            onClick={() => navigate('/admin/add-edit-event')}
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-blue-700 transition w-full md:w-auto text-sm shadow-md"
                        >
                            + Add New Event
                        </button>
                    </div>

                    {loading && <p className="text-center text-gray-600 py-12">Retrieving system database events...</p>}
                    {error && <p className="text-center text-red-600 py-12">{error}</p>}
                    
                    {!loading && !error && (
                        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
                            <div className="w-full">
                                
                                {/* 💻 Desktop View (Hidden on mobile) */}
                                <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Event Information</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Schedule Data</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status Badge</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions Hub</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredEvents.length > 0 ? (
                                            filteredEvents.map(event => {
                                                const today = new Date().toISOString().split('T')[0];
                                                const date = event.date_time || event.date;
                                                const isUpcoming = date && date >= today;

                                                return (
                                                    <tr key={event._id} className="hover:bg-gray-50 transition">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{event.name}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                            <div>📅 {date ? new Date(date).toLocaleDateString() : 'N/A'}</div>
                                                            <div className="text-xs text-gray-400 mt-1">📍 {event.venue || event.location || 'N/A'}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${isUpcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                                {isUpcoming ? 'Upcoming' : 'Past'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3">
                                                            <button onClick={() => navigate(`/event-detail/${event._id}`)} className="text-blue-600 font-medium hover:underline">View</button>
                                                            <button onClick={() => handleEditEvent(event._id)} className="text-indigo-600 font-medium hover:underline">Edit</button>
                                                            <button onClick={() => handleDeleteEvent(event._id)} className="text-red-600 font-medium hover:underline">Delete</button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-6 text-center text-gray-500 text-sm">No events found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* 📱 Mobile View (Cards) */}
                                <div className="block md:hidden divide-y divide-gray-200">
                                    {filteredEvents.length > 0 ? (
                                        filteredEvents.map(event => {
                                            const today = new Date().toISOString().split('T')[0];
                                            const date = event.date_time || event.date;
                                            const isUpcoming = date && date >= today;

                                            return (
                                                <div key={event._id} className="p-4 bg-white flex flex-col space-y-3">
                                                    <div>
                                                        <span className="text-xs font-bold text-gray-400 uppercase">Event Name</span>
                                                        <h3 className="text-sm font-semibold text-gray-800">{event.name}</h3>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-400 uppercase">Schedule Data</span>
                                                            <div className="text-xs text-gray-700 mt-1">📅 {date ? new Date(date).toLocaleDateString() : 'N/A'}</div>
                                                            <div className="text-xs text-gray-500 truncate mt-0.5">📍 {event.venue || event.location || 'N/A'}</div>
                                                        </div>
                                                        
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-400 uppercase">Status</span>
                                                            <div className="mt-1">
                                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${isUpcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                                    {isUpcoming ? 'Upcoming' : 'Past'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                                                        <span className="text-xs font-bold text-gray-400 uppercase">Actions Hub</span>
                                                        <div className="flex space-x-4">
                                                            <button onClick={() => navigate(`/event-detail/${event._id}`)} className="text-blue-600 text-sm font-medium">View</button>
                                                            <button onClick={() => handleEditEvent(event._id)} className="text-indigo-600 text-sm font-medium">Edit</button>
                                                            <button onClick={() => handleDeleteEvent(event._id)} className="text-red-600 text-sm font-medium">Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="p-6 text-center text-sm text-gray-500">No events found.</div>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}
                </main> 
            </div>
        </div>
    );
};

export default ManageEvents;