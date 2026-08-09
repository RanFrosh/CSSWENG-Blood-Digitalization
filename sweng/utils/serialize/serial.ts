export function bigintToStr<something>(data: something): something {
    return JSON.parse(JSON.stringify(data, (_, v) =>
        typeof v === 'bigint' ? v.toString() : v
    ));
}