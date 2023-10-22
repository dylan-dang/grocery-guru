'use client';
import { sample } from 'lodash';
import { useEffect, useState } from 'react';
import { Card, LoadingCard } from './Card';
import { Item, getItem } from '../actions/item';

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

function SearchBar({ pending }: { pending: boolean }) {
    const [target, setTarget] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    useEffect(() => {
        const update = () => setTarget(sample(exampleQueries) as string);
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
                    disabled={pending}
                    aria-disabled={pending}
                    type='search'
                    id='query'
                    name='query'
                    className='block w-full p-4 pl-10 text-sm border rounded-lg disabled:text-gray-400 disabled:bg-gray-800 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:outline-none'
                    placeholder={placeholder}
                    required
                />
                <button
                    disabled={pending}
                    aria-disabled={pending}
                    type='submit'
                    className='text-white disabled:text-gray-400 absolute right-2.5 bottom-2.5 disabled:bg-green-800 bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 focus:ring-blue-800'
                >
                    Search
                </button>
            </div>
        </>
    );
}

export function SearchForm() {
    const [item, setItem] = useState<Item | 'loading' | null>(null);
    return (
        <>
            <form
                className='mt-5 px-3 w-full max-w-3xl'
                action={async (formData) => {
                    setItem(await getItem(formData));
                }}
                onSubmit={() => {
                    setItem('loading');
                }}
            >
                <SearchBar pending={item == 'loading'} />
            </form>
            {item && (item == 'loading' ? <LoadingCard /> : <Card item={item} />)}
        </>
    );
}
/*
export function SearchForm() {
    const [item, setItem] = useState<string | null>(null);
    return (
        <>
            <form
                className='mt-5 px-3 w-full max-w-3xl'
                onSubmit={async (event) => {
                    setItem('loading');
                    event.preventDefault();
                    const elem = event.currentTarget.querySelector('#item') as HTMLInputElement;
                    const term = elem.value;
                    // const targetData = await getTargetData(term);
                    // console.log(targetData);
                    // const item = targetData?.search_results?.[0];
                    // if (!item) {
                    //     alert('item does not exist');
                    //     setItem(null);
                    //     return;
                    // }
                    // setItem({
                    //     src: item.product.main_image,
                    //     href: item.product.link,
                    //     title: parseEntities(item.product.title),
                    //     desc: `${item.offers.primary.price}`,
                    // });
                    const walmartData = await getWalmartData(term);
                    console.log(walmartData);
                }}
            >
                <SearchBar />
            </form>
            {item &&
                (item == 'loading' ? (
                    <LoadingIcon />
                ) : (
                    <Card src={item.src} href={item.href} title={item.title} desc={`$${item.desc}`} />
                ))}
        </>
    );
}
*/
