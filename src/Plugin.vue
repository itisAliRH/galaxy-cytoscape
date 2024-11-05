<script setup lang="ts">
import axios from "axios";
import Cytoscape from "cytoscape";
import { onMounted, onUnmounted, ref, watch } from "vue";

import { parse_sif, runSearchAlgorithm, runTraversalType, styleGenerator } from "./utils";

interface Props {
    datasetId: string;
    datasetUrl: string;
    root: string;
    settings: object;
    specs?: object;
    tracks: unknown[];
}

const props = defineProps<Props>();

const viewport = ref(null);

const dataset = ref(null);
const cytoscape = ref(null);

async function render() {
    await getDataset();

    cytoscape.value = Cytoscape({
        container: viewport.value,
        elements: dataset.value,
        layout: {
            name: props.settings.layout_name,
            idealEdgeLength: 100,
            nodeOverlap: 20,
        },
        minZoom: 0.1,
        maxZoom: 20,
        style: styleGenerator(props.settings),
    });

    if (props.settings.search_algorithm === "kruskal") {
        cytoscape.value.elements().kruskal().edges().addClass("searchpath");
    }

    cytoscape.value.on("tap", "node", (e) => {
        const ele = e.target;

        const search_algorithm = props.settings.search_algorithm;
        const traversal_type = props.settings.graph_traversal;

        if (search_algorithm) {
            runSearchAlgorithm(cytoscape.value, ele.id(), search_algorithm);
        } else if (traversal_type) {
            runTraversalType(cytoscape.value, ele.id(), traversal_type);
        }
    });

    window.addEventListener("resize", function () {
        cytoscape.value
            .layout({
                name: props.settings.layout_name,
            })
            .run();
    });
}

async function getDataset() {
    const { data } = await axios.get(props.datasetUrl);

    if (dataset.file_ext === "sif") {
        dataset.value = parse_sif(data).content;
    } else {
        dataset.value = data.elements ? data.elements : data;
    }
}

onMounted(() => {
    render();
});

watch(
    () => props,
    () => render(),
    { deep: true },
);

onUnmounted(() => {
    window.removeEventListener("resize", function () {
        console.log("Removing resize event listener");
    });

    cytoscape.value.destroy();
});
</script>

<template>
    <div class="min-h-screen" ref="viewport"></div>
</template>
