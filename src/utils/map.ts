/*
 * i have the map, i'll finish this later
 */

type Location = {
    name: string;
    forward?: Location;
    right?: Location;
    backward?: Location;
    left?: Location;
};

const locations = new Map<string, Location>();

const start: Location = makeLocation({
    name: "start",
});

const village: Location = makeLocation({
    name: "village",
    backward: start,
});

start.left = village;

const tower: Location = makeLocation({
    name: "tower",
    right: village,
});

village.left = tower;

const forest: Location = makeLocation({
    name: "forest",
    backward: start,
});

start.right = forest;

const mountains: Location = makeLocation({
    name: "mountains",
    backward: start,
});

start.forward = mountains;

const castle: Location = makeLocation({
    name: "castle",
});

village.forward = castle;

const pond: Location = makeLocation({
    name: "pond",
});

const volcano: Location = makeLocation({
    name: "volcano",
});

const river: Location = makeLocation({
    name: "river",
});

const stream: Location = makeLocation({
    name: "stream",
});

const town: Location = makeLocation({
    name: "town",
});

const lava: Location = makeLocation({
    name: "lava",
});

const lake: Location = makeLocation({
    name: "lake",
});

const fortress: Location = makeLocation({
    name: "fortress",
});

const dam: Location = makeLocation({
    name: "dam",
});

const ocean: Location = makeLocation({
    name: "ocean",
});

const desert: Location = makeLocation({
    name: "desert",
});

const cave: Location = makeLocation({
    name: "cave",
});

const island: Location = makeLocation({
    name: "island",
});

const oasis: Location = makeLocation({
    name: "oasis",
});

const cliff: Location = makeLocation({
    name: "cliff",
});

const beach: Location = makeLocation({
    name: "beach",
});

const end: Location = makeLocation({
    name: "end",
});

function makeLocation(location: Location) {
    locations.set(location.name, location);
    return location;
}

export default locations;
