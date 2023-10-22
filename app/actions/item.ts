'use server';
import { parseEntities } from 'parse-entities';

export interface Item {
    link: string;
    price: string;
    image: string;
    title: string;
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getItem(formData: FormData): Promise<Item | null> {
    const query: string = formData.get('query') as string;
    await sleep(3000);
    return {
        link: 'string',
        price: 'string',
        image: 'string',
        title: query,
    }
}