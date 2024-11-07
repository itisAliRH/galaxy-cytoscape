import { createApp, h } from "vue";
import App from "./App.vue";
import "./style.css";

import { parseXML } from "galaxy-charts-xml-parser";

async function main() {
    // Build the incoming data object
    const dataIncoming = {
        visualization_config: {
            dataset_url: "MY_DATASET_ID",
            dataset_id: "MY_DATASET_URL",
            settings: {},
        },
        visualization_plugin: await parseXML("MY_VISUALIZATION.xml"),
    };

    // Attach config to the data-incoming attribute
    const appElement = document.querySelector("#app");
    appElement.setAttribute("data-incoming", JSON.stringify(dataIncoming));

    // Mount the app
    createApp({
        render: () => h(App, { credentials: process.env.credentials }),
    }).mount("#app");
}

main();
