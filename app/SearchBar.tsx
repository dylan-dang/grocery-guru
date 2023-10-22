'use client';
import { sample } from 'lodash';
import { useEffect, useState } from 'react';
import {parseEntities} from 'parse-entities';

const items = [
    'Milk',
    'Eggs',
    'Bread',
    'Apples',
    'Bananas',
    'Chicken breasts',
    'Ground beef',
    'Rice',
    'Pasta',
    'Cereal',
    'Spinach',
    'Tomatoes',
    'Onions',
    'Potatoes',
    'Carrots',
    'Broccoli',
    'Canned tuna',
    'Peanut butter',
    'Jelly',
    'Cheese',
    'Yogurt',
    'Butter',
    'Frozen peas',
    'Orange juice',
    'Coffee',
    'Tea bags',
    'Flour',
    'Sugar',
    'Salt',
    'Pepper',
    'Olive oil',
    'Canned soup',
    'Pasta sauce',
    'Ketchup',
    'Mustard',
    'Mayonnaise',
    'Salad dressing',
    'Sliced ham',
    'Bacon',
    'Frozen pizza',
    'Ice cream',
    'Canned beans',
    'Tortilla chips',
    'Salsa',
    'Avocado',
    'Lemon',
    'Green bell pepper',
    'Basil',
    'Cilantro',
    'Brown rice',
    'Honey',
];

function SearchIcon() {
    return (
        <svg
            className='w-4 h-4 text-gray-400'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 20 20'
        >
            <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
            />
        </svg>
    );
}

export function SearchBar() {
    const [target, setTarget] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    useEffect(() => {
        const update = () => setTarget(sample(items) as string);
        update();
        const interval = setInterval(update, 5000);
        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        let i = 0;
        setPlaceholder(target.charAt(0));
        const typingInterval = setInterval(() => {
            if (i < target.length) {
                setPlaceholder((prevText) => prevText + target.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);

        return () => clearInterval(typingInterval);
    }, [target]);

    return (
        <>
            <label className='mb-2 text-sm font-medium sr-only text-white'>Search</label>
            <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <SearchIcon />
                </div>
                <input
                    type='search'
                    id='item'
                    className='block w-full p-4 pl-10 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:outline-none'
                    placeholder={placeholder}
                    required
                />
                <button
                    type='submit'
                    className='text-white absolute right-2.5 bottom-2.5 bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 focus:ring-blue-800'
                >
                    Search
                </button>
            </div>
        </>
    );
}

async function getTargetData(term: string) {
    const url = new URL('https://api.redcircleapi.com/request');
    const searchParams = new URLSearchParams({
        api_key: '7AEE896443E54182B77E3C2F2B631561',
        type: 'search',
        search_term: term,
        sort_by: 'price_low_to_high',
    });
    url.search = searchParams.toString();
    const req = await fetch(url);
    return await req.json();
}

interface CardProps {
    src: string;
    href: string;
    title: string;
    desc: string;
}

export function Card({ src, href, title, desc }: CardProps) {
    return (
        <a
            href={href}
            className='mt-10 flex flex-col items-center border rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-700 border-gray-700 bg-gray-800 '
        >
            <img
                className='object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg'
                src={src}
                alt=''
            />
            <div className='flex flex-col justify-between p-4 leading-normal'>
                <h5 className='mb-2 text-2xl font-bold tracking-tight text-white'>{title}</h5>
                <p className='mb-3 font-normal text-gray-400'>{desc}</p>
            </div>
        </a>
    );
}

function LoadingIcon() {
    return (
        <div className='p-10 mt-10 flex flex-col items-center border rounded-lg shadow md:flex-row md:max-w-xl border-gray-700 bg-gray-800'>
            <svg
                aria-hidden='true'
                className='w-8 h-8 animate-spin text-gray-600 fill-green-600'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                    fill='currentColor'
                />
                <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                    fill='currentFill'
                />
            </svg>
        </div>
    );
}

export function SearchForm() {
    const [item, setItem] = useState<CardProps | 'loading' | null>(null);
    return (
        <>
            <form
                className='mt-5 px-3 w-full max-w-3xl'
                onSubmit={async (event) => {
                    setItem('loading');
                    event.preventDefault();
                    const elem = event.currentTarget.querySelector('#item') as HTMLInputElement;
                    const term = elem.value;
                    const results = await getTargetData(term);
                    const item = results?.search_results?.[0];
                    if (!item) {
                        alert('item does not exist');
                        return;
                    }
                    setItem({
                        src: item.product.main_image,
                        href: item.product.link,
                        title: parseEntities(item.product.title),
                        desc: `${item.offers.primary.price}`
                    });
                }}
            >
                <SearchBar />
            </form>
            {item &&
                (item == 'loading' ? (
                    <LoadingIcon />
                ) : (
                    <Card
                        src={item.src}
                        href={item.href}
                        title={item.title}
                        desc={`$${item.desc}`}
                    />
                ))}
        </>
    );
}
