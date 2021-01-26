import { User } from "discord.js";
import users from "../models/User";

/**
 * Adds an item to a user's inventory, if it is not full.
 * @param user the user to add the item to
 * @param item the item to add
 * @returns whether or not the operation was succesful
 */
export async function addInventoryItem(user: User, item: any) {
    const { inventory } = await users.findById(user.id);
    if (inventory.length >= 36) return false;

    await users.findByIdAndUpdate(user.id, {
        _id: user.id,
        $push: {
            inventory: item,
        },
    });

    return true;
}
