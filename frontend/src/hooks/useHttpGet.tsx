import axios from 'axios';
import React, { useEffect } from 'react';

const baseUrl = 'https://s6yse3f9o6.execute-api.us-east-1.amazonaws.com/prod/';

export default function useHttpGet(url: string, params: { [key: string]: string | number } = {}) {
    const [response, setResponse] = React.useState([]);
    const [error, setError] = React.useState<object | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const fetch = async () => {
        setIsLoading(true);
        try {
            const response = await axios(`${baseUrl}${url}`, {
                method: 'GET',
                params: params,
            });
            const data = response.data;
            setResponse(data);
            setIsLoading(false);
        } catch (error) {
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