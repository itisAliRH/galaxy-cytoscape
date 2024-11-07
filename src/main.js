import { createApp, h } from "vue";
import App from "./App.vue";
import "./style.css";

const dataIncoming = {
    visualization_config: {
        dataset_url: "MY_DATASET_ID",
        dataset_id: "MY_DATASET_URL",
        settings: {},
    },
};

const xml = "MY_VISUALIZATION.xml";

// Attach config to the data-incoming attribute
const appElement = document.querySelector("#app");
appElement.setAttribute("data-incoming", JSON.stringify(dataIncoming));

createApp({
    render: () => h(App, { credentials: process.env.credentials, xml: xml }),
}).mount("#app");
