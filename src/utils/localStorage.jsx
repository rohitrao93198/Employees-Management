const STORAGE_KEYS = {
    USERS: 'users',
    TEAMS: 'teams',
    CURRENT_USER: 'currentUser',
};

export const storage = {
    getUsers: () => {
        const users = localStorage.getItem(STORAGE_KEYS.USERS);
        if (users) {
            return JSON.parse(users);
        } else {
            return [];
        }
    },

    setUsers: (users) => {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    },

    getTeams: () => {
        const teams = localStorage.getItem(STORAGE_KEYS.TEAMS);
        if (teams) {
            return JSON.parse(teams);
        } else {
            return [];
        }
    },

    setTeams: (teams) => {
        localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    },

    getCurrentUser: () => {
        const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (user) {
            return JSON.parse(user);
        } else {
            return null;
        }
    },

    setCurrentUser: (user) => {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    },

    clearCurrentUser: () => {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    },

    // Add this method to clear all data
    clearAll: () => {
        localStorage.removeItem(STORAGE_KEYS.USERS);
        localStorage.removeItem(STORAGE_KEYS.TEAMS);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
};

// Initialize default data
const initializeDefaultData = () => {
    const currentDateTime = new Date().toISOString().split('T')[0];
    // const currentUser = 'rohitrao93198';

    // Only initialize if no users exist
    if (storage.getUsers().length === 0) {
        const defaultUsers = [
            {
                id: 1,
                email: 'superadmin@example.com',
                password: 'admin123',
                name: 'Super Admin',
                role: 'SUPER_ADMIN',
                createdAt: currentDateTime,
                createdBy: 'system'
            },
            {
                id: 2,
                email: 'admin@example.com',
                password: 'admin123',
                name: 'Default Admin',
                role: 'ADMIN',
                createdAt: currentDateTime,
                createdBy: 'system'
            },
            {
                id: 3,
                email: `emp@gmail.com`,
                password: 'employee123',
                name: 'Default Employee',
                role: 'EMPLOYEE',
                createdAt: currentDateTime,
                createdBy: 'system'
            }
        ];

        storage.setUsers(defaultUsers);
    }

    // Initialize default team if no teams exist
    if (storage.getTeams().length === 0) {
        const defaultTeams = [
            {
                id: 1,
                name: 'Default Team',
                description: 'Default team for new employees',
                members: [3],
                createdAt: currentDateTime,
                createdBy: 'admin@example.com'
            }
        ];

        storage.setTeams(defaultTeams);
    }
};

// Run initialization
initializeDefaultData();