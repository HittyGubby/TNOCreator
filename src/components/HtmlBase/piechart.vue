<template>
  <Pie :data="chartData" :options="mergedOptions" />
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({}),
  },
});

const chartDataRef = ref({
  labels: props.modelValue.labels || [],
  datasets: props.modelValue.datasets || [
    {
      data: [],
      backgroundColor: [],
      borderWidth: 0,
      spacing: 0,
    },
  ],
});

const chartData = computed(() => {
  chartDataRef.value = {
    labels: props.modelValue.labels || [],
    datasets: props.modelValue.datasets || [
      {
        data: [],
        backgroundColor: [],
        borderWidth: 0,
        spacing: 0,
      },
    ],
  };
  return chartDataRef.value;
});

watch(
  () => props.modelValue,
  (newVal) => {
    chartDataRef.value = {
      labels: newVal.labels || [],
      datasets: newVal.datasets || [
        {
          data: [],
          backgroundColor: [],
          borderWidth: 0,
          spacing: 0,
        },
      ],
    };
  },
  { deep: true }
);

const mergedOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  rotation: props.modelValue.options?.rotation || 0,
  ...props.options,
}));

// Expose chartDataRef for saving/restoring
defineExpose({
  chartData: chartDataRef,
});
</script>
