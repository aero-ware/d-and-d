import items from "../models/Item";
import { randInt } from "./random";

const shop: any[] = [];

async function refreshShop() {
    shop.length = 0;

    (await items.find()).map((i: any) => {
        switch (i.rarity) {
            case "common":
                i.cost = randInt(40, 70);
                return Math.floor(Math.random() * 100) < 36 ? shop.push(i) : -1;

            case "uncommon":
                i.cost = randInt(70, 100);
                return Math.floor(Math.random() * 100) < 24 ? shop.push(i) : -1;

            case "rare":
                i.cost = randInt(100, 150);
                return Math.floor(Math.random() * 100) < 12 ? shop.push(i) : -1;

            case "epic":
                i.cost = randInt(150, 180);
                return Math.floor(Math.random() * 100) < 8 ? shop.push(i) : -1;

            case "mythic":
                i.cost = randInt(180, 210);
                return Math.floor(Math.random() * 100) < 4 ? shop.push(i) : -1;

            case "legendary":
                return -1;

            default:
                return -1;
        }
    });

    shop.length = 6;
}

refreshShop();
setInterval(refreshShop, 360000);

export function fetchShop(): any[] {
    return shop;
}
