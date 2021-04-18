import React, { useEffect } from 'react';
import axios from 'axios';
import config from '../config';

export default function useHttpGet(url: string, params: { [key: string]: string | number } = {}) {
    const [response, setResponse] = React.useState([]);
    const [error, setError] = React.useState<object | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const fetch = async () => {
        setIsLoading(true);
        try {
            const response = await axios(`${config.apiBaseUrl}${url}`, {
                method: 'GET',
                params: params,
            });
            const data = response.data;
            setResponse(data);
            setIsLoading(false);
        } catch (error) {
            console.log(JSON.parse(JSON.stringify(error)));
            setError({
                status: error.response.status,
                message: error.response.data.message,
            });
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    return { response, error, isLoading, refresh: fetch };
}