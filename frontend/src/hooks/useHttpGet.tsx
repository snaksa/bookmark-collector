import {useEffect, useState} from 'react';
import axios from 'axios';
import config from '../config';

export default function useHttpGet(url: string, params: { [key: string]: string | number } = {}, lazyFetch = false) {
    const [response, setResponse] = useState([]);
    const [error, setError] = useState<object | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetch = async (passedUrl: string = '') => {
        const requestUrl = passedUrl ? passedUrl : url;

        setIsLoading(true);
        try {
            const response = await axios(`${config.apiBaseUrl}${requestUrl}`, {
                method: 'GET',
                params: params,
            });
            const data = response.data;
            setResponse(data);
            setIsLoading(false);

            return data;
        } catch (error) {
            console.log(JSON.parse(JSON.stringify(error)));
            setError({
                status: error.response.status,
                message: error.response.data.message,
            });
        }

        return [];
    };

    useEffect(() => {
        if(!lazyFetch) {
            fetch();
        }
    }, []);

    return { response, error, isLoading, fetch };
}