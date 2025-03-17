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
