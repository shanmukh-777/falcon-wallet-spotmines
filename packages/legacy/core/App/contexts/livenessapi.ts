import axios from 'axios';

const API_BASE_URL = 'https://ssiapi-staging.smartfalcon.io'; // Replace with your actual base URL
const API_KEY = '3646f320-aee6-452f-96f8-23718f3000b6';

const createLivenessSession = async (reqToken: string) => {
  try {
    console.log('Creating liveness session...');
    const response = await axios.post(
      `${API_BASE_URL}/liveness/create`,
      { reqToken },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_KEY,
        },
      }
    );
    console.log('Liveness session created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating liveness session', error);
    throw error;
  }
};

const getLivenessSessionResult = async (sessionId: string) => {
  try {
    console.log('Getting liveness session result...');
    const response = await axios.get(
      `${API_BASE_URL}/liveness/result/${sessionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': API_KEY,
        },
      }
    );
    console.log('Liveness session result:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting liveness session result', error);
    throw error;
  }
};

export { createLivenessSession, getLivenessSessionResult };





// https://ssiapi-staging.smartfalcon.io