/*
 * i have the map, i'll finish this later
 */

type Location = {
    name: string;
    forward?: string;
    right?: string;
    backward?: string;
    left?: string;
};

const locations = new Map<string, Location>();

const start: Location = makeLocation({
    name: "start",
    forward: "mountains",
    right: "forest",
    left: "village",
});

const village: Location = makeLocation({
    name: "village",
    forward: "castle",
    backward: "start",
    left: "tower",
});

const tower: Location = makeLocation({
    name: "tower",
    right: "village",
});

const forest: Location = makeLocation({
    name: "forest",
    forward: "town",
    right: "mountains",
    backward: "start",
    left: "pond",
});

const mountains: Location = makeLocation({
    name: "mountains",
    forward: "volcano",
    right: "castle",
    backward: "start",
    left: "forest",
});

const castle: Location = makeLocation({
    name: "castle",
    forward: "volcano",
    right: "mountains",
    backward: "village",
    left: "river",
});

const pond: Location = makeLocation({
    name: "pond",
    backward: "forest",
});

const volcano: Location = makeLocation({
    name: "volcano",
    backward: "castle",
    right: "mountains",
    forward: "lava",
    left: "river",
});

const river: Location = makeLocation({
    name: "river",
    forward: "ocean",
    right: "volcano",
    backward: "castle",
    left: "stream",
});

const stream: Location = makeLocation({
    name: "stream",
    right: "river",
});

const town: Location = makeLocation({
    name: "town",
    forward: "desert",
    right: "lake",
    backward: "forest",
    left: "fortress",
});

const lava: Location = makeLocation({
    name: "lava",
    backward: "volcano",
});

const lake: Location = makeLocation({
    name: "lake",
    backward: "town",
});

const fortress: Location = makeLocation({
    name: "fortress",
    forward: "rocks",
    right: "dam",
    backward: "town",
    left: "desert",
});

const dam: Location = makeLocation({
    name: "dam",
    left: "fortress",
    right: "ocean",
});

const ocean: Location = makeLocation({
    name: "ocean",
    forward: "island",
    backward: "river",
    left: "dam",
});

const desert: Location = makeLocation({
    name: "desert",
    forward: "oasis",
    backward: "town",
    left: "fortress",
});

const cave: Location = makeLocation({
    name: "cave",
    backward: "rocks",
});

const island: Location = makeLocation({
    name: "island",
    forward: "end",
    backward: "ocean",
});

const oasis: Location = makeLocation({
    name: "oasis",
    forward: "cliff",
    backward: "desert",
    left: "rocks",
});

const cliff: Location = makeLocation({
    name: "cliff",
    forward: "beach",
    backward: "oasis",
    left: "rocks",
});

const beach: Location = makeLocation({
    name: "beach",
    backward: "cliff",
});

const end: Location = makeLocation({
    name: "end",
    backward: "island",
});

function makeLocation(location: Location) {
    locations.set(location.name, location);
    return location;
}

export default locations;
