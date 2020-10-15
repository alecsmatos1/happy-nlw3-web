import React, { FunctionComponent, useEffect, useState } from 'react';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, PopupProps } from 'react-leaflet';
import {
  Container,
  Aside,
  CreateOrphanage,
  MapPopup,
  LinkOrphanage,
} from './styles';

import mapMarkerImg from '../../images/map-marker.svg';
import mapIcon from '../../utils/mapIcon';
import api from '../../services/api';

interface Orphanage {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

const OrphanagesMap: React.FC = () => {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    });
  }, []);

  return (
    <Container>
      <Aside>
        <header>
          <img src={mapMarkerImg} alt="Happy" />
          <h2>Escolha um orfanato no Mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>Santarém</strong>
          <span>Pará</span>
        </footer>
      </Aside>
      <Map
        center={[-2.439792, -54.71896]}
        zoom={14}
        style={{ width: '100%', height: '100%', zIndex: 5 }}
      >
        {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />
        {orphanages.map(orphanage => {
          return (
            <Marker
              key={orphanage.id}
              icon={mapIcon}
              position={[orphanage.latitude, orphanage.longitude]}
            >
              <MapPopup<FunctionComponent<PopupProps>>
                closeButton={false}
                minWidth={240}
                maxWidth={240}
              >
                {orphanage.name}
                <LinkOrphanage to={`/orphanages/${orphanage.id}`}>
                  <FiArrowRight size={20} color="#FFF" />
                </LinkOrphanage>
              </MapPopup>
            </Marker>
          );
        })}
      </Map>

      <div>a</div>
      <CreateOrphanage to="/orphanages/create">
        <FiPlus size={32} color="#FFF" />
      </CreateOrphanage>
    </Container>
  );
};
export default OrphanagesMap;
