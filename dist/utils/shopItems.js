"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchShop = void 0;
const Item_1 = __importDefault(require("../models/Item"));
const random_1 = require("./random");
const shop = [];
function refreshShop() {
    return __awaiter(this, void 0, void 0, function* () {
        shop.length = 0;
        (yield Item_1.default.find()).map((i) => {
            switch (i.rarity) {
                case "common":
                    i.cost = random_1.randInt(40, 70);
                    i.stock = random_1.randInt(24, 32);
                    return Math.floor(Math.random() * 100) < 36 ? shop.push(i) : -1;
                case "uncommon":
                    i.cost = random_1.randInt(70, 100);
                    i.stock = random_1.randInt(14, 20);
                    return Math.floor(Math.random() * 100) < 24 ? shop.push(i) : -1;
                case "rare":
                    i.cost = random_1.randInt(100, 150);
                    i.stock = random_1.randInt(6, 10);
                    return Math.floor(Math.random() * 100) < 12 ? shop.push(i) : -1;
                case "epic":
                    i.cost = random_1.randInt(150, 180);
                    i.stock = random_1.randInt(2, 4);
                    return Math.floor(Math.random() * 100) < 8 ? shop.push(i) : -1;
                case "mythic":
                    i.cost = random_1.randInt(180, 210);
                    i.stock = random_1.randInt(1, 2);
                    return Math.floor(Math.random() * 100) < 4 ? shop.push(i) : -1;
                case "legendary":
                    return -1;
                default:
                    return -1;
            }
        });
        shop.length = 8;
    });
}
refreshShop();
setInterval(refreshShop, 360000);
function fetchShop() {
    return shop;
}
exports.fetchShop = fetchShop;
