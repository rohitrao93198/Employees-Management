import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Fixed import path

const TeamForm = ({ onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        members: initialData?.members || []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleMemberChange = (userId, newRole) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members.map(member =>
                member.userId === userId ? { ...member, role: newRole } : member
            )
        }));
    };

    const handleRemoveMember = (userId) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members.filter(member => member.userId !== userId)
        }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="Team Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        label="Description"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                        Team Members
                    </Typography>
                    {formData.members.length > 0 ? (
                        <List>
                            {formData.members.map((member) => (
                                <ListItem key={member.userId}>
                                    <ListItemText
                                        primary={member.name}
                                        secondary={
                                            <FormControl size="small" fullWidth>
                                                <InputLabel>Role</InputLabel>
                                                <Select
                                                    value={member.role || ''}
                                                    label="Role"
                                                    onChange={(e) => handleMemberChange(member.userId, e.target.value)}
                                                >
                                                    <MenuItem value="frontend">Frontend Developer</MenuItem>
                                                    <MenuItem value="backend">Backend Developer</MenuItem>
                                                    <MenuItem value="fullstack">Full Stack Developer</MenuItem>
                                                    <MenuItem value="tester">Tester</MenuItem>
                                                </Select>
                                            </FormControl>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleRemoveMember(member.userId)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography color="textSecondary">No members added yet</Typography>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                    >
                        {initialData ? 'Update Team' : 'Create Team'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TeamForm;