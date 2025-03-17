import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { storage } from './utils/localStorage';

// Initialize default data if not exists
const initializeData = () => {
  const currentDateTime = '2025-03-10 11:10:55'; // Using the provided UTC time
  const currentUser = 'rohitrao93198'; // Using the provided user login

  // Initialize default super admin if no users exist
  if (storage.getUsers().length === 0) {
    storage.setUsers([
      {
        id: 1,
        email: 'superadmin@example.com',
        password: 'admin123',
        name: 'Super Admin',
        role: 'SUPER_ADMIN',
        createdAt: currentDateTime,
        createdBy: 'system'
      },
      // Add a default admin
      {
        id: 2,
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Default Admin',
        role: 'ADMIN',
        createdAt: currentDateTime,
        createdBy: currentUser
      },
      // Add current user as an employee
      {
        id: 3,
        email: `${currentUser}@company.com`,
        password: 'employee123',
        name: currentUser,
        role: 'EMPLOYEE',
        createdAt: currentDateTime,
        createdBy: 'system'
      }
    ]);
  }

  // Initialize default team if no teams exist
  if (storage.getTeams().length === 0) {
    storage.setTeams([
      {
        id: 1,
        name: 'Default Team',
        description: 'Default team for new employees',
        members: [3], // Adding the current user (employee) to this team
        createdAt: currentDateTime,
        createdBy: 'admin@example.com'
      }
    ]);
  }
};

// Run initialization
initializeData();

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);