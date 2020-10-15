/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import { FiPlus } from 'react-icons/fi';

import './create-orphanage.css';
import { useHistory } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import mapIcon from '../../utils/mapIcon';
import api from '../../services/api';
import {
  PageCreateOrphanage,
  CreateOrphanageForm,
  InformationField,
  InputBlock,
  ImagesContainer,
  InvisibleInput,
  ButtonSelectContainer,
  ButtonSelect,
  ConfirmationButton,
} from './styles';

const CreateOrphanage: React.FC = () => {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [about, setAbout] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }
    const selectedImages = Array.from(event.target.files);

    setImages(selectedImages);

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    });
    setPreviewImages(selectedImagesPreview);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));

    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));
    images.forEach(image => {
      data.append('images', image);
    });

    await api.post('orphanages', data);

    alert('Cadastro realizado com sucesso');
    history.push('/app');
  }

  return (
    <PageCreateOrphanage>
      <Sidebar />
      <main>
        <CreateOrphanageForm onSubmit={handleSubmit}>
          <InformationField>
            <legend>Informações</legend>

            <Map
              center={[-2.439792, -54.71896]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
              {position.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}
            </Map>

            <InputBlock>
              <label htmlFor="opening_hours">Nome</label>
              <input
                id="name"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </InputBlock>

            <InputBlock>
              <label htmlFor="about">
                Sobre
                <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
                id="about"
                maxLength={300}
                value={about}
                onChange={event => setAbout(event.target.value)}
              />
            </InputBlock>

            <InputBlock>
              <label htmlFor="images">Fotos</label>

              <ImagesContainer>
                {previewImages.map(image => {
                  return <img key={image} src={image} alt={name} />;
                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </ImagesContainer>
              <InvisibleInput
                multiple
                onChange={handleSelectImages}
                type="file"
                id="image[]"
              />
            </InputBlock>
          </InformationField>

          <InformationField>
            <legend>Visitação</legend>

            <InputBlock>
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={event => setInstructions(event.target.value)}
              />
            </InputBlock>

            <InputBlock>
              <label htmlFor="opening_hours">Horario de Funcionamento</label>
              <input
                id="opening_hours"
                value={opening_hours}
                onChange={event => setOpeningHours(event.target.value)}
              />
            </InputBlock>

            <InputBlock>
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <ButtonSelectContainer>
                <ButtonSelect
                  type="button"
                  isSelected={open_on_weekends}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </ButtonSelect>
                <ButtonSelect
                  type="button"
                  isSelected={!open_on_weekends}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </ButtonSelect>
              </ButtonSelectContainer>
            </InputBlock>
          </InformationField>

          <ConfirmationButton type="submit">Confirmar</ConfirmationButton>
        </CreateOrphanageForm>
      </main>
    </PageCreateOrphanage>
  );
};
export default CreateOrphanage;

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
