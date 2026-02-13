import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
});

export const getDevices = async () => {
    const res = await api.get("/");
    return {
        deviceList: res.data.data.deviceList,
        infraredRemoteList: res.data.data.infraredRemoteList,
    };
};


export const sendCommand = async (id: string, cmd: "on" | "off") => {
    const res = await api.post(`/devices/${id}/${cmd}`);
    return res.data;
};

export const getTemperature = async (id: string) => {
    const res = await api.get(`/temperature/${id}`);
    return res.data;
};
