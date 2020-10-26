import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      nome: string,
}

const Createpoint: React.FC = () => {
  toast.configure();

  const [ items, setItems] = useState<ItemProps[]>([]);
  const [ ufs, setUfs] = useState<UFSProps[]>([]);
  const [ cidades, setCidades] = useState<string[]>([]);
  const [ selectedUf, setSelectedUfs] = useState('0');
  const [ selectedCidade, setSelectedCidade] = useState('0');
  const [ position, setPosition] = useState<[number, number]>([0,0]);
  const [ initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
  const [ formData, setFormData ] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })
  const [selectedItem, setSelectedItem] = useState<number[]>([]);
  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords ;
      setInitialPosition([ latitude,longitude ]);
    })
  }, [])

  useEffect(() => {
    const loadItems = async() => {
        const response = await api.get('/items');
        setItems(response.data);
    }

    loadItems();
  }, [])

  useEffect(() => {
    const loadUF = async() => {
      const response = await axios.get<UFSProps[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
      const ordenado = response.data.sort(function(a , b){return a.nome < b.nome ? -1: a.nome > b.nome ? 1: 0;})
      setUfs(ordenado);
    }

    loadUF();
  }, [])

  useEffect(() => {

    if (selectedUf === '0'){
      return; 
    }

    const loadCidade = async() => {
      const response = await axios.get<IBGECidade[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      const cidades = response.data.map( cidade => cidade.nome)
      setCidades(cidades);
    }

    loadCidade();
  }, [selectedUf])


  const handleSelectUf = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUfs(e.target.value);
  }

  const handleSelectCidade = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCidade(e.target.value);
  }

  const handlePosition = (e:LeafletMouseEvent) => {
    setPosition([e.latlng.lat, e.latlng.lng])
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value });
  }

  const handleSelectItem = (id:number) => {
    //findIndex irá procurar se o meu item é igual ao meu id que stou selecionando, se for ele me retorna 0 se não existir esse número
    //ele me retorna -1 ai então adiciono se não existir, e removo se existir
    const alreadySelected = selectedItem.findIndex(item => item === id );
    
    if (alreadySelected >= 0){
      const filteredItem = selectedItem.filter(item => item !== id);
      setSelectedItem(filteredItem)
    } else {
      setSelectedItem([...selectedItem, id]);
    }

  }

  const handleCreatePoint = async(e:React.FormEvent) => {
    e.preventDefault()
    const { name, email, whatsapp } = formData;
    const [latitude, longitude] = position;
    const city = selectedCidade;
    const uf = selectedUf;
    const items = selectedItem;

    const data = {
      name, email, whatsapp, latitude, longitude, city, uf, items
    }
    
    try{
      await api.post('/points',data);
      toast.success('Cadastro realizado com Sucesso!', {autoClose: 5000});
      history.push('/');
    }catch(e)
    {
      toast.error(e, {autoClose: 10000});
    }
    
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

        <form onSubmit={handleCreatePoint}>
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
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input 
                  type="number"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleChange}
                />
                </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço do mapa</span>
            </legend>

            <Map center={initialPosition} zoom={16} onclick={handlePosition}>
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
                 <option value={'0'}>Selecione uma UF</option>
                  {ufs.map( uf => (
                     <option key={uf.id} value={uf.sigla}>{uf.nome}</option>
                   ))}
                 </select>
               </div>
 
               <div className="field">
                 <label htmlFor="city">Cidade</label>
                 <select value={selectedCidade} onChange={handleSelectCidade} name="city" id="city">
                 <option value={'0'}>Selecione uma Cidade</option>
                 {cidades.map( (cidade,) => (
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
                <li 
                  key={item.id} 
                  onClick={() => {handleSelectItem(item.id)}}
                  className={selectedItem.includes(item.id) ? 'selected' : ''}
                >
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