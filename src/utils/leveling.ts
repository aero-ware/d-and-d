import { User } from "discord.js";
import users from "../models/User";

type LevelInfo = {
    id: string;
    exp: number;
    level: number;
};

/**
 * Returns the required amount of EXP the user needs to level up.
 * @param level the level of the user
 * @returns the amount of EXP required to level up
 */
export function requiredEXP(level: number): number {
    return level * level * 100;
}

/**
 * Adds the number of EXP specified to the user.
 * @param user the User to add EXP to
 * @param exp the number of EXP to add
 * @returns information about the User's updated level and EXP
 */
export async function addEXP(user: User, exp: number): Promise<LevelInfo> {
    const userInfo = await users.findByIdAndUpdate(
        user.id,
        {
            $inc: { exp },
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    );

    let xp = userInfo.exp;
    let level = userInfo.level;

    let needed = requiredEXP(level);
    let newInfo;

    while (xp >= needed) {
        level++;
        xp -= needed;

        newInfo = await users.findByIdAndUpdate(user.id, {
            level,
            exp: xp,
        });

        needed = requiredEXP(level);
    }

    if (newInfo) {
        return {
            id: user.id,
            exp: newInfo.exp,
            level: newInfo.level,
        };
    }

    return {
        id: userInfo.id,
        exp: userInfo.exp,
        level: userInfo.level,
    };
}

/**
 * Adds the specified amount of levels to the user.
 * @param user the user to add levels to
 * @param levels the number of levels to add
 * @returns information about the User's updated levels and EXP
 */
export async function addLevel(user: User, levels: number): Promise<LevelInfo> {
    const userInfo = await users.findByIdAndUpdate(
        user.id,
        {
            $inc: {
                level: levels,
            },
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    );

    return {
        id: userInfo.id,
        exp: userInfo.exp,
        level: userInfo.level,
    };
}

/**
 * Returns information about the User's level and EXP.
 * @param user the User to get level data for
 * @returns information about the User's level and EXP
 */
export async function getInfo(user: User): Promise<LevelInfo> {
    const userInfo = await users.findById(user.id);

    return {
        id: userInfo.id,
        exp: userInfo.exp,
        level: userInfo.level,
    };
}

/**
 * Sets level and EXP of a user.
 * @param info object with the information to set
 * @returns the same object given
 */
export async function setInfo(info: LevelInfo): Promise<LevelInfo> {
    await users.findByIdAndUpdate(
        info.id,
        {
            ...info,
        },
        {
            upsert: true,
            setDefaultsOnInsert: true,
        }
    );

    return info;
}
