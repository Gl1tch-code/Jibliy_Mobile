// In categoryService.js
export const fetchCategoriesFromApi = async (apiEndpoint, token) => {
  try {
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(apiEndpoint, {
          headers: headers,
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiCategories = await response.json();
      console.log("API Categories", apiCategories);
      return apiCategories;
  } catch (error) {
      console.error('Error fetching categories from API:', error);
      return [];
  }
};