"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locations = new Map();
const start = makeLocation({
    name: "start",
    forward: "mountains",
    right: "forest",
    left: "village",
});
const village = makeLocation({
    name: "village",
    forward: "castle",
    backward: "start",
    left: "tower",
});
const tower = makeLocation({
    name: "tower",
    right: "village",
});
const forest = makeLocation({
    name: "forest",
    forward: "town",
    right: "mountains",
    backward: "start",
    left: "pond",
});
const mountains = makeLocation({
    name: "mountains",
    forward: "volcano",
    right: "castle",
    backward: "start",
    left: "forest",
});
const castle = makeLocation({
    name: "castle",
    forward: "volcano",
    right: "mountains",
    backward: "village",
    left: "river",
});
const pond = makeLocation({
    name: "pond",
    backward: "forest",
});
const volcano = makeLocation({
    name: "volcano",
    backward: "castle",
    right: "mountains",
    forward: "lava",
    left: "river",
});
const river = makeLocation({
    name: "river",
    forward: "ocean",
    right: "volcano",
    backward: "castle",
    left: "stream",
});
const stream = makeLocation({
    name: "stream",
    right: "river",
});
const town = makeLocation({
    name: "town",
    forward: "desert",
    right: "lake",
    backward: "forest",
    left: "fortress",
});
const lava = makeLocation({
    name: "lava",
    backward: "volcano",
});
const lake = makeLocation({
    name: "lake",
    backward: "town",
});
const fortress = makeLocation({
    name: "fortress",
    forward: "rocks",
    right: "dam",
    backward: "town",
    left: "desert",
});
const dam = makeLocation({
    name: "dam",
    left: "fortress",
    right: "ocean",
});
const ocean = makeLocation({
    name: "ocean",
    forward: "island",
    backward: "river",
    left: "dam",
});
const desert = makeLocation({
    name: "desert",
    forward: "oasis",
    backward: "town",
    left: "fortress",
});
const cave = makeLocation({
    name: "cave",
    backward: "rocks",
});
const island = makeLocation({
    name: "island",
    forward: "end",
    backward: "ocean",
});
const oasis = makeLocation({
    name: "oasis",
    forward: "cliff",
    backward: "desert",
    left: "rocks",
});
const cliff = makeLocation({
    name: "cliff",
    forward: "beach",
    backward: "oasis",
    left: "rocks",
});
const beach = makeLocation({
    name: "beach",
    backward: "cliff",
});
const end = makeLocation({
    name: "end",
    backward: "island",
});
function makeLocation(location) {
    locations.set(location.name, location);
    return location;
}
exports.default = locations;
