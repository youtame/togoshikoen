// stores/switchbot.ts
import { defineStore } from "pinia";
import { getDevices as apiGetDevices, sendCommand as apiSendCommand, getTemperature as apiGetTemperature } from "../api/switchbot";

type Device = {
    deviceId: string;
    deviceName: string;
    deviceType: string;
    hubDeviceId: string;
};


export const useSwitchBotStore = defineStore("switchbot", {
    state: () => ({
        devices: [] as Device[],
        selectedDeviceId: null as string | null,
        temperature: null as number | null,
        humidity: null as number | null,
        battery: null as number | null,
        loading: false,
        temperatureTimer: null as ReturnType<typeof setInterval> | null,
        lastUpdated: null as Date | null,
    }),
    actions: {
        async fetchDevices() {
            try {
                const data = await apiGetDevices();
                this.devices = [...data.deviceList, ...data.infraredRemoteList];
            } catch (err) {
                console.error(err);
            }
        },
        async handleCommand(id: string, cmd: "on" | "off") {
            this.loading = true;
            try {
                await apiSendCommand(id, cmd);
                alert(`Command sent: ${cmd}`);
            } catch (err) {
                console.error(err);
                alert("Command failed");
            } finally {
                this.loading = false;
            }
        },
        async fetchTemperature(id: string) {
            try {
                console.log("temperature fetched", new Date());
                const data = await apiGetTemperature(id);
                this.temperature = data.temperature;
                this.humidity = data.humidity;
                this.battery = data.battery;
                this.selectedDeviceId = id;

                this.lastUpdated = new Date();
            } catch (err) {
                console.error(err);
            }
        },
        stopTemperaturePolling() {
            if (this.temperatureTimer) {
                clearInterval(this.temperatureTimer);
                this.temperatureTimer = null;
            }
        },
        startTemperaturePolling() {
            if (!this.selectedDeviceId) return;

            this.stopTemperaturePolling();

            this.temperatureTimer = setInterval(() => {
                if (this.selectedDeviceId) {
                    this.fetchTemperature(this.selectedDeviceId);
                }
            }, 3000000); // 3000000
        },
    },
});
