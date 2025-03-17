import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Chip,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate, formatDisplayDate } from '../../utils/dateUtils';

const UserList = ({ users, onViewProfile, onDelete, showActions }) => {
    const getDesignationLabel = (designation) => {
        switch (designation) {
            case 'frontend':
                return 'Frontend Developer';
            case 'backend':
                return 'Backend Developer';
            case 'fullstack':
                return 'Full Stack Developer';
            case 'tester':
                return 'Tester';
            default:
                return designation || 'Not Assigned';
        }
    };

    const getDesignationColor = (designation) => {
        switch (designation) {
            case 'frontend':
                return 'info';
            case 'backend':
                return 'success';
            case 'fullstack':
                return 'primary';
            case 'tester':
                return 'warning';
            default:
                return 'default';
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated At</TableCell>
                        {showActions && <TableCell>Actions</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Chip
                                    label={getDesignationLabel(user.designation)}
                                    color={getDesignationColor(user.designation)}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>
                                <Chip
                                    label={user.role}
                                    color={user.role === 'ADMIN' ? 'primary' : 'default'}
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>{formatDate(user.createdAt)}</TableCell>
                            <TableCell>{formatDate(user.updatedAt)}</TableCell>
                            {showActions && (
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => onViewProfile(user)}
                                        >
                                            View Profile
                                        </Button>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => onDelete(user)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserList;