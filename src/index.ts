import AeroClient from "@aeroware/aeroclient";
import { prefix, token } from "./config.json";

const client = new AeroClient({
    token,
    prefix,
    useDefaults: true,
});

/* Rename 'setprefix' to 'prefix' and delete commands we don't need */
const _ = client.commands.get("setprefix");
client.commands.delete("setprefix");
client.commands.set("prefix", _!);
client.commands.delete("setlocale");
client.commands.delete("disable");
client.commands.delete("enable");
