import {AxiosInstanceConfig} from '../base/axios.config';

export interface ApiConfig extends AxiosInstanceConfig {
    model?: string;
}
