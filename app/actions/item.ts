'use server';
import { parseEntities } from 'parse-entities';

export interface Item {
    link: string;
    price: string;
    image: string;
    title: string;
}

export async function getItem(formData: FormData): Promise<Item | null> {
    console.log(formData.get('query'));
    return {
        link: 'string',
        price: 'string',
        image: 'string',
        title: 'string',
    }
}