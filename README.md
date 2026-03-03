Somedeed

Overview

Somedeed is a full-stack, role-based job board platform simulation, connecting candidates, employers, and
administrators. Built with Flask, React (Vite), JWT authentication, and deployed on Render with
automatic CI/CD from GitHub.

Architecture Overview

Backend: Flask REST API with SQLAlchemy and Flask-JWT-Extended. 

Frontend: React (Vite) with
Tailwind CSS. Database: SQLite (demo environment). Deployment: Render with Gunicorn.

User Roles
• Candidate: Browse jobs, apply, save listings, build profile.
• Employer: Post jobs, manage listings, review applications.
• Admin: Manage users and platform content.

Authentication & Security
• Password hashing with Flask-Bcrypt.
• JWT authentication with expiration.
• Role-based route protection.
• Environment-variable-based secret management.
• Production deployment via Gunicorn (debug disabled).

Continuous Deployment
Connected to GitHub with automatic deployment on each push to the main branch. Render builds,
installs dependencies, and redeploys the application automatically.


Future Improvements
• Migrate to PostgreSQL.
• Add email notifications.
• Implement refresh tokens and rate limiting.
• Improve admin dashboard UI.
• Enhance mobile responsiveness.
