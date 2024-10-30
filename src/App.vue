<script setup>
import { GalaxyCharts } from "galaxy-charts";
import Plugin from "@/Plugin.vue";
const config = {
    dataset_id: null,
    dataset_url: "MY_DATASET_URL",
    settings: {},
};
</script>

<template>
    <GalaxyCharts :config="config" xml="MY_VISUALIZATION.xml">
        <template #default="{ datasetId, datasetUrl, root, settings, specs, tracks }">
            <Plugin
                :dataset-id="datasetId"
                :dataset-url="datasetUrl"
                :root="root"
                :settings="settings"
                :specs="specs"
                :tracks="tracks" />
        </template>
    </GalaxyCharts>
</template>
