import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tabs,
    Tab,
    Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import UserList from '../users/UserList';
import UserProfileView from '../users/UserProfileView';
import TeamList from '../teams/TeamList';
import { storage } from '../../utils/localStorage';
import { useAuth } from '../../context/AuthContext';

const CURRENT_TIME = new Date().toISOString();
const CREATOR_NAME = storage.getCurrentUser()?.name || 'Employee';

const EmployeeDashboard = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState({ admins: [], employees: [] });
    const [selectedUser, setSelectedUser] = useState(null);
    const [openProfileDialog, setOpenProfileDialog] = useState(false);
    const [tab, setTab] = useState(0);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const allUsers = storage.getUsers();
        const allTeams = storage.getTeams();

        const admins = allUsers.filter(user =>
            user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
        ).map(user => ({
            ...user,
            designation: user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'
        }));

        const employees = allUsers.filter(user => user.role === 'EMPLOYEE');

        setUsers({ admins, employees });
        setTeams(allTeams);
    };

    const handleViewProfile = (user) => {
        setSelectedUser(user);
        setOpenProfileDialog(true);
    };

    const handleUpdateUser = (userId, updatedData) => {
        if (userId !== currentUser.id || !updatedData) return;

        const allUsers = storage.getUsers();
        const userToUpdate = allUsers.find(u => u.id === userId);

        if (!userToUpdate) return;

        const finalData = {
            ...userToUpdate,
            ...updatedData,
            role: userToUpdate.role,
            designation: userToUpdate.designation,
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser.name,
            updatedByUserId: currentUser.id
        };

        try {
            const updatedUsers = allUsers.map(user =>
                user.id === userId ? finalData : user
            );

            storage.setUsers(updatedUsers);
            storage.setCurrentUser(finalData);
            loadData();
            setOpenProfileDialog(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item>
                            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                                {currentUser.name.charAt(0)}
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h5">{currentUser.name}</Typography>
                            <Typography color="textSecondary">{currentUser.email}</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Designation: {currentUser.designation}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={() => handleViewProfile(currentUser)}
                            >
                                Edit Profile
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
                    <Tab label="Admins" />
                    <Tab label="Employees" />
                    <Tab label="Teams" />
                </Tabs>
            </Box>

            {tab === 0 && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Administrators</Typography>
                    <UserList
                        users={users.admins}
                        onViewProfile={handleViewProfile}
                        showActions={false}
                    />
                </Paper>
            )}

            {tab === 1 && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Employees</Typography>
                    <UserList
                        users={users.employees}
                        onViewProfile={handleViewProfile}
                        showActions={false}
                    />
                </Paper>
            )}

            {tab === 2 && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Teams</Typography>
                    <TeamList
                        teams={teams}
                        users={[...users.admins, ...users.employees]}
                        showActions={false}
                    />
                </Paper>
            )}

            <Dialog
                open={openProfileDialog}
                onClose={() => setOpenProfileDialog(false)}
                maxWidth="md"
                fullWidth
                aria-labelledby="profile-dialog-title"
            >
                <DialogTitle id="profile-dialog-title">
                    {selectedUser?.id === currentUser.id ? 'Edit Profile' : 'View Profile'}
                </DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <UserProfileView
                            user={selectedUser}
                            teams={teams.filter(team =>
                                team.members.some(member => member.userId === selectedUser.id)
                            )}
                            onUpdate={handleUpdateUser}
                            canEdit={selectedUser.id === currentUser.id}
                            isAdminView={false}
                            onClose={() => setOpenProfileDialog(false)}
                            showTeams={true}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenProfileDialog(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EmployeeDashboard;