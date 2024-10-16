import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapModal from '../Modal/MapModal';
import PropTypes from 'prop-types'; 

const MapComponent = ({ showViewMapButton = true }) => {
  const mapRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const map = L.map('map', { attributionControl: false }).setView([8.517929085240388, 124.58403441674167], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    const marker = L.marker([8.517929085240388, 124.58403441674167]).addTo(map)
      .bindPopup('Your Resort Location');
    
    mapRef.current = { map, marker };

    if (showViewMapButton) {
      const customControl = L.control({ position: 'bottomleft' });
      
      customControl.onAdd = function () {
        const div = L.DomUtil.create('div', 'custom-control');
        const button = L.DomUtil.create('button', 'bg-[#12B1D1] hover:bg-[#3ebae7] text-white rounded-md p-2 shadow');
        button.innerHTML = 'View Map';
        
        button.onclick = function () {
          map.dragging.disable();
          map.touchZoom.disable();
          map.scrollWheelZoom.disable();
          setModalOpen(true); 
        };
        
        div.appendChild(button);
        return div;
      };
      
      customControl.addTo(map);
    }

    return () => {
      map.remove(); 
      mapRef.current = null;
    };
  }, [showViewMapButton]);

  const closeModal = () => {
    if (mapRef.current) {
      mapRef.current.map.dragging.enable();
      mapRef.current.map.touchZoom.enable();
      mapRef.current.map.scrollWheelZoom.enable();
      mapRef.current.map.setView([8.517929085240388, 124.58403441674167], 13);
      mapRef.current.marker.openPopup();
    }
    setModalOpen(false);
  };

  return (
    <div className="relative">
      <div 
        id="map" 
        style={{
          height: '300px', 
          width: '100%', 
          zIndex: 1,
          display: modalOpen ? 'none' : 'block'
        }}
      >
      </div>
      
      <MapModal isOpen={modalOpen} onClose={closeModal}>
        <div id="large-map" style={{ height: '400px', width: '100%' }}></div>
        <LargeMap />
      </MapModal>
    </div>
  );
};

MapComponent.propTypes = {
  showViewMapButton: PropTypes.bool,
};

const LargeMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('large-map', { attributionControl: false }).setView([8.517929085240388, 124.58403441674167], 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
      const marker = L.marker([8.517929085240388, 124.58403441674167]).addTo(map)
        .bindPopup('Your Resort Location')
        .openPopup();
  
      mapRef.current = { map, marker };
    }
  
    return () => {
      if (mapRef.current && mapRef.current.map) {
        mapRef.current.map.remove();
        mapRef.current = null; 
      }
    };
  }, []);

  return null; 
};

export default MapComponent;
