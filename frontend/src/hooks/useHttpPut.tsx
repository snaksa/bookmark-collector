import {useState} from 'react';
import axios from 'axios';
import config from '../config';

export default function useHttpPut() {
    const [response, setResponse] = useState([]);
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const execute = async (url: string, data: { [key: string]: any } = {}) => {
        setIsLoading(true);
        try {
            const response = await axios.put(`${config.apiBaseUrl}${url}`, data);

            const responseData = response.data;
            setResponse(responseData);
            setIsLoading(false);
            
            return responseData;
        } catch (error) {
            setIsLoading(false);
            setError({
                status: error.response.status,
                message: error.response.data.message,
            });
        }
    };

    return { response, error, isLoading, execute };
}