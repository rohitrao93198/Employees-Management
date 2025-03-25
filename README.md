# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Role Management System - File Reading Order

1. Core Files

   1. localStorage.js - Data persistence layer
   2. AuthContext.jsx - Authentication management
   3. LoginForm.jsx - User login interface
   4. App.jsx - Main application structure

2. Dashboard Components

   5. EmployeeDashboard.jsx - Basic user dashboard
   6. AdminDashboard.jsx - Admin management dashboard
   7. SuperAdminDashboard.jsx - Super admin control dashboard

3. User Management

   8. UserList.jsx - User listing component
   9. UserForm.jsx - User creation/editing form
   10. UserProfileView.jsx - User profile display

4. Team Management

   11. TeamList.jsx - Team listing component
   12. TeamForm.jsx - Team creation/editing form
   13. TeamMembersList.jsx - Team member management

5. Layout Components 14. Header.jsx - Application header 15. theme.js - Theme configuration

6. Utility Files 16. dateUtils.js - Date formatting utilities

teams={teams.filter(team =>
team.members.some(member => member.userId === selectedUser.id)
)}

const handleNameChange = (e) => {
setFormData({ ...formData, name: e.target.value });
};

const handleEmailChange = (e) => {
setFormData({ ...formData, email: e.target.value });
};

EditProfileForm.jsx
import { useState } from 'react';
import {
Box,
TextField,
Button,
Stack,
Alert
} from '@mui/material';

const EditProfileForm = ({ user, onSubmit }) => {
const [formData, setFormData] = useState({
name: user.name,
email: user.email,
password: '',
currentPassword: ''
});
const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.currentPassword) {
            setError('Current password is required to make changes');
            return;
        }
        if (formData.currentPassword !== user.password) {
            setError('Current password is incorrect');
            return;
        }

        const updatedUser = {
            ...user,
            name: formData.name,
            email: formData.email,
            password: formData.password || user.password
        };
        onSubmit(updatedUser);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Stack spacing={2}>
                <TextField
                    required
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    label="New Password (leave blank to keep current)"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <TextField
                    required
                    fullWidth
                    label="Current Password (required to save changes)"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                >
                    Save Changes
                </Button>
            </Stack>
        </Box>
    );

};

export default EditProfileForm;
