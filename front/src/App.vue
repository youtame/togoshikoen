<!-- App.vue -->
<template>
  <div style="padding: 20px">
    <h1>SwitchBot Devices</h1>
      <v-container class="fill-height d-flex align-center justify-center">
        <v-card width="400" elevation="8" class="pa-6 text-center">
          <div class="text-h4 font-weight-bold">
            {{ now.toLocaleTimeString() }}
          </div>
        </v-card>
      </v-container>
    <ul>
      <li v-for="device in store.devices" :key="device.deviceId">
        <strong>{{ device.deviceName }}</strong> <span v-if="device.deviceType">({{ device.deviceType }})</span>
        <div v-if="store.selectedDeviceId && device.deviceType === 'Meter'" style="margin-top: 20px">
          <h2>温湿度情報</h2>
          <p v-if="store.lastUpdated">
            最終更新: {{ formattedTime }}
          </p>

          <p>温度: {{ store.temperature }}°C</p>
          <p>湿度: {{ store.humidity }}%</p>
          <p>バッテリー: {{ store.battery }}%</p>
        </div>
        <span v-if="device.deviceType !== 'Meter' && device.deviceType !== 'Hub Mini2'">
          <button @click="store.handleCommand(device.deviceId, 'on')">ON</button>
          <button @click="store.handleCommand(device.deviceId, 'off')">OFF</button>
        </span>
      </li>
    </ul>

    <div v-if="store.loading">処理中...</div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed} from "vue";
import { useSwitchBotStore } from "./stores/switchbot";

const store = useSwitchBotStore();

const formattedTime = computed(() => {
  if (!store.lastUpdated) return "";
  return store.lastUpdated.toLocaleTimeString();
});

const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

const updateTime = () => {
  now.value = new Date()
}

onMounted(async () => {
  await store.fetchDevices();

  const meter = store.devices.find(
    (d) => d.deviceType === "Meter"
  );

  if (meter) {
    await store.fetchTemperature(meter.deviceId);
    store.startTemperaturePolling();
  }

  updateTime()
  timer = setInterval(updateTime, 1000)
});

onUnmounted(() => {
  store.stopTemperaturePolling();
  if (timer) clearInterval(timer)
});


const selectDevice = async (id: string) => {
  await store.fetchTemperature(id);
  store.startTemperaturePolling();
};
</script>