import React from 'react';
import axios from 'axios';
import config from '../config';

export default function useHttpDelete() {
    const [response, setResponse] = React.useState([]);
    const [error, setError] = React.useState<object | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const execute = async (url: string) => {
        setIsLoading(true);
        try {
            const response = await axios(`${config.apiBaseUrl}${url}`, {
                method: 'DELETE',
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

    return { response, error, isLoading, deleteAction: execute };
}