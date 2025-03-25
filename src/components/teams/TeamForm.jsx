import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
} from '@mui/material';


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