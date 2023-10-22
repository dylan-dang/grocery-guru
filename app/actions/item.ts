'use server';

import { URLSearchParams } from 'url';
import { selectors, chromium } from 'playwright';
import chrome from '@sparticuz/chromium-min';
// const puppeteer = require('puppeteer-core');

export interface Item {
    link: string;
    price: string;
    image: string;
    title: string;
}

function parseUrl(base: string, rel: string, params?: ConstructorParameters<typeof URLSearchParams>[0]): string {
    const url = new URL(rel, base);
    if (params) {
        const searchParams = new URLSearchParams(params);
        url.search = searchParams.toString();
    }
    return url.toString();
}

async function getTargetItem(searchTerm: string): Promise<Item | null> {
    const base = 'https://www.target.com'
    const executablePath = await chrome.executablePath(
        `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
    );
    await selectors.setTestIdAttribute('data-test');
    const browser = await chromium.launch({ executablePath })
    const page = await browser.newPage();
    await page.goto(parseUrl(base, '/s', { searchTerm }));

    const productCardWrapper = page.getByTestId('@web/ProductCard/ProductCardVariantDefault').first();
    const href = await productCardWrapper.locator('a').first().getAttribute('href');
    const src = await productCardWrapper.locator('img').first().getAttribute('src');
    const item: Item = {
        image: src ? parseUrl(base, src, {}) : '',
        title: await productCardWrapper.getByTestId('product-title').innerText(),
        price: await productCardWrapper.getByTestId('current-price').innerText(),
        link: href ? parseUrl(base, href) : '',
    };
    await browser.close();
    return item;
}

export async function getItem(formData: FormData): Promise<Item | null> {
    const query: string = formData.get('query') as string;

    return getTargetItem(query);
}