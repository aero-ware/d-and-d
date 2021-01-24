import AeroClient from "@aeroware/aeroclient";
import { prefix, token } from "./config.json";
import setup from "./setup";

(async () => {
    const client = new AeroClient({
        token,
        prefix,
        useDefaults: true,
    });

    await setup(client);
})();
