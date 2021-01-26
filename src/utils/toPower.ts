const toPower: {
    [rarity: string]: number;
} = {
    common: 1,
    uncommon: 1.1,
    rare: 1.25,
    epic: 1.5,
    mythic: 2,
    legendary: 3,
};

export default toPower;
