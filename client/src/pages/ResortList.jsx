import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaRegStar } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:8080';

const ResortList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // filter states (controlled input fields)
  const [locFilter, setLocFilter]       = useState(params.get('location') || '');
  const [maxPrice, setMaxPrice]         = useState(params.get('maxPrice') || '');
  const [sort, setSort]                 = useState(params.get('sort') || '');
  const [petFriendly, setPetFriendly]   = useState(params.has('petFriendly'));

  const query = {
    location:    params.get('location')   || '',
    checkIn:     params.get('checkIn'),
    checkOut:    params.get('checkOut'),
    petFriendly: params.has('petFriendly'),
    sort:        params.get('sort')       || '',
    maxPrice:    params.get('maxPrice')   || '',
    adults:      Number(params.get('adults')   || 0),
    children:    Number(params.get('children') || 0),
    rooms:       Number(params.get('rooms')    || 0),
  };

  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState(null);

  // Convert object to query string, omitting empty/false values
  const toQuery = (obj) => {
    const p = new URLSearchParams();
    Object.entries(obj).forEach(([k, v]) => {
      if (v === '' || v === null || v === undefined) return;
      if (typeof v === 'boolean' && !v) return;
      p.append(k, v);
    });
    return p.toString();
  };

  // Fetch resorts
  useEffect(() => {
    (async () => {
      try {
        const qs = toQuery(query);
        const res = await fetch(
          qs
            ? `${API_BASE_URL}/api/fiteresort/search?${qs}`
            : `${API_BASE_URL}/api/resorts/allresorts`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setResorts(await res.json());
      } catch (e) {
        console.error(e);
        setErr('Could not load resorts. Try again later.');
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search]);

  // Submit filter
  const handleSubmit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (locFilter)    p.set('location', locFilter);
    if (maxPrice)     p.set('maxPrice', maxPrice);
    if (petFriendly)  p.set('petFriendly', '1');
    if (sort)         p.set('sort', sort);
    navigate(`/resorts?${p.toString()}`);
  };

  if (loading) return <p className="text-center mt-10">Loading resorts…</p>;
  if (err)     return <p className="text-center text-red-500 mt-10">{err}</p>;

  return (
    <section className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-4">All Resorts</h1>

        {/* Filter bar */}
        <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-4 items-end">
          <input
            value={locFilter}
            onChange={e => setLocFilter(e.target.value)}
            placeholder="Location"
            className="border rounded p-2"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            placeholder="Max price"
            className="border rounded p-2 w-28"
          />
          <label className="flex items-center gap-1 text-sm">
            <input type="checkbox" checked={petFriendly} onChange={() => setPetFriendly(!petFriendly)} />
            Pet-friendly
          </label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Sort</option>
            <option value="low-to-high">Price ↑</option>
            <option value="high-to-low">Price ↓</option>
          </select>
      <button
  type="submit"
  disabled={!locFilter && !maxPrice && !petFriendly && !sort}
  className={`px-4 py-2 rounded ${
    locFilter || maxPrice || petFriendly || sort
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
  }`}
>
  Search
</button>
        </form>

        {/* Resorts list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resorts.length ? resorts.map((r) => (
            <div key={r._id} onClick={() => navigate(`/resorts/${r._id}`)}
                 className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition">
              <img src={`${API_BASE_URL}/api/resorts/image/${encodeURIComponent(r.image)}`}
                   alt={r.name} className="h-56 w-full object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-bold">{r.name}</h2>
                <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
                  <FaMapMarkerAlt className="mr-1 text-red-400" />
                  <span>{r.location}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">₹{r.price}/night</p>
                <p className="text-xs text-gray-400 mb-2">
                  {(r.amenities || []).join(', ')}
                </p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) =>
                    i < (r.rating || 4)
                      ? <FaStar key={i} className="text-yellow-400 mr-1" />
                      : <FaRegStar key={i} className="text-gray-300 mr-1" />
                  )}
                </div>
              </div>
            </div>
          )) : (
            <p className="text-gray-600 col-span-full">No resorts match your filters.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResortList;