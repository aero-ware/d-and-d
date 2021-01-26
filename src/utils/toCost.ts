const toCost: {
    [rarity: string]: number;
} = {
    common: 25,
    uncommon: 40,
    rare: 60,
    epic: 80,
    mythic: 100,
    legendary: 250,
};

export default toCost;
