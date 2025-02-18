import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "leaflet/dist/leaflet.css";

const StateMap = ({ selectedCity, cities, onCitySelect }) => {
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/public/madhya_pradesh.geojson")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setGeoData(data))
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
        setError(error.message);
      });
  }, []);

  const getFeatureStyle = (feature) => {
    const cityName = feature.properties.NAME_2;
    const normalizedCityName = cityName?.toLowerCase();
    const isSelected = selectedCity?.toLowerCase() === normalizedCityName;
    const hasInstitutes = cities?.some(
      (city) => city.toLowerCase() === normalizedCityName
    );

    return {
      color: isSelected ? "#1d4ed8" : hasInstitutes ? "#2563eb" : "#64748b",
      weight: isSelected ? 3 : hasInstitutes ? 2 : 1.5,
      fillColor: isSelected ? "#60a5fa" : hasInstitutes ? "#fef9c3" : "#fef08a",
      fillOpacity: isSelected ? 0.7 : hasInstitutes ? 0.5 : 0.2,
    };
  };

  const onEachFeature = (feature, layer) => {
    const cityName = feature.properties.NAME_2;
    const normalizedCityName = cityName?.toLowerCase();
    const hasInstitutes = cities?.some(
      (city) => city.toLowerCase() === normalizedCityName
    );

    layer.on({
      mouseover: (e) => {
        if (hasInstitutes) {
          const layer = e.target;
          layer.setStyle({
            fillOpacity: 0.7,
            weight: 2,
          });
        }
      },
      mouseout: (e) => {
        if (hasInstitutes) {
          const layer = e.target;
          layer.setStyle(getFeatureStyle(feature));
        }
      },
      click: () => {
        if (hasInstitutes) {
          if (onCitySelect) {
            onCitySelect(cityName);
          }
          navigate(`/dashboard/city/${cityName}`);
        } else {
          toast.error(`No courses available in ${cityName}`, {
            duration: 2000,
            position: 'top-center',
            className: 'bg-white text-gray-900 border border-gray-200',
          });
        }
      },
    });

    const tooltipContent = `
      <div class="flex items-center justify-center gap-1 ${
        hasInstitutes ? "text-blue-600" : "text-gray-500"
      }">
        ${
          hasInstitutes
            ? '<div class="w-3 h-3 flex-shrink-0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>'
            : ""
        }
        <span class="${hasInstitutes ? "font-semibold" : "font-medium"}">${
      cityName || "Unknown"
    }</span>
      </div>`;

    layer.bindTooltip(tooltipContent, {
      permanent: true,
      direction: "center",
      className: `city-label ${
        hasInstitutes ? "available-city" : "unavailable-city"
      }`,
    });
  };

  if (error) {
    return (
      <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">
          Failed to load map data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[700px] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
      <MapContainer
        center={[23.2599, 77.4126]}
        zoom={6}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        {geoData && (
          <GeoJSON
            data={geoData}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>
      <style>{`
        .map-tiles {
          filter: grayscale(1) opacity(0.6);
        }
        .city-label {
          background: white;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
        }
        .available-city {
          border: 1px solid #fef9c3;
          opacity: 1;
          font-weight: 600;
        }
        .unavailable-city {
          border: 1px solid #fef08a;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default StateMap;
