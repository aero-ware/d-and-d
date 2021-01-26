import items from "../models/Item";

let shop: any[] = [];

async function refreshShop() {
    shop = [];
    (await items.find()).map((i: any) => {
        switch (i.rarity) {
            case 'legendary':
                return;

            case 'mythic':
                i.cost = Math.floor(Math.random() * (200 - 175)) + 175;
                return Math.floor(Math.random() * 100) < 3 ? shop.push(i) : -1;

            case 'epic':
                i.cost = Math.floor(Math.random() * (175 - 120)) + 120;
                return Math.floor(Math.random() * 100) < 8 ? shop.push(i) : -1;

            case 'rare':
                i.cost = Math.floor(Math.random() * (150 - 90)) + 90;
                return Math.floor(Math.random() * 100) < 12 ? shop.push(i) : -1;

            case 'uncommon':
                i.cost = Math.floor(Math.random() * (100 - 69)) + 69;
                return Math.floor(Math.random() * 100) < 28 ? shop.push(i) : -1;

            case 'common':
                i.cost = Math.floor(Math.random() * (75 - 30)) + 30;
                return Math.floor(Math.random() * 100) < 37 ? shop.push(i) : -1;

            default:
                return -1;
        }
    });
}

refreshShop();
setInterval(refreshShop, 360000);

export function fetchShop(): any[] {
    return shop;
}