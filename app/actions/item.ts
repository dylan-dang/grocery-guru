'use server';

import { URLSearchParams } from 'url';
import { chromium as playwright, Browser } from 'playwright';
import chromium from '@sparticuz/chromium-min';

export interface Item {
    link: string;
    price: string;
    image: string;
    title: string;
    source: string;
}

interface ExecutablePathSingleton {
    (): Promise<string>;
    _instance?: string;
}

const getExecutablePath: ExecutablePathSingleton = async () => {
    if (!getExecutablePath._instance) {
        getExecutablePath._instance = await chromium.executablePath(
            `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
        );
    }
    return getExecutablePath._instance;
}

function parseUrl(base: string, rel: string, params?: ConstructorParameters<typeof URLSearchParams>[0]): string {
    const url = new URL(rel, base);
    if (params) {
        const searchParams = new URLSearchParams(params);
        url.search = searchParams.toString();
    }
    return url.toString();
}

async function getTargetItem(browser: Browser, searchTerm: string): Promise<Item | null> {
    const base = 'https://www.target.com'
    const page = await browser.newPage();
    let item: Item | null = null;
    try {
        await page.goto(parseUrl(base, '/s', { searchTerm }));
        const productCardWrapper = page.locator('[data-test=@web/ProductCard/ProductCardVariantDefault]').first();
        const src = await productCardWrapper.getByRole('img').first().getAttribute('src');
        const href = await productCardWrapper.locator('a').first().getAttribute('href');
        item = {
            image: src ? parseUrl(base, src, {}) : '',
            title: await productCardWrapper.locator('[data-test=product-title]').innerText(),
            price: await productCardWrapper.locator('[data-test=current-price]').innerText(),
            link: href ? parseUrl(base, href) : '',
            source: 'Target'
        };
    } catch {
    } finally {
        await page.close();
    }

    return item;
}

async function getWalmartItem(browser: Browser, q: string): Promise<Item | null> {
    const base = 'https://www.walmart.com'
    const page = await browser.newPage();
    await page.goto(parseUrl(base, '/search', { q }));
    let item: Item | null = null;
    try {
        const group = page.getByRole('group').first();
        const href = await group.locator('a').first().getAttribute('href');
        const src = await group.getByRole('img').first().getAttribute('src');
        const text = "current price";
        item = {
            image: src ? parseUrl(base, src, {}) : '',
            title: await group.locator('[data-automation-id=product-title]').innerText(),
            price: (await group.getByText(text).innerText()).slice(text.length),
            link: href ? parseUrl(base, href) : '',
            source: 'Walmart'
        };
    } catch {
    } finally {
        await page.close();
    }

    return item;
}

async function getKrogerItem(browser: Browser, query: string) {
    const base = "https://www.kroger.com"
    const page = await browser.newPage();
    await page.goto(parseUrl(base, '/search', { query }));
    let item: Item | null = null;
    try {
        const productCard = page.locator('.ProductCard').first();
        const href = await productCard.locator('a').first().getAttribute('href');
        const src = await productCard.locator('.kds-Image-img').first().getAttribute('src');
        item = {
            image: src ? parseUrl(base, src, {}) : '',
            title: await productCard.locator('[data-qa=cart-page-item-description]').innerText(),
            price: await productCard.locator('.kds-Price').getAttribute('aria-label') ?? '',
            link: href ? parseUrl(base, href) : '',
            source: 'Kroger'
        };
    } catch {
    } finally {
        await page.close();
    }

    return item;
}

async function getHebItem(browser: Browser, q: string) {
    const base = "https://www.heb.com"
    const page = await browser.newPage();
    await page.goto(parseUrl(base, '/search/', { q }));
    let item: Item | null = null;
    try {
        const productCard = page.locator('[data-qe-id="productCard"]').first();
        const href = await productCard.locator('a').first().getAttribute('href');
        const src = await productCard.locator('picture img').first().getAttribute('src');
        item = {
            image: src ? parseUrl(base, src, {}) : '',
            title: await productCard.locator('[data-qe-id=productTitle]').innerText(),
            price: await productCard.locator('[data-qe-id=productPrice]').innerText(),
            link: href ? parseUrl(base, href) : '',
            source: 'HEB'
        };
    } catch {
    } finally {
        await page.close();
    }

    return item;
}

export async function getItem(formData: FormData): Promise<Item | null> {
    const query: string = formData.get('query') as string;
    const browser = await playwright.launch(process.env.VERCEL ? {
        args: chromium.args,
        executablePath: await getExecutablePath(),
    } : { headless: false });
    const item = await getHebItem(browser, query);
    await browser.close();
    return item;
}