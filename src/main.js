import { createApp, h } from "vue";
import "./style.css";
import App from "./App.vue";

const config = {
    credentials: process.env.credentials,
    dataset_id: null,
    dataset_url: "MY_DATASET_URL",
    settings: {},
};

const xml = "MY_VISUALIZATION.xml";

createApp({
    render: () => h(App, { config: config, xml: xml }),
}).mount("#app");
