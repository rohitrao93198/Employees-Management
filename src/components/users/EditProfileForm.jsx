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