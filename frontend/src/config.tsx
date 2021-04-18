interface ConfigProps {
  apiBaseUrl: string;
}

const config: ConfigProps = {
  apiBaseUrl: process.env.REACT_APP_API_URL ?? ''
};

export default config;