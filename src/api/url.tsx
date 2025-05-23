import axios from 'axios';

// export const API_BASE_URL = 'http://67.225.241.58:4004'; 
export const API_BASE_URL = 'https://0p886qg5-4004.inc1.devtunnels.ms'; 
                    
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


const fetchPosts = async () => {
  try {
    const response = await api.get('/admin/getAllPost'); 
    return response.data.map((post: any) => ({
      id: post.id,
      image: post.image || "/default-image.png", 
      content: post.content || "No content available",
      createdAt: post.createdAt || "No date available",
    }));
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

const fetchActiveUsers = async () => {
  const response = await api.get('/admin/getActiveUsers');
  return response.data.totalActiveUsers; // Ensure the API returns { totalActiveUsers: X }
};

const fetchBlockUsers = async () => {
  const response = await api.get('/admin/getBlockUsers');
  return response.data.totalBlockUsers; // Ensure the API returns { totalActiveUsers: X }
};

const fetchPostContent = async () => {
  const response = await api.get('/api/getListPost');
  return response.data; // Ensure it contains the required content
};


// Example POST request function
// export const createUser = async (userData) => {
//   const response = await api.post('/users', userData);
//   return response.data;
// };


export const deleteUser = async (id: string) => {
  try {
    // Send DELETE request to the server with the user ID
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
    return response.data; // Return the response data from the API
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
};
