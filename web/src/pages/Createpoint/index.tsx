import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

import './styles.css';
import logo from '../../assets/logo.svg';
import api from '../../services/api';

interface ItemProps {
  id: number,
  title: string,
  image_url: string
}

interface UFSProps {
  id: number,
  nome: string,
  regiao: {
    id: number,
    sigla: string,
    nome: string
  }
  sigla: string
}

interface IBGECidade {
  microrregiao: {
    nome: string;
  }
}

interface CidadeProps {
  microrregiao: {
    nome: string;
  }
}

const Createpoint: React.FC = () => {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [ufs, setUfs] = useState<UFSProps[]>([]);
  const [cidades, setCidades] = useState<string[]>([]);
  const [selectedUf, setSelectedUfs] = useState('');

  useEffect(() => {
    const loadItems = async() => {
        const response = await api.get('/items');
        setItems(response.data);
    }

    loadItems();
  }, [])

  useEffect(() => {
    const loadUF = async() => {
      const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      setUfs(response.data);
    }

    loadUF();
  }, [])

  useEffect(() => {
    const loadCidade = async() => {
      const response = await axios.get<IBGECidade[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      const cidades = response.data.map(cidade => cidade.microrregiao.nome);
      setCidades(cidades)
    }

    loadCidade();
  }, [selectedUf])

  const [position, setPosition] = useState({
    lat: -21.216181,
    lng: -42.888112,
    zoom: 16,
  })

  const handleSelectUf = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUfs(e.target.value);
  }

  return (
      <div id="page-create-point">
        <header>
          <img src={logo} alt="logo"/>

          <Link to={"/"}>
            <FiArrowLeft/>
            Voltar ao Home
          </Link>
        </header>

        <form>
          <h1>Cadastro do <br /> ponto de coleta</h1>

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>

            <div className="field">
              <label htmlFor="name">Nome da Entidade</label>
              <input 
                type="text"
                name="name"
                id="name"
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email"
                  name="email"
                  id="email"
                />
              </div>

              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input 
                  type="number"
                  name="whatsapp"
                  id="whatsapp"
                />
                </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço do mapa</span>
            </legend>

            <Map center={position} zoom={position.zoom}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={position}>
                <Popup>
                  Empresa de coleta marcada!
                </Popup>
              </Marker>
            </Map>

            <div className="field-group">
               <div className="field">
                 <label htmlFor="uf">Estado (UF)</label>
                 <select onChange={handleSelectUf} value={selectedUf} name="uf" id="uf">
                 <option value={-1}>Selecione uma UF</option>
                  {ufs.map( uf => (
                     <option key={uf.id} value={uf.sigla}>{uf.nome}</option>
                   ))}
                 </select>
               </div>
 
               <div className="field">
                 <label htmlFor="city">Cidade</label>
                 <select name="city" id="city">
                 <option value={'0'}>Selecione uma Cidade</option>
                 {cidades.map( cidade => (
                     <option key={cidade} value={cidade}>{cidade}</option>
                   ))}
                 </select>
               </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Ítens de Coleta</h2>
              <span>selecione um ou mais itens abaixo</span>
            </legend>

            <ul className="items-grid">
              {items.map( item => (
                <li key={item.id}>
                  <img src={item.image_url} alt="" />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit">
            Cadastrar ponto de coleta
          </button>
        </form>
      </div>
  );
}

export default Createpoint;