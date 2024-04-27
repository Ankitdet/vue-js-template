import axios, {type AxiosInstance} from 'axios';

const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://93.127.172.36:3002/api',
    headers: {
        'Content-type': 'application/json'
    }
});

export default apiClient;
