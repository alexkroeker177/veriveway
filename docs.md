# Updated VeriGiveaway Documentation

## Project Overview
VeriGiveaway is a web application built with React and TypeScript that enables users to create and participate in verified giveaways. The application uses modern web technologies and follows best practices for security and user experience.

## Tech Stack
- **Frontend Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Routing**: React Router DOM
- **Backend Integration**: Supabase and Python 3.12 (+ FastAPI)
- **Database**: PostgreSQL 16
- **Development Tools**: ESLint, PostCSS

## Project Structure
```
veriveway/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React context providers
│   ├── lib/           # Utility functions and configurations
│   ├── pages/         # Page components
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/            # Static assets
└── configuration files
```

## Key Features
1. **Authentication System**
   - User registration and login
   - Email verification
   - Protected routes

2. **Giveaway Management**
   - Create new giveaways
   - View individual giveaways
   - Dashboard for managing giveaways

3. **User Features**
   - User profile management
   - Dashboard for user activities
   - Protected user routes

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Dependencies
### Core Dependencies
- `@radix-ui/react-*` - UI component primitives
- `@supabase/supabase-js` - Backend integration
- `react-router-dom` - Routing
- `tailwindcss` - Styling
- **Python Libraries**: FastAPI
- **Database**: PostgreSQL

### Development Dependencies
- TypeScript and related tools
- ESLint for code linting
- Vite for development and building
- PostCSS and Tailwind for styling

## Routing Structure
- `/` - Home page
- `/login` - Login page
- `/signup` - Registration page
- `/check-email` - Email verification page
- `/giveaway/:id` - Individual giveaway page
- `/dashboard` - User dashboard (protected)
- `/create-giveaway` - Create new giveaway (protected)
- `/profile` - User profile (protected)

## Security
- Protected routes for authenticated users
- Email verification system
- Secure authentication flow

## Getting Started
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Development Guidelines
1. Follow TypeScript best practices
2. Use ESLint for code quality
3. Follow the established project structure
4. Use Tailwind CSS for styling
5. Implement proper error handling
6. Write clean and maintainable code

## Contributing
1. Follow the existing code style
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## License
| Dependency               | Latest Stable Version | License Compliance |                   Technology Compliance                   |
| ------------------------ | :-------------------: | :----------------: | :-------------------------------------------------------: |
| axios                    |        ✅ 1.4.0        |       MIT: ✅       |               MIT: ✅ (HTTP client, REST ok)               |
| @radix-ui/react-dialog   |        ✅ 1.1.14       |       MIT: ✅       |   MIT: ❓ (React-based UI, React not explicitly allowed)   |
| @radix-ui/react-toast    |        ✅ 1.2.14       |       MIT: ✅       |                     MIT: ❓ (see above)                    |
| @supabase/supabase-js    |        ❌ 2.49.9       |       MIT: ✅       |         MIT: ❓ (Supabase/JS-SDK not in tech list)         |
| react-router-dom         |        ✅ 6.22.2       |       MIT: ✅       |        MIT: ❓ (React Router not explicitly allowed)       |
| tailwindcss              |        ✅ 3.4.1        |       MIT: ✅       |    MIT: ✅ (Tailwind CSS allowed as front-end framework)   |
| class-variance-authority |        ✅ 0.7.1        |    Apache-2.0: ✅   | Apache-2.0: ❓ (Utility library, not explicitly mentioned) |
| clsx                     |        ✅ 2.1.1        |       MIT: ✅       |     MIT: ❓ (Utility library, not explicitly mentioned)    |
| lucide-react             |       ✅ 0.344.0       |       MIT: ✅       |             MIT: ❓ (React icons, React-based)             |
| vite                     |        ✅ 5.4.2        |       MIT: ✅       |            MIT: ❓ (Build tool not in tech list)           |
| eslint                   |        ✅ 9.11.1       |       MIT: ✅       |            MIT: ❓ (Lint tool not in tech list)            |
| postcss                  |        ✅ 8.4.35       |       MIT: ✅       |         MIT: ❓ (PostCSS not explicitly mentioned)         |
| typescript               |        ✅ 5.5.3        |    Apache-2.0: ✅   |       Apache-2.0: ✅ (TypeScript as allowed language)      |
| autoprefixer             |       ❌ 10.4.18       |       MIT: ✅       |   MIT: ❓ (Build/styling tool, not explicitly mentioned)   |
| react                    |        ✅ 18.3.1       |       MIT: ✅       |      MIT: ❓ (React not in 4.1.3 front-end frameworks)     |
| react-dom                |        ✅ 18.3.1       |       MIT: ✅       |                     MIT: ❓ (see above)                    |
| @vitejs/plugin-react     |        ✅ 4.3.2        |       MIT: ✅       |       MIT: ❓ (Plugin for React in Vite; React-based)      |
| tailwind-merge           |        ✅ 2.2.1        |       MIT: ✅       |    MIT: ❓ (Tailwind utility, not explicitly mentioned)    |
| tailwindcss-animate      |        ✅ 1.0.7        |       MIT: ✅       |     MIT: ❓ (Tailwind plugin, not explicitly mentioned)    |



## Support
For support and questions, please contact the development team.