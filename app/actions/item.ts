'use server';
import { parseEntities } from 'parse-entities';
import { selectors, chromium } from 'playwright';
import { URLSearchParams } from 'url';

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

    await selectors.setTestIdAttribute('data-test')
    const browser = await chromium.launch({ headless: true });
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