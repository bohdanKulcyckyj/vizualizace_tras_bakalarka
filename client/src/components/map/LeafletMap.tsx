import React, { useState, useEffect } from "react";
import axios from "axios";
import { getTokenFromCookie } from "../../utils/jwt";
import { useNavigate } from "react-router-dom";
import L, { LatLngBounds, LatLngExpression } from "leaflet";
import { AreaSelect } from "../../utils/leaflet";
import Toolbar from "../toolbar/Toolbar";
import { useSearchBoxCore } from "@mapbox/search-js-react";
import { MAP_DETAIL, MAP_EDIT, MAP_NEW } from "../../api/endpoints";

const LeafletMap = ({ projectId }) => {
  const navigate = useNavigate();
  const [map, setMap] = useState(null);
  const [areaSelect, setAreaSelect] = useState(null);
  const [inputNameValue, setInputNameValue] = useState<string>("New Map");
  const [inputAddress, setInputAddress] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([51.505, -0.09]);
  const searchBoxCore = useSearchBoxCore({
    accessToken: process.env.REACT_APP_MAP_BOX_TOKEN,
  });

  const currentSessionToken = "test-123";

  useEffect(() => {
    // Define your Leaflet map
    const leafletMap = L.map("map").setView(mapCenter, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(leafletMap);

    // Create and add AreaSelect
    const areaSelectInstance = new AreaSelect();
    areaSelectInstance.initialize({
      width: 200,
      height: 300,
      minWidth: 40,
      minHeight: 40,
      minHorizontalSpacing: 40,
      minVerticalSpacing: 100,
    });
    areaSelectInstance.addTo(leafletMap);

    let token = getTokenFromCookie();
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (projectId) {
      axios
        .get(MAP_DETAIL + projectId, requestConfig)
        .then((res) => {
          console.log(res);
          if (res.data) {
            console.log(res.data.mapModel);
            leafletMap.setView(
              [res.data.mapModel.center.lat, res.data.mapModel.center.lng],
              res.data.mapModel.zoom
            );
            areaSelectInstance.setBounds(
              new L.LatLngBounds(
                res.data.mapModel.bbox.southWest,
                res.data.mapModel.bbox.northEast
              )
            );
          }
        })
        .catch((err) => console.error(err))
        .finally(() => {
          setMap(leafletMap);
          setAreaSelect(areaSelectInstance);
        });
    } else {
      setMap(leafletMap);
      setAreaSelect(areaSelectInstance);
    }

    return () => {
      leafletMap.remove();
    };
  }, []);

  useEffect(() => {
    if (map && areaSelect) {
      let leafletMap = map;
      let leafletAreaSelect = areaSelect;
      leafletMap.setView(mapCenter, 13);
      leafletAreaSelect.setBounds(
        new LatLngBounds(
          [mapCenter[0] + 0.202, mapCenter[1] + 0.582],
          [mapCenter[0] - 0.202, mapCenter[1] - 0.582]
        )
      );
      setMap(leafletMap);
      setAreaSelect(leafletAreaSelect);
    }
  }, [mapCenter]);

  const confirm = () => {
    const bounds = areaSelect.getBounds();
    console.log(bounds);

    const dist = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
    console.log("dist:", dist);

    if (dist > 20000 * 2) {
      // Display a snackbar or any other notification
      return;
    }

    let token = getTokenFromCookie();
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const newMap = {
      mapModel: {
        center: {
          lat: (bounds.getNorthEast().lat + bounds.getSouthWest().lat) / 2,
          lng: (bounds.getNorthEast().lng + bounds.getSouthWest().lng) / 2,
          alt: 4791.7,
        },
        bbox: {
          northEast: bounds.getNorthEast(),
          southWest: bounds.getSouthWest(),
        },
      },
      name: inputNameValue,
      trailGpxUrl: null,
      zoom: 13,
    };
    if (projectId) {
      axios
        .post(MAP_EDIT + projectId, newMap, requestConfig)
        .then((res) => navigate("/map-model/" + projectId, { replace: true }))
        .catch((e) => window.alert("Failed to edit map"));
    } else {
      axios
        .post(MAP_NEW, newMap, requestConfig)
        .then((res) => {
          if (res.data) {
            navigate("/map-model/" + res.data.id, { replace: true });
          }
        })
        .catch((e) => window.alert("Failed to edit map"));
    }
  };

  const cancel = () => {
    navigate(-1);
  };

  const handleRetrieveLocation = async (suggestion) => {
    const response = await searchBoxCore.retrieve(suggestion, {
      sessionToken: currentSessionToken,
    });
    //@ts-ignore
    setMapCenter(response.features[0].geometry.coordinates.reverse());
    setSuggestions([]);
  };

  useEffect(() => {
    const getSuggestions = async () => {
      const response = await searchBoxCore.suggest(inputAddress, {
        sessionToken: currentSessionToken,
      });
      console.log(response);
      setSuggestions(response.suggestions);
    };
    if (inputAddress) {
      getSuggestions();
    }
  }, [inputAddress]);

  return (
    <div className="leaflet-map__container">
      <Toolbar>
        <div className="form flex flex-col justify-between h-full">
          <div>
            <div className="form__input flex flex-col mb-2">
              <label htmlFor="mapName">Map name:</label>
              <input
                className="text-black"
                name="mapName"
                value={inputNameValue}
                onChange={(e) => setInputNameValue(e.target.value)}
              />
            </div>
            <div className="form__input searchbox__select flex flex-col mb-2">
              <label htmlFor="location">Location:</label>
              <input
                className="text-black"
                name="location"
                value={inputAddress}
                onChange={(e) => setInputAddress(e.target.value)}
              />
              <div className="searchbox__options">
                {suggestions
                  .filter((_data) => _data.full_address)
                  .map((_data, _index) => (
                    <div
                      onClick={() => handleRetrieveLocation(_data)}
                      key={_index}
                      className="searchbox__option"
                    >
                      {_data.full_address}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-6">
            <button onClick={confirm} className="primary-button">
              Save
            </button>
            <button onClick={cancel} className="secondary-button">
              Back
            </button>
          </div>
        </div>
      </Toolbar>
      <div id="map" className="leaflet-map__map"></div>
    </div>
  );
};

export default LeafletMap;
