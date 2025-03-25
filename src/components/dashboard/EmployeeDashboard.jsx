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
import UserList from '../users/UserList';
import UserProfileView from '../users/UserProfileView';
import TeamList from '../teams/TeamList';
import { storage } from '../../utils/localStorage';
import { useAuth } from '../../context/AuthContext';

const EmployeeDashboard = () => {
    const { user: currentUser, updateCurrentUser } = useAuth();
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

        const admins = allUsers.filter(user => {
            if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
                return true;
            }
            return false;
        }).map(user => {
            const updatedUser = { ...user };
            if (user.role === 'SUPER_ADMIN') {
                updatedUser.designation = 'Super Admin';
            } else {
                updatedUser.designation = 'Admin';
            }
            return updatedUser;
        });

        const employees = allUsers.filter(user => {
            if (user.role === 'EMPLOYEE') {
                return true;
            }
            return false;
        }).map(user => {
            const updatedUser = { ...user };
            if (user.designation) {
                updatedUser.designation = user.designation;
            } else {
                updatedUser.designation = 'Employee';
            }
            return updatedUser;
        });

        setUsers({ admins, employees });

        const updatedTeams = allTeams.map(team => {
            return {
                ...team,
                members: team.members.map(member => {
                    const user = allUsers.find(u => u.id === member.userId);
                    const updatedMember = { ...member };

                    if (user) {
                        if (user.role === 'SUPER_ADMIN') {
                            updatedMember.designation = 'Super Admin';
                        } else if (user.role === 'ADMIN') {
                            updatedMember.designation = 'Admin';
                        } else if (user.designation) {
                            updatedMember.designation = user.designation;
                        } else {
                            updatedMember.designation = 'Employee';
                        }
                    } else {
                        updatedMember.designation = 'Not Assigned';
                    }

                    return updatedMember;
                })
            };
        });

        setTeams(updatedTeams);
    };

    const handleUpdateUser = (userId, updatedData) => {
        if (!userId || !updatedData) {
            return;
        }

        if (userId !== currentUser.id) {
            return;
        }

        const allUsers = storage.getUsers();
        const userToUpdate = allUsers.find(user => user.id === userId);
        if (!userToUpdate) {
            return;
        }

        try {
            const finalData = {
                ...userToUpdate,
                ...updatedData,
                role: userToUpdate.role
            };

            const updatedUsers = allUsers.map(user => {
                if (user.id === userId) {
                    return finalData;
                } else {
                    return user;
                }
            });

            storage.setUsers(updatedUsers);
            storage.setCurrentUser(finalData);
            updateCurrentUser(finalData);

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
                                {currentUser.name.charAt(0).toUpperCase()}
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
                                onClick={() => {
                                    setSelectedUser(currentUser);
                                    setOpenProfileDialog(true);
                                }}
                            >
                                View Profile
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
                        showActions={false}
                    />
                </Paper>
            )}

            {tab === 1 && (
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Employees</Typography>
                    <UserList
                        users={users.employees}
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
                <DialogTitle id="profile-dialog-title">Edit Profile</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <UserProfileView
                            user={selectedUser}
                            teams={teams}
                            onUpdate={handleUpdateUser}
                            canEdit={true}
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