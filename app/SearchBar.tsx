"use client";
import { sampleSize } from "lodash";
import { useEffect, useState } from "react";

const items = [
  "Milk",
  "Eggs",
  "Bread",
  "Apples",
  "Bananas",
  "Chicken breasts",
  "Ground beef",
  "Rice",
  "Pasta",
  "Cereal",
  "Spinach",
  "Tomatoes",
  "Onions",
  "Potatoes",
  "Carrots",
  "Broccoli",
  "Canned tuna",
  "Peanut butter",
  "Jelly",
  "Cheese",
  "Yogurt",
  "Butter",
  "Frozen peas",
  "Orange juice",
  "Coffee",
  "Tea bags",
  "Flour",
  "Sugar",
  "Salt",
  "Pepper",
  "Olive oil",
  "Canned soup",
  "Pasta sauce",
  "Ketchup",
  "Mustard",
  "Mayonnaise",
  "Salad dressing",
  "Sliced ham",
  "Bacon",
  "Frozen pizza",
  "Ice cream",
  "Canned beans",
  "Tortilla chips",
  "Salsa",
  "Avocado",
  "Lemon",
  "Green bell pepper",
  "Basil",
  "Cilantro",
  "Brown rice",
  "Honey",
]

function SearchIcon() {
  return <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
</svg>
}

export function SearchBar() {
  "use client";
  const [target, setTarget] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  useEffect(() => {
    const update = () => {
      const stuff = sampleSize(items, 3);
      stuff[2] = 'or ' + stuff[2];
      setTarget(`${stuff.join(', ')}...`);
    }
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    let i = 0;
    setPlaceholder(target.charAt(0));
    const typingInterval = setInterval(() => {
      if (i < target.length) {
        setPlaceholder(prevText => prevText + target.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [target]);

    return <>
    <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon />
        </div>
        <input type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none" placeholder={placeholder} required  />
        <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:focus:ring-blue-800">Search</button>
    </div>
    </>;
}