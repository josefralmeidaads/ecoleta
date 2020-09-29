import express, { json } from 'express';
import cors from 'cors';
import path from 'path';

import routes from './routes';

const app = express();
app.use(express.json());

app.use(cors());

app.use(routes);

//express.static serve para entregar arquivos estaticos como imagens e pdfs em uma rota
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))


app.listen(3333);