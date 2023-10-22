'use server';

import { URLSearchParams } from 'url';
import { chromium as playwright, Browser, selectors } from 'playwright';
import chromium from '@sparticuz/chromium-min';

export interface Item {
    link: string;
    price: string;
    image: string;
    title: string;
    source: string;
}

interface BrowserSingleton {
    (): Promise<Browser>;
    _instance?: Browser;
}

const getBrowser: BrowserSingleton = async () => {
    if (!getBrowser._instance) {
        getBrowser._instance = await playwright.launch(
            process.env.VERCEL
                ? {
                    args: chromium.args,
                    executablePath: await chromium.executablePath(
                        `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
                    ),
                }
                : { headless: false }
        );
    }
    return getBrowser._instance;
};

function parseUrl(base: string, rel: string, params?: ConstructorParameters<typeof URLSearchParams>[0]): string {
    const url = new URL(rel, base);
    if (params) {
        const searchParams = new URLSearchParams(params);
        url.search = searchParams.toString();
    }
    return url.toString();
}


export async function getTargetItem(searchTerm: string) {
    selectors.setTestIdAttribute('data-test');
    const browser = await getBrowser();
    const base = 'https://www.target.com';
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    let item: Item | null = null;
    try {
        await page.goto(parseUrl(base, '/s', { searchTerm }));
        const productCard = page.getByTestId('@web/ProductCard/ProductCardVariantDefault').first();
        const href = await productCard.locator('a').first().getAttribute('href');
        const title = await productCard.locator('[data-test=product-title]').innerText()
        const src = await productCard.getByAltText(title).first().getAttribute('src');
        console.log(src);
        item = {
            image: src ? parseUrl(base, src, {}) : '',
            title,
            price: await productCard.locator('[data-test=current-price]').innerText(),
            link: href ? parseUrl(base, href) : '',
            source: 'Target',
        };
    }
    catch { }

    page.close();
    return item;
}

export async function getWalmartItem(q: string) {
    const browser = await getBrowser();
    const base = 'https://www.walmart.com';
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.goto(parseUrl(base, '/search', { q }));
    let item: Item | null = null;
    try {
        const group = page.getByRole('group').first();
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
    } catch {
    }

    page.close();
    return item;
}

// export async function getKrogerItem(query: string) {
//     const browser = await getBrowser();
//     const base = 'https://www.kroger.com';
//     const page = await browser.newPage();
//     page.setDefaultTimeout(10000);
//     await page.goto(parseUrl(base, '/search', { query }));
//     let item: Item | null = null;
//     try {
//         const productCard = page.locator('.ProductCard').first();
//         const href = await productCard.locator('a').first().getAttribute('href');
//         const src = await productCard.locator('.kds-Image-img').first().getAttribute('src');
//         item = {
//             image: src ? parseUrl(base, src, {}) : '',
//             title: await productCard.locator('[data-qa=cart-page-item-description]').innerText(),
//             price: (await productCard.locator('.kds-Price').getAttribute('aria-label')) ?? '',
//             link: href ? parseUrl(base, href) : '',
//             source: 'Kroger',
//         };
//     } catch {
//     }

//     page.close();
//     return item;
// }

export async function getHebItem(q: string) {
    const browser = await getBrowser();
    const base = 'https://www.heb.com';
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
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
            source: 'HEB',
        };
    } catch {
    }
    page.close();
    return item;
}

// export async function getItems(formData: FormData): Promise<Item[]> {
//     const query: string = formData.get('query') as string;

//     const items = await Promise.all([getTargetItem, getHebItem, getKrogerItem, getWalmartItem].map((f) => f(browser, query)));
//     await browser.close();
//     return items.filter((item) => item != null) as Item[];
// }
