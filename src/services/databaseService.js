import SQLite from 'react-native-sqlite-storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system'; // Import expo-file-system

let dbLocation = 'default';

if (Platform.OS === 'android') {
    dbLocation = `${FileSystem.documentDirectory}productCatalog.db`; // Use FileSystem.documentDirectory
}

const db = SQLite.openDatabase(
    {
        name: 'productCatalog.db',
        location: dbLocation,
    },
    () => console.log('Database opened successfully'),
    error => console.error('Database opening error:', error),
);

// Initialization of the Categories Table
export const initCategoriesTable = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)',
            [],
            () => console.log('Test table created successfully'),
            (_, error) => console.error('Test table creation error:', error),
        );
    });
};

// Get all categories from the database
export const getCategoriesFromDb = () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM categories',
                [],
                (_, results) => {
                    const categories = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        const item = results.rows.item(i);
                        categories.push(item);
                    }
                    resolve(categories);
                },
                (_, error) => reject(error),
            );
        });
    });
};

// Fetch categories from the API and store them in the database
export const fetchCategoriesFromApiAndStore = async (apiEndpoint, token) => {
    try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(apiEndpoint, {
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiCategories = await response.json();

        db.transaction(tx => {
            tx.executeSql('DELETE FROM categories', []); // Clear existing categories
            apiCategories.forEach(category => {
                tx.executeSql(
                    'INSERT INTO categories (id, name, imageUrl) VALUES (?, ?, ?)',
                    [category.id, category.name, category.imageUrl],
                    () => console.log('Category inserted successfully from API'),
                    (_, error) => console.error('Category insertion error from API:', error),
                );
            });
        });
        return apiCategories;
    } catch (error) {
        console.error('Error fetching and storing categories from API:', error);
        return [];
    }
};