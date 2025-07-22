# Dress For Success Platform

A comprehensive web application for managing a professional attire rental program for university students. This platform enables students to browse, request, and manage business casual clothing for academic and job search needs, while providing administrators with tools to manage inventory, student records, and rental schedules.

## 🎯 Project Overview

The Dress For Success platform is designed for the University of Guelph's Lang School of Business and Economics. It provides a sustainable solution for students to access professional attire through a donation-based rental system, helping B.Comm students present themselves professionally for interviews, presentations, and career events.

### Key Features

- **Student Portal**: Browse and request professional attire with date selection
- **Admin Dashboard**: Comprehensive management interface for program administrators
- **Inventory Management**: Upload, categorize, and track clothing items
- **Student Management**: Register and manage student records and requests
- **Calendar System**: Visual scheduling and tracking of rentals
- **Content Management**: Dynamic homepage content management
- **Authentication**: Secure user authentication and role-based access

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) with custom design system
- **UI Components**: Custom components built with [Radix UI](https://www.radix-ui.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **Animations**: [Motion](https://motion.dev) for smooth interactions
- **State Management**: React hooks and context
- **Forms**: Custom form components with validation

### Backend & Database
- **Backend**: [Supabase](https://supabase.com) (PostgreSQL database, authentication, storage)
- **File Storage**: Supabase Storage for image management
- **Authentication**: Supabase Auth with Next.js middleware
- **API**: Next.js API routes with Supabase client

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js configuration
- **Type Checking**: TypeScript 5
- **PostCSS**: For CSS processing
- **Font**: [Geist](https://vercel.com/font) (Vercel's custom font)

## 📁 Project Structure



```
frontend/
├── app/                    # Next.js app directory (routes & pages)
│   ├── auth/              # Authentication pages (login, signup, etc.)
│   ├── dashboard/         # Admin dashboard and management
│   ├── browse/            # Student browsing interface
│   ├── add/               # Attire upload/management
│   ├── students/          # Student management
│   ├── calendar/          # Rental calendar view
│   ├── api/               # API routes
│   └── ...
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (buttons, cards, etc.)
│   ├── attires/          # Attire-specific components
│   ├── students/         # Student management components
│   ├── calendar/         # Calendar components
│   ├── kokonutui/        # E-commerce style browsing interface
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and configurations
│   ├── supabase/         # Supabase client configurations
│   └── ...
├── types/                # TypeScript type definitions
├── public/               # Static assets (images, logos)
└── scripts/              # Database setup scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DressForSuccess/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up the database**
   Run the SQL script to create necessary tables:
   ```bash
   # Execute the SQL in your Supabase SQL editor
   cat scripts/create-tables.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Core Features

### For Students
- **Browse Attire**: Search and filter professional clothing by category, gender, and size
- **Request Rentals**: Select items and specify rental dates
- **View Schedule**: Track pickup and return dates
- **Account Management**: Update personal information and view rental history

### For Administrators
- **Dashboard Overview**: Real-time statistics and quick actions
- **Inventory Management**: Upload, edit, and organize clothing items
- **Student Management**: Register students and manage their accounts
- **Request Processing**: Approve, reject, and track rental requests
- **Calendar Management**: Visual scheduling of pickups and returns
- **Content Management**: Update homepage content dynamically

### System Features
- **Authentication**: Secure login with role-based access control
- **File Upload**: Image management for attire items
- **Search & Filtering**: Advanced filtering and sorting capabilities
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live data synchronization
- **Email Integration**: Automated email notifications (via Resend)

## 🗄 Database Schema

The platform uses several key tables:

- **`students`**: Student registration and profile information
- **`attires`**: Clothing inventory with metadata
- **`attire_requests`**: Rental requests and scheduling
- **`home_page_content`**: Dynamic content management
- **`users`**: Authentication and user management (Supabase Auth)

## 🎨 Design System

The platform features a custom design system with:
- **Color Palette**: Primary red (#CC0633), accent yellow (#FFCC00)
- **Typography**: Geist font family for modern readability
- **Components**: Consistent UI components built with Radix UI primitives
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Organization
- **Components**: Reusable UI components in `/components/ui`
- **Pages**: Route-based pages in `/app`
- **Hooks**: Custom React hooks in `/hooks`
- **Types**: TypeScript definitions in `/types`
- **Utilities**: Helper functions in `/lib`

## 🚀 Deployment

The application is designed to be deployed on [Vercel](https://vercel.com) with the following considerations:

1. **Environment Variables**: Configure Supabase credentials
2. **Database**: Ensure Supabase project is properly configured
3. **Storage**: Set up Supabase Storage buckets for images
4. **Authentication**: Configure Supabase Auth settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- University of Guelph Lang School of Business and Economics
- Business Career Development Centre (BCDC)
- Generous clothing donors from the Lang community
- Built with modern web technologies for sustainability and scalability
