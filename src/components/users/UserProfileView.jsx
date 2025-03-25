import React, { useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    TextField,
    Chip,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { formatDate } from '../../utils/dateUtils';

const UserProfileView = ({ user, teams, onClose, onUpdate, isAdminView, isSuperAdminView = false, canEdit = false, showTeams = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        designation: user.designation || '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updateData = {
            name: formData.name,
            email: formData.email,
            designation: formData.designation
        };

        // Add password only if provided
        const password = formData.password.trim();
        if (password) {
            updateData.password = password;
        }

        onUpdate(user.id, updateData);
        setIsEditing(false);
    };


    const getDesignationLabel = (designation) => {
        if (designation === 'frontend') {
            return 'Frontend Developer';
        } else if (designation === 'backend') {
            return 'Backend Developer';
        } else if (designation === 'fullstack') {
            return 'Full Stack Developer';
        } else if (designation === 'tester') {
            return 'Tester';
        } else {
            return designation || 'Not Assigned';
        }
    };

    const getDesignationDisplay = () => {
        if (user.role === 'SUPER_ADMIN') {
            return 'Super Admin';
        }
        if (user.role === 'ADMIN') {
            return 'Admin';
        }
        if (user.designation) {
            return getDesignationLabel(user.designation);
        }
        return 'Not Assigned';
    };

    return (
        <Box>
            <Paper sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {isEditing ? (
                        <Grid item xs={12}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Grid>
                                    {user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN' && (
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel>Designation</InputLabel>
                                                <Select
                                                    name="designation"
                                                    value={formData.designation}
                                                    onChange={handleChange}
                                                    label="Designation"
                                                >
                                                    <MenuItem value="frontend">Frontend Developer</MenuItem>
                                                    <MenuItem value="backend">Backend Developer</MenuItem>
                                                    <MenuItem value="fullstack">Full Stack Developer</MenuItem>
                                                    <MenuItem value="tester">Tester</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    )}
                                    {(isSuperAdminView || isAdminView) && (
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="New Password (Optional)"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                    )}
                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                                            <Button type="submit" variant="contained">Save Changes</Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    ) : (
                        <>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h5">{user.name}</Typography>
                                    {canEdit && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit Profile
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" display="block" color="textSecondary">
                                    Email
                                </Typography>
                                <Typography variant="body1">{user.email}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="caption" display="block" color="textSecondary">
                                    Designation
                                </Typography>
                                <Typography variant="body1">{getDesignationDisplay()}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary">
                                    Created At : {formatDate(user.createdAt)}
                                </Typography>
                            </Grid>
                        </>
                    )}

                    {/* Assigned Teams Section */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Assigned Teams
                        </Typography>
                        {teams && teams.length > 0 ? (
                            <List>
                                {teams.map((team) => (
                                    <ListItem
                                        key={team.id}
                                        sx={{
                                            bgcolor: 'background.paper',
                                            borderRadius: 1,
                                            mb: 1
                                        }}
                                    >
                                        <ListItemText
                                            primary={team.name}
                                            secondary={team.description}
                                        />
                                        <Chip
                                            label={`${team.members.length} members`}
                                            size="small"
                                            color="primary"
                                            sx={{ ml: 1 }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography color="textSecondary">
                                Not assigned to any teams
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default UserProfileView;