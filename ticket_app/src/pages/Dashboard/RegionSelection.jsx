import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import useCourseSelection from "../../store/useCourseSelection";
import {
  Loader2,
  MapPin,
  School,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

const CourseCountBadge = ({ count, type, color, seats }) => (
  <div
    className={`flex items-center justify-between w-full ${color} px-2 py-1 rounded-lg`}
  >
    <div className="flex items-center gap-1.5">
      <School className="w-3 h-3" />
      <span>{`${type}: ${count}`}</span>
    </div>
    <span className="text-xs opacity-75">{seats} seats</span>
  </div>
);

const CityTooltip = ({ cityName, courseInfo }) => {
  const getTotalSeats = (courses) => {
    return (
      courses?.reduce((total, course) => total + course.totalSeats, 0) || 0
    );
  };

  return (
    <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 min-w-[220px]">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-gray-800">{cityName}</span>
        </div>
        <div className="space-y-1.5">
          {courseInfo["M.Tech"]?.length > 0 && (
            <CourseCountBadge
              count={courseInfo["M.Tech"].length}
              type="M.Tech"
              color="bg-yellow-100 text-yellow-700"
              seats={getTotalSeats(courseInfo["M.Tech"])}
            />
          )}
          {courseInfo["B.Tech"]?.length > 0 && (
            <CourseCountBadge
              count={courseInfo["B.Tech"].length}
              type="B.Tech"
              color="bg-red-100 text-red-700"
              seats={getTotalSeats(courseInfo["B.Tech"])}
            />
          )}
          {courseInfo.Diploma?.length > 0 && (
            <CourseCountBadge
              count={courseInfo.Diploma.length}
              type="Diploma"
              color="bg-green-100 text-green-700"
              seats={getTotalSeats(courseInfo.Diploma)}
            />
          )}
          {courseInfo.ITI?.length > 0 && (
            <CourseCountBadge
              count={courseInfo.ITI.length}
              type="ITI"
              color="bg-orange-100 text-orange-700"
              seats={getTotalSeats(courseInfo.ITI)}
            />
          )}
        </div>
        <div className="text-xs text-gray-500 pt-2 mt-1 border-t flex justify-between">
          <span>Total seats: {courseInfo.totalSeats}</span>
          <span>Available: {courseInfo.availableSeats}</span>
        </div>
      </div>
    </div>
  );
};

const CityLabel = ({ cityName, hasCourses }) => (
  hasCourses ? (
    <div className="bg-white px-2 py-0.5 rounded-md shadow-sm border border-gray-100">
      <div className="flex items-center gap-1.5">
        <MapPin className="w-3 h-3 text-blue-500" />
        <span className="text-sm text-gray-800 font-medium">{cityName}</span>
      </div>
    </div>
  ) : null
);

const RegionSelection = () => {
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();
  const {
    courses = [],
    fetchCourses,
    isLoading,
    getCoursesByCity,
    getCitySeatInfo,
  } = useCourseSelection();

  useEffect(() => {
    fetchCourses();
    fetch("/public/madhya_pradesh.geojson")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load map data");
        return response.json();
      })
      .then(setGeoData)
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
        setError(error.message);
      });
  }, [fetchCourses]);

  const citiesWithCourses = Array.from(
    new Set(courses.map((course) => course.city))
  );
  const citySeatInfo = getCitySeatInfo();

  const getFeatureStyle = useCallback(
    (feature) => {
      const cityName = feature.properties.NAME_2;
      const hasCourses = citiesWithCourses.includes(cityName);
      const isSelected = selectedCity === cityName;

      return {
        color: isSelected ? "#2563eb" : hasCourses ? "#3b82f6" : "#64748b",
        weight: isSelected ? 3 : hasCourses ? 2 : 1.5,
        fillColor: isSelected ? "#60a5fa" : hasCourses ? "#bfdbfe" : "#f8fafc",
        fillOpacity: isSelected ? 0.7 : hasCourses ? 0.6 : 0.2,
        opacity: hasCourses ? 1 : 0.3,
        className: "map-feature",
        dashArray: isSelected ? "" : hasCourses ? "5, 5" : "",
      };
    },
    [citiesWithCourses, selectedCity]
  );

  const onEachFeature = useCallback(
    (feature, layer) => {
      const cityName = feature.properties.NAME_2;
      const hasCourses = citiesWithCourses.includes(cityName);

      // Add permanent city label
      layer.bindTooltip(
        ReactDOMServer.renderToString(
          <CityLabel cityName={cityName} hasCourses={hasCourses} />
        ),
        {
          permanent: true,
          direction: "center",
          className: `city-label ${hasCourses ? "has-courses" : "no-courses"}`,
        }
      );

      if (hasCourses) {
        // Create a second tooltip for course information
        const courseTooltip = L.tooltip({
          permanent: false,
          direction: "top",
          className: "course-tooltip has-courses",
          opacity: 1,
        });

        const courseInfo = getCoursesByCity(cityName);
        const seatInfo = citySeatInfo[cityName] || {
          totalSeats: 0,
          availableSeats: 0,
        };
        courseInfo.totalSeats = seatInfo.totalSeats;
        courseInfo.availableSeats = seatInfo.availableSeats;

        courseTooltip.setContent(() => {
          const tooltipElement = document.createElement("div");
          tooltipElement.innerHTML = ReactDOMServer.renderToString(
            <CityTooltip cityName={cityName} courseInfo={courseInfo} />
          );
          return tooltipElement;
        });

        layer.on({
          mouseover: (e) => {
            const layer = e.target;
            layer.setStyle({
              fillOpacity: 0.7,
              weight: 2,
            });
            layer.bringToFront();
            courseTooltip.setLatLng(e.latlng).addTo(layer._map);
          },
          mousemove: (e) => {
            courseTooltip.setLatLng(e.latlng);
          },
          mouseout: (e) => {
            const layer = e.target;
            layer.setStyle(getFeatureStyle(feature));
            layer._map.removeLayer(courseTooltip);
          },
          click: () => {
            setSelectedCity(cityName);
            navigate(`/dashboard/city/${cityName}`);
          },
        });
      }
    },
    [
      citiesWithCourses,
      getCoursesByCity,
      citySeatInfo,
      navigate,
      getFeatureStyle,
    ]
  );

  if (error) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="text-gray-600">
            Failed to load map data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-blue-500 mx-auto animate-spin" />
          <p className="text-gray-600">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4 lg:p-8"
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Select Region</h1>
            {selectedCity && (
              <button
                onClick={() => setSelectedCity(null)}
                className="flex items-center px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Map
              </button>
            )}
          </div>

          <div className="w-full h-[700px] rounded-lg overflow-hidden border border-gray-200">
            {geoData && (
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
                <GeoJSON
                  data={geoData}
                  style={getFeatureStyle}
                  onEachFeature={onEachFeature}
                />
              </MapContainer>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .map-tiles {
          filter: grayscale(1) opacity(0.6);
        }
        .city-label {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          font-size: 12px;
          padding: 0;
        }
        .city-label.has-courses {
          z-index: 500;
        }
        .course-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          font-size: 12px;
          padding: 0;
          transition: all 0.2s ease-in-out;
          z-index: 1000;
        }
        .course-tooltip .leaflet-tooltip-content {
          transform: scale(0.95) translateY(10px);
          transition: all 0.2s ease-in-out;
          transform-origin: center bottom;
          opacity: 0;
        }
        .course-tooltip.leaflet-tooltip-visible .leaflet-tooltip-content {
          transform: scale(1) translateY(0);
          opacity: 1;
        }
        .leaflet-tooltip-top:before,
        .leaflet-tooltip-bottom:before,
        .leaflet-tooltip-left:before,
        .leaflet-tooltip-right:before {
          display: none !important;
        }
        .leaflet-container {
          font-family: inherit;
        }
        /* Add beautiful map feature styling */
        .map-feature {
          filter: drop-shadow(0 0 6px rgba(37, 99, 235, 0.1));
          transition: all 0.3s ease;
        }
        .map-feature:hover {
          filter: drop-shadow(0 0 8px rgba(37, 99, 235, 0.2));
        }
        path {
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </motion.div>
  );
};

export default RegionSelection;
