import axios from './axios';

const API_URL = '/api/upload';

export const uploadSingleImage = async (file, folder = 'images', token) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const config = {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  };
  
  const response = await axios.post(`${API_URL}/single`, formData, config);
  return response.data;
};

export const uploadMultipleImages = async (files, folder = 'images', token) => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('images', file);
  });
  formData.append('folder', folder);

  const config = {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  };
  
  const response = await axios.post(`${API_URL}/multiple`, formData, config);
  
  // Fix: Extract URLs from the files array
  return {
    ...response.data,
    urls: response.data.files.map(file => file.url)
  };
};

export const deleteImage = async (imageUrl, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  
  const response = await axios.delete(`${API_URL}/delete`, {
    ...config,
    data: { imageUrl }
  });
  return response.data;
};

export const uploadAPI = {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage
};