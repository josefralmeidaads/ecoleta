import express, { json } from 'express';

const app = express();
app.use(express.json());

app.get('/users', (request, response) => {
    return response.json({ message: "Deu Certo" })
})

app.listen(3333);