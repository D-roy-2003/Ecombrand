# EDGY FASHION - Full-Stack E-commerce Website

A modern, edgy streetwear fashion brand e-commerce website built with Next.js, featuring a dark aesthetic inspired by high-end fashion brands like dropdead.world.

## 🚀 Features

### Frontend
- **Modern UI/UX**: Edgy, dark aesthetic with smooth animations
- **Responsive Design**: Fully optimized for mobile and desktop
- **Product Showcase**: Featured products carousel and category browsing
- **Advanced Filtering**: Search, category, and price range filters
- **Smooth Animations**: Framer Motion powered transitions and hover effects
- **User Authentication**: Separate login/register for users and admin

### Backend
- **Next.js API Routes**: RESTful API endpoints for products, orders, and authentication
- **Dual Authentication**: Separate JWT-based authentication for users and admins
- **Database**: PostgreSQL with Prisma ORM
- **Product Management**: Full CRUD operations for products
- **Admin Management**: Comprehensive admin user system

### Admin Dashboard
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage customer orders
- **Analytics**: Sales metrics and performance insights
- **Inventory Control**: Stock management and updates
- **Admin Profile**: Detailed admin information and permissions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Deployment**: Vercel-ready with Supabase/PostgreSQL support

## 📁 Project Structure

```
brand/
├── app/                          # Next.js 14 app directory
│   ├── about/                   # About page
│   │   └── page.tsx
│   ├── admin/                   # Admin pages
│   │   ├── page.tsx            # Admin login page
│   │   └── dashboard/          # Protected admin dashboard
│   │       └── page.tsx
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── admin/          # Admin authentication
│   │   │   │   ├── login/      # Admin login API
│   │   │   │   ├── logout/     # Admin logout API
│   │   │   │   └── me/         # Admin profile API
│   │   │   ├── login/          # User login API
│   │   │   ├── logout/         # User logout API
│   │   │   ├── me/             # User profile API
│   │   │   └── signup/         # User registration API
│   │   ├── orders/             # Order management
│   │   │   └── route.ts
│   │   └── products/           # Product management
│   │       ├── [id]/           # Individual product API
│   │       │   └── route.ts
│   │       └── route.ts
│   ├── cart/                    # Shopping cart page
│   │   └── page.tsx
│   ├── contact/                 # Contact page
│   │   └── page.tsx
│   ├── login/                   # User login/register page
│   │   └── page.tsx
│   ├── shop/                    # Shop page
│   │   └── page.tsx
│   ├── user/                    # User dashboard
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                  # Reusable components
│   ├── admin/                  # Admin-specific components
│   │   ├── AddProductModal.tsx # Add product modal
│   │   └── EditProductModal.tsx # Edit product modal
│   ├── CategoriesSection.tsx   # Category grid
│   ├── FeaturedProducts.tsx    # Product carousel
│   ├── Footer.tsx              # Site footer
│   ├── HeroSection.tsx         # Hero banner
│   ├── Navigation.tsx          # Main navigation
│   ├── ProductFilters.tsx      # Filter sidebar
│   └── ProductGrid.tsx         # Product listing
├── lib/                        # Utility libraries
│   ├── auth.ts                 # Authentication utilities
│   ├── cart.ts                 # Cart management
│   ├── db.ts                   # Database connection
│   └── types.ts                # TypeScript types
├── prisma/                     # Database schema
│   └── schema.prisma           # Prisma schema definition
├── scripts/                    # Database scripts
│   └── seed-admin.ts           # Admin user seeding script
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brand
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/edgy_fashion_db"
   JWT_SECRET="your-jwt-secret-here"
   ```

4. **Set up the database and start development**
   ```bash
   # This will automatically generate Prisma client, push schema, and start dev server
   npm run dev
   ```

5. **Seed admin user** (optional)
   ```bash
   npm run db:seed-admin
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Development Commands

### Automated Development
```bash
# Development (automatically generates client and pushes schema)
npm run dev

# If you want to skip Prisma steps sometimes
npm run dev:clean

# View database
npm run db:studio
```

### Manual Database Commands
```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push database schema
npm run db:migrate   # Run database migrations
npm run db:seed-admin # Seed admin user
```

### Other Commands
```bash
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🔐 Authentication System

### User Authentication
- **URL**: `/login`
- **Features**: User login/register with JWT tokens
- **Redirects**: Users → `/user/dashboard`, Admins → `/admin/dashboard`

### Admin Authentication
- **URL**: `/admin`
- **Default Credentials**: 
  - Email: `admin1@email.com`
  - Password: `Admin@69`
- **Features**: Admin-only login with comprehensive dashboard
- **Redirects**: Admins → `/admin/dashboard`

## 📊 Database Schema

The application uses the following main entities:

### User Model
- **Users**: Customer accounts with orders
- **Role**: CUSTOMER (default)

### Admin Model
- **Admins**: Comprehensive admin user system
- **Fields**: firstName, lastName, phoneNumber, address, city, state, zipCode, country, profileImage, bio, department, permissions, isActive, lastLoginAt, loginAttempts, lockedUntil, twoFactorEnabled, twoFactorSecret

### Product Model
- **Products**: Product catalog with categories
- **Categories**: TSHIRTS, HOODIES, ACCESSORIES, PANTS, SHOES

### Order Model
- **Orders**: Customer orders and order items
- **OrderItems**: Individual order line items

## 🎨 Customization

### Colors & Theme
The design system uses a custom color palette defined in `tailwind.config.js`:
- **Primary**: Dark grays and blacks
- **Accent**: Vibrant reds and pinks
- **Custom Classes**: Pre-built component classes for consistent styling

### Fonts
- **Display**: Orbitron (for headings and brand elements)
- **Body**: Inter (for readable text)
- **Mono**: JetBrains Mono (for technical elements)

### Animations
Custom animations and transitions using Framer Motion:
- Page transitions
- Hover effects
- Loading states
- Micro-interactions

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Database Setup
- **Supabase**: Recommended for easy PostgreSQL hosting
- **Railway**: Alternative PostgreSQL hosting
- **Self-hosted**: Use your own PostgreSQL server

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="strong-jwt-secret"
```

## 🛡️ Security Features

- JWT-based authentication for both users and admins
- Password hashing with bcrypt
- Protected admin routes
- Input validation and sanitization
- CORS protection
- Separate authentication systems for users and admins

## 🎯 Future Enhancements

- [ ] Stripe payment integration
- [ ] Shopping cart functionality
- [ ] Order tracking system
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Multi-language support
- [ ] SEO optimization
- [ ] Two-factor authentication for admins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Next.js and modern web technologies**
