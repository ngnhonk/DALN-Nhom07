// src/components/admin/BusStationModal.jsx
import { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react'; // Import thêm icon Search
import { Button } from '../common/Button';
import { Input } from '../common/Input';

// --- LEAFLET IMPORTS ---
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix lỗi icon marker mặc định
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// 1. Component xử lý click trên bản đồ
const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return position ? <Marker position={position} /> : null;
};

// 2. Component mới: Tự động di chuyển map khi tọa độ thay đổi (do search)
const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 13);
    }
  }, [lat, lng, map]);
  return null;
};

export const BusStationModal = ({ isOpen, onClose, onSubmit, initialData, title, provinces = [] }) => {
  const DEFAULT_CENTER = { lat: 21.0285, lng: 105.8542 }; // Hà Nội

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    province_id: '',
    latitude: '',
    longitude: '',
    type: ''
  });
  
  // State cho tìm kiếm địa điểm
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          address: initialData.address,
          province_id: initialData.province_id,
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          type: initialData.type
        });
      } else {
        setFormData({
          name: '',
          address: '',
          province_id: provinces.length > 0 ? provinces[0].id : '',
          latitude: '',
          longitude: '',
          type: ''
        });
      }
      setSearchQuery(''); // Reset search
      setError('');
    }
  }, [isOpen, initialData, provinces]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý click trên map
  const handleMapClick = (latlng) => {
    setFormData(prev => ({
      ...prev,
      latitude: latlng.lat.toFixed(6),
      longitude: latlng.lng.toFixed(6)
    }));
  };

  // --- HÀM TÌM KIẾM ĐỊA ĐIỂM (MỚI) ---
  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Gọi API Nominatim của OpenStreetMap (Miễn phí)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const firstResult = data[0];
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(firstResult.lat).toFixed(6),
          longitude: parseFloat(firstResult.lon).toFixed(6)
        }));
      } else {
        alert('Không tìm thấy địa điểm này. Vui lòng thử tên khác.');
      }
    } catch (err) {
      console.error("Search error:", err);
      alert('Lỗi khi tìm kiếm địa điểm.');
    } finally {
      setIsSearching(false);
    }
  };

  // Xử lý Enter khi tìm kiếm
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Chặn submit form chính
      handleSearchLocation();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const submitData = {
      ...formData,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude)
    };

    try {
      await onSubmit(submitData);
      onClose();
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  // Xác định center ban đầu
  const mapCenter = (formData.latitude && formData.longitude)
    ? [formData.latitude, formData.longitude]
    : [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng];

  const markerPosition = (formData.latitude && formData.longitude)
    ? [formData.latitude, formData.longitude]
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Inputs */}
              <div className="space-y-4">
                <Input
                  label="Tên bến xe"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Vd: Bến xe Mỹ Đình"
                  required
                />
                
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh / Thành phố</label>
                  <select
                    name="province_id"
                    value={formData.province_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">-- Chọn Tỉnh --</option>
                    {provinces.map(prov => (
                      <option key={prov.id} value={prov.id}>
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Địa chỉ chi tiết"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Vd: 20 Phạm Hùng..."
                  required
                />

                <Input
                  label="Loại bến"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Vd: Bến xe khách"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Vĩ độ (Lat)"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Chọn trên bản đồ"
                  />
                  <Input
                    label="Kinh độ (Long)"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Chọn trên bản đồ"
                  />
                </div>
              </div>

              {/* Right Column: Map */}
              <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300 shadow-inner relative z-0 group">
                
                {/* --- SEARCH BOX OVERLAY --- */}
                <div className="absolute top-2 left-2 right-12 z-[1000] flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Tìm địa điểm (Vd: Bến xe Giáp Bát)..."
                      className="w-full pl-3 pr-10 py-2 rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleSearchLocation}
                      disabled={isSearching}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600"
                    >
                      {isSearching ? (
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                {/* -------------------------- */}

                <MapContainer 
                  center={mapCenter} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Component để update view khi tìm kiếm xong */}
                  <RecenterAutomatically 
                    lat={formData.latitude} 
                    lng={formData.longitude} 
                  />

                  {/* Component xử lý click */}
                  <LocationMarker 
                    position={markerPosition} 
                    setPosition={handleMapClick} 
                  />
                </MapContainer>

                <p className="text-xs text-gray-500 mt-1 absolute bottom-1 left-1 bg-white/80 px-2 py-1 rounded z-[1000]">
                  * Click map hoặc dùng ô tìm kiếm ở trên
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="secondary" onClick={onClose} disabled={loading} className="w-32">
                Hủy
              </Button>
              <Button type="submit" loading={loading} className="w-32">
                Lưu lại
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};