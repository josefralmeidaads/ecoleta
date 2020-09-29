import knex from '../../database/connections';
import {Request, Response} from 'express';

class ItemsControllers{
    async index(request: Request, response: Response){

        const items = await knex.select('*').from('items');
    
        const serializedItems =  items.map( item => { 
            return {
                id: item.id,
                title: item.title,
                image_url: `http://10.0.0.114:3333/uploads/${item.image}`
             }
        })
    
        return response.json(serializedItems);
    }
}

export default ItemsControllers;