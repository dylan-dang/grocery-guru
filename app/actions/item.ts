'use server';

import { URLSearchParams } from 'url';
import { chromium as playwright, selectors } from 'playwright';
import chromium from '@sparticuz/chromium-min';

export interface Item {
    link: string;
    price: string;
    image: string;
    title: string;
    source: string;
}

interface BrowserSingleton {
    (): Promise<string>;
    _instance?: string;
}

const execPath: BrowserSingleton = async () => {
    if (!execPath._instance) {
        execPath._instance = await chromium.executablePath(
            `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
        );
    }
    return execPath._instance;
};

async function createBrowser() {
    return playwright.launch(
        process.env.VERCEL
            ? {
                args: chromium.args,
                executablePath: await execPath(),
            }
            : { headless: false }
    );
}

function parseUrl(base: string, rel: string, params?: ConstructorParameters<typeof URLSearchParams>[0]): string {
    const url = new URL(rel, base);
    if (params) {
        const searchParams = new URLSearchParams(params);
        url.search = searchParams.toString();
    }
    return url.toString();
}

export async function testTarget(searchTerm: string): Promise<Item> {
    const browser = await createBrowser();
    const base = 'https://www.target.com';
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.goto(parseUrl(base, '/s', { searchTerm }));
    return {
        title: await page.content(),
        link: '',
        image: '',
        price: '',
        source: ''
    };
}

export async function getTargetItem(searchTerm: string) {
    let item: Item | null = null;
    selectors.setTestIdAttribute('data-test');
    const browser = await createBrowser();
    try {
        const base = 'https://www.target.com';
        const page = await browser.newPage();
        page.setDefaultTimeout(10000);
        await page.goto(parseUrl(base, '/s', { searchTerm }));
        const productCard = page.getByTestId('@web/ProductCard/ProductCardVariantDefault').first();
        const href = await productCard.locator('a').first().getAttribute('href');
        const title = await productCard.locator('[data-test=product-title]').innerText();
        const src = await productCard.getByAltText(title).first().getAttribute('src');
        item = {
            image: src ? parseUrl(base, src, {}) : '',
            title,
            price: await productCard.locator('[data-test=current-price]').innerText(),
            link: href ? parseUrl(base, href) : '',
            source: 'Target',
        };
    } finally {
        await browser.close();
    }
    return item;
}

export async function getWalmartItem(q: string) {
    let item: Item | null = null;
    const browser = await createBrowser();
    try {
        const base = 'https://www.walmart.com';
        const page = await browser.newPage();
        page.setDefaultTimeout(10000);
        await page.goto(parseUrl(base, '/search', { q }));
        const group = page.locator('[role=group]:has(div[data-testid=list-view])').first();
        const href = await group.locator('a').first().getAttribute('href');
        const src = await group.getByRole('img').first().getAttribute('src');
        const text = 'current price';
        item = {
            image: src ? parseUrl(base, src, {}) : '',
            title: await group.locator('[data-automation-id=product-title]').innerText(),
            price: (await group.getByText(text).innerText()).slice(text.length),
            link: href ? parseUrl(base, href) : '',
            source: 'Walmart',
        };
    } finally {
        await browser.close();
    }
    return item;

}

export async function getHebItem(q: string) {
    let item: Item | null = null;
    const browser = await createBrowser();
    try {
        const base = 'https://www.heb.com';
        const page = await browser.newPage();
        page.setDefaultTimeout(10000);
        await page.goto(parseUrl(base, '/search/', { q }));
        const productCard = page.locator('[data-qe-id="productCard"]').first();
        const href = await productCard.locator('a').first().getAttribute('href');
        const src = await productCard.locator('picture img').first().getAttribute('src');
        item = {
            image: src ? parseUrl(base, src, {}) : '',
            title: await productCard.locator('[data-qe-id=productTitle]').innerText(),
            price: await productCard.locator('[data-qe-id=productPrice]').innerText(),
            link: href ? parseUrl(base, href) : '',
            source: 'HEB',
        };
    } finally {
        await browser.close();
    }
    return item;
}
