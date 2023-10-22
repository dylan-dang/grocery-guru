'use client';

import { useEffect, useState } from 'react';
import { isArray, isArrayLike, sample } from 'lodash';
import { Card, LoadingCard } from './Card';
import { Item, getHebItem, getTargetItem, getWalmartItem } from '../actions/item';

const exampleQueries = [
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

const prefixWords = [
    'Seek out',
    'Look for',
    'Browse for',
    'Scan for',
    'Scout for',
    'Peruse',
    'Ferret out',
    'Search for',
];

function SearchIcon() {
    return (
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
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
        </div>
    );
}

function SearchBar({ disabled, text }: { disabled: boolean; text?: string }) {
    const [target, setTarget] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    useEffect(() => {
        const update = () => {
            const randomPrefix = sample(prefixWords);
            const randomQuery = sample(exampleQueries);
            setTarget(`${randomPrefix} ${randomQuery}...`);
        };
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
            <label htmlFor='query' className='mb-2 text-sm font-medium sr-only text-white'>
                Search
            </label>
            <div className='relative'>
                <SearchIcon />
                <input
                    disabled={disabled}
                    aria-disabled={disabled}
                    type='search'
                    id='query'
                    name='query'
                    className='block w-full p-4 pl-10 text-sm border rounded-lg disabled:text-gray-400 disabled:bg-gray-800 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:outline-none'
                    placeholder={text ?? placeholder}
                    required
                />
                <button
                    disabled={disabled}
                    aria-disabled={disabled}
                    type='submit'
                    className='text-white disabled:text-gray-400 absolute right-2.5 bottom-2.5 disabled:bg-green-800 bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 focus:ring-blue-800'
                >
                    Search
                </button>
            </div>
        </>
    );
}

type Location = 'allowed' | 'denied' | 'pending';
export function SearchForm() {
    const actions = [getHebItem /* getTargetItem, getWalmartItem*/];
    const [location, setLocation] = useState<Location>('pending');
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            () => setLocation('allowed'),
            () => setLocation('denied'),
            { maximumAge: Infinity }
        );
    }, []);
    const [items, setItems] = useState<Item[] | 'loading'>([]);
    return (
        <>
            <form
                className='mt-5 px-3 w-full max-w-3xl'
                action={async (formData) => {
                    const query = formData.get('query') as string;
                    const items = await Promise.all(actions.map((action) => action(query)));
                    const filtered = items.filter((item): item is Item => item != null);
                    const pattern = /\d+\.\d{2}/;
                    const parse = (item: Item) => parseFloat(pattern.exec(item.price)?.[0] ?? '999');
                    filtered.sort((a, b) => parse(a) - parse(b));
                    setItems(filtered);
                }}
                onSubmit={() => setItems('loading')}
            >
                <SearchBar
                    text={
                        location == 'allowed'
                            ? undefined
                            : location == 'denied'
                            ? 'Location was denied!'
                            : 'Location data needed!'
                    }
                    disabled={location != 'allowed'}
                />
            </form>
            {items == 'loading' ? (
                <LoadingCard />
            ) : (
                items.map((item, i) => <Card key={i} item={item} hightlight={i == 0} />)
            )}
        </>
    );
}
