'use client';
import { Item } from '../actions/item';

export function Card({ item: { image, link, price, title } }: { item: Item }) {
    return (
        <a
            href={link}
            className='mt-10 flex flex-col items-center border rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-700 border-gray-700 bg-gray-800 '
        >
            <img
                className='object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg'
                src={image}
                alt=''
            />
            <div className='flex flex-col justify-between p-4 leading-normal'>
                <h5 className='mb-2 text-2xl font-bold tracking-tight text-white'>{title}</h5>
                <p className='mb-3 font-normal text-gray-400'>{price}</p>
            </div>
        </a>
    );
}
