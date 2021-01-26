import { User } from "discord.js";
import users from "../models/User";

/**
 * Returns the balance of the specificed user.
 * @param user the user to get the balance of
 */
export async function getBal(user: User): Promise<number> {
    const { balance } = await users.findById(user.id);
    return balance || 0;
}

/**
 * Adds the given number of coins to the user. Provide a negative number to remove coins.
 * @param user the user to add balance to
 * @param coins the number of coins to add
 * @returns the new number of coins the user has
 */
export async function addBal(user: User, coins: number): Promise<number> {
    if (!Number.isInteger(coins)) throw new TypeError("parameter 'coins' must be an integer.");
    const { balance } = await users.findByIdAndUpdate(
        user.id,
        {
            _id: user.id,
            $inc: {
                balance: coins,
            },
        },
        {
            new: true,
            setDefaultsOnInsert: true,
        }
    );

    return balance;
}
