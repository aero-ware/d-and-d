import items from "../models/Item";
import { randInt } from "./random";

let shop: any[] = [];

async function refreshShop() {
    shop = [];
    (await items.find()).map((i: any) => {
        switch (i.rarity) {
            case 'legendary':
                return;

            case 'mythic':
                i.cost = randInt(175, 200);
                return Math.floor(Math.random() * 100) < 3 ? shop.push(i) : -1;

            case 'epic':
                i.cost = randInt(120, 175);
                return Math.floor(Math.random() * 100) < 8 ? shop.push(i) : -1;

            case 'rare':
                i.cost = randInt(90, 150);
                return Math.floor(Math.random() * 100) < 12 ? shop.push(i) : -1;

            case 'uncommon':
                i.cost = randInt(69, 100);
                return Math.floor(Math.random() * 100) < 28 ? shop.push(i) : -1;

            case 'common':
                i.cost = randInt(30, 75);
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