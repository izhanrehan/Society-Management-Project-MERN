import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import API_BASE_URL from "../../config/api";

const TrackAttendees = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [registrationsRes, eventsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/registrations`),
          axios.get(`${API_BASE_URL}/events`),
        ]);

        setRegistrations(registrationsRes.data || []);
        setEvents(eventsRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAttendanceToggle = async (attendeeId, currentStatus) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/registrations/mark-attendance/${attendeeId}`,
        { attended: !currentStatus }
      );

      setRegistrations((prev) =>
        prev.map((reg) =>
          reg._id === attendeeId ? { ...reg, attended: !currentStatus } : reg
        )
      );
    } catch (err) {
      console.error("Error updating attendance:", err);
      alert("Failed to update attendance.");
    }
  };

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const regEventId =
        typeof reg.event_id === "object" ? reg.event_id?._id : reg.event_id;

      const matchesEvent =
        selectedEvent === "all" || String(regEventId) === String(selectedEvent);

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "attended" && reg.attended) ||
        (selectedStatus === "not_attended" && !reg.attended);

      const matchesSearch =
        reg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesEvent && matchesStatus && matchesSearch;
    });
  }, [registrations, selectedEvent, selectedStatus, searchTerm]);

  const getEventName = (eventId) => {
    const id = typeof eventId === "object" ? eventId?._id : eventId;
    const event = events.find((e) => String(e._id) === String(id));
    return event ? event.title || event.name : "Unknown Event";
  };

  return (
    <div className="flex w-full overflow-x-hidden bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-0 md:ml-64 w-full max-w-full transition-all duration-300">
        <Header pageTitle="Society Name - Track Attendees" />

        <main className="p-4 md:p-8 min-h-[calc(100vh-64px)] w-full">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="border rounded-lg px-4 py-3 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Events</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title || event.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border rounded-lg px-4 py-3 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="attended">Attended</option>
                <option value="not_attended">Not Attended</option>
              </select>

              <input
                type="text"
                placeholder="Search by Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-lg px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {loading ? (
              <div className="text-center text-gray-600 py-12">
                Loading attendees...
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">{error}</div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="text-center text-gray-600 py-12">
                No attendees found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3 border-b">Name</th>
                      <th className="text-left p-3 border-b">Email</th>
                      <th className="text-left p-3 border-b">Event</th>
                      <th className="text-left p-3 border-b">Attendance</th>
                      <th className="text-left p-3 border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg._id} className="border-b">
                        <td className="p-3">{reg.name}</td>
                        <td className="p-3">{reg.email}</td>
                        <td className="p-3">{getEventName(reg.event_id)}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              reg.attended
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {reg.attended ? "Attended" : "Not Attended"}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() =>
                              handleAttendanceToggle(reg._id, reg.attended)
                            }
                            className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                              reg.attended
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            Mark as {reg.attended ? "Not Attended" : "Attended"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrackAttendees;