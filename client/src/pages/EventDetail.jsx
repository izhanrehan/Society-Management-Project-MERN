import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/events/${id}`);
                setEvent(response.data);
            } catch (err) {
                console.error('Error fetching event details:', err);
                setError('Failed to load event details. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchEventDetail();
    }, [id]);

    if (loading) {
        return <div className="text-center py-20 text-lg font-medium text-gray-700">Loading event details...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-600 font-medium">{error}</div>;
    }

    if (!event) {
        return <div className="text-center py-20 text-gray-700">Event not found.</div>;
    }

    const imageToShow = event.imageUrl || event.image || event.banner_image || 'https://via.placeholder.com/800x400?text=Event+Image';

    return (
        <div className="min-h-screen bg-gray-100 font-sans antialiased pt-20 sm:pt-24 pb-12">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 bg-white shadow-lg rounded-xl max-w-4xl py-6 md:py-10">
                
                <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center md:text-left">{event.name}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-blue-50 p-5 rounded-xl">
                    <div className="space-y-3">
                        <p className="text-sm md:text-base text-gray-700">
                            <span className="font-bold text-gray-900">Organized by:</span> <br className="sm:hidden" /> {event.organizer?.name || 'N/A'}
                        </p>
                        <p className="text-sm md:text-base text-gray-700">
                            <span className="font-bold text-gray-900">Location:</span> <br className="sm:hidden" /> {event.location || event.venue || 'Online'}
                        </p>
                    </div>
                    <div className="space-y-3">
                        <p className="text-sm md:text-base text-gray-700">
                            <span className="font-bold text-gray-900">Date:</span> <br className="sm:hidden" /> {event.date_time ? new Date(event.date_time).toLocaleDateString() : (event.date ? new Date(event.date).toLocaleDateString() : 'TBA')}
                        </p>
                    </div>
                </div>

                <div className="w-full h-48 sm:h-72 md:h-96 overflow-hidden rounded-xl mb-8 shadow-md bg-gray-200">
                    <img
                        src={imageToShow}
                        alt={event.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=Image+Load+Failed'; }}
                    />
                </div>

                <div className="bg-gray-50 p-5 md:p-8 rounded-xl mb-8">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">About Event</h3>
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line text-sm md:text-base">
                        {event.description || 'No description available.'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link
                        to={`/registration-form?eventId=${event._id}&eventName=${encodeURIComponent(event.name)}`}
                        className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold text-base md:text-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg transform hover:scale-105 w-full sm:w-auto text-center"
                    >
                        Register for this Event
                    </Link>
                    <Link
                        to="/events"
                        className="bg-gray-200 text-gray-700 px-8 py-3.5 rounded-full font-bold text-base md:text-lg hover:bg-gray-300 transition-colors duration-300 w-full sm:w-auto text-center"
                    >
                        Go Back
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;