export async function getTargetData(term: string) {
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