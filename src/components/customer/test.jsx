import React, { useState, useEffect } from "react";

const LocationSelector = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Fetch danh sách tỉnh
  useEffect(() => {
    const fetchProvinces = async () => {
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await response.json();
      setProvinces(data);
    };

    fetchProvinces();
  }, []);

  // Fetch danh sách quận/huyện khi tỉnh được chọn
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        const response = await fetch(
          `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
        );
        const data = await response.json();
        setDistricts(data.districts || []);
        setWards([]); // Reset danh sách xã/phường khi chọn tỉnh mới
        setSelectedDistrict("");
        setSelectedWard("");
      };

      fetchDistricts();
    }
  }, [selectedProvince]);

  // Fetch danh sách xã/phường khi quận/huyện được chọn
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        const response = await fetch(
          `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
        );
        const data = await response.json();
        setWards(data.wards || []);
        setSelectedWard("");
      };

      fetchWards();
    }
  }, [selectedDistrict]);

  return (
    <div className="location-selector">
      <h2>Chọn địa điểm</h2>

      {/* Dropdown Tỉnh/Thành phố */}
      <div className="dropdown">
        <label>Tỉnh/Thành phố:</label>
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
        >
          <option value="">-- Chọn Tỉnh/Thành phố --</option>
          {provinces.map((province) => (
            <option key={province.code} value={province.code}>
              {province.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown Quận/Huyện */}
      <div className="dropdown">
        <label>Quận/Huyện:</label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          disabled={!selectedProvince}
        >
          <option value="">-- Chọn Quận/Huyện --</option>
          {districts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown Xã/Phường */}
      <div className="dropdown">
        <label>Xã/Phường:</label>
        <select
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          disabled={!selectedDistrict}
        >
          <option value="">-- Chọn Xã/Phường --</option>
          {wards.map((ward) => (
            <option key={ward.code} value={ward.code}>
              {ward.name}
            </option>
          ))}
        </select>
      </div>

      {/* Hiển thị kết quả đã chọn */}
      <div className="result">
        <h3>Địa chỉ đã chọn:</h3>
        <p>
          {selectedWard && `${wards.find((w) => w.code === selectedWard)?.name}, `}
          {selectedDistrict &&
            `${districts.find((d) => d.code === selectedDistrict)?.name}, `}
          {selectedProvince &&
            `${provinces.find((p) => p.code === selectedProvince)?.name}`}
        </p>
      </div>
    </div>
  );
};

export default LocationSelector;
