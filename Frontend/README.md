# HostelHub Frontend

A modern React-based frontend for the HostelHub washing machine management system. Built for hostels and shared accommodations to efficiently manage washing machine bookings and availability.

## 🌟 Features

- **Real-time Machine Status** - Live updates every 30 seconds
- **Floor-based Navigation** - Easy browsing by hostel floors
- **Booking System** - Quick machine reservations with time tracking
- **Mobile Responsive** - Works seamlessly on all devices
- **Session Management** - Track active sessions and pickup reminders

## 🛠 Tech Stack

- **React 19** - Latest React with modern features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Modern CSS** - Custom properties and responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm 7+
- Backend server running (see ../Backend)

### Installation

```bash
# Clone and install
git clone <repo-url>
cd Frontend
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Build for Production

```bash
npm run build:prod
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # Main app header
│   ├── Sidebar.jsx     # Floor navigation
│   ├── WashingMachine.jsx
│   └── MachineModal.jsx
├── services/           # API services
│   └── api.js
├── utils.js           # Helper functions
├── index.css          # Global styles
└── App.jsx            # Main app component
```

## ⚙️ Available Scripts

```bash
npm run dev         # Start dev server with host access
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm run clean       # Clean cache and build files
```

## 🎨 Design System

### CSS Variables
- Custom properties for consistent theming
- Color palette: `--color-primary`, `--color-success`, etc.
- Spacing scale: `--spacing-xs` through `--spacing-2xl`
- Typography: Inter for UI, Orbitron for branding

### Components
- Machine cards with status indicators
- Responsive grid layout
- Modal dialogs for booking
- Status pills and badges

## 🌐 API Integration

The frontend connects to a Node.js backend for:
- Machine status updates
- Session management (create/delete)
- Real-time data synchronization

Base API URL is configurable via environment variables.

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface
- Mobile-optimized navigation
- Collapsible sidebar on smaller screens

## 🔧 Configuration

Environment variables (optional):
```bash
VITE_API_URL=http://localhost:8000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Style
- Use ESLint configuration
- Follow React best practices
- Maintain component isolation
- Add comments for complex logic

## 📄 License

This project is part of the HostelHub system - check main repository for license details.

---

Built with ❤️ for efficient hostel management
