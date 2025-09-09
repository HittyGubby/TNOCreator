<template>
  <Pie :data="chartData" :options="mergedOptions" />
</template>

<script>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

export default {
  name: 'PieChart',
  components: { Pie },
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const chartData = computed(() => ({
      labels: props.modelValue.labels || [],
      datasets: props.modelValue.datasets || [{
        data: [],
        backgroundColor: [],
        borderWidth: 0,
        spacing: 0
      }]
    }))

    const mergedOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      rotation: props.modelValue.options?.rotation || 0,
      ...props.options
    }))

    return {
      chartData,
      mergedOptions
    }
  }
}
</script>