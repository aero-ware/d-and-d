import AeroClient from "@aeroware/aeroclient";
import { prefix, token } from "./config.json";

const client = new AeroClient({
    token,
    prefix,
    useDefaults: true,
});
