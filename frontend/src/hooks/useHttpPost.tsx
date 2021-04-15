import axios from 'axios';
import React, { useEffect } from 'react';

const baseUrl = 'https://0853c6yht3.execute-api.us-east-1.amazonaws.com/prod/';

export default function useHttpPost(url: string) {
    const [response, setResponse] = React.useState([]);
    const [error, setError] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    
    const execute = async (data: { [key: string]: any } = {}) => {
        setIsLoading(true);
        try {
            const response = await axios(`${baseUrl}${url}`, {
                method: 'POST',
                data: data
            });

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