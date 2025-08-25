# EDGY FASHION - Full-Stack E-commerce Website

A modern, edgy streetwear fashion brand e-commerce website built with Next.js, featuring a dark aesthetic inspired by high-end fashion brands like dropdead.world.

## 🚀 Features

### Frontend
- **Modern UI/UX**: Edgy, dark aesthetic with smooth animations
- **Responsive Design**: Fully optimized for mobile and desktop
- **Product Showcase**: Featured products carousel and category browsing
- **Advanced Filtering**: Search, category, and price range filters
- **Smooth Animations**: Framer Motion powered transitions and hover effects

### Backend
- **Next.js API Routes**: RESTful API endpoints for products, orders, and admin
- **Authentication**: Secure JWT-based admin authentication
- **Database**: PostgreSQL with Prisma ORM
- **Product Management**: Full CRUD operations for products

### Admin Dashboard
- **Product Management**: Add, edit, and delete products
- **Order Management**: View and manage customer orders
- **Analytics**: Sales metrics and performance insights
- **Inventory Control**: Stock management and updates

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
edgy-fashion-ecommerce/
├── app/                          # Next.js 14 app directory
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── products/           # Product management
│   │   └── orders/             # Order management
│   ├── admin/                  # Admin pages
│   │   ├── page.tsx           # Admin login
│   │   └── dashboard/         # Admin dashboard
│   ├── shop/                   # Shop page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/                  # Reusable components
│   ├── admin/                  # Admin-specific components
│   ├── Navigation.tsx         # Main navigation
│   ├── HeroSection.tsx        # Hero banner
│   ├── FeaturedProducts.tsx   # Product carousel
│   ├── CategoriesSection.tsx  # Category grid
│   ├── ProductGrid.tsx        # Product listing
│   ├── ProductFilters.tsx     # Filter sidebar
│   └── Footer.tsx             # Site footer
├── lib/                        # Utility libraries
│   ├── db.ts                  # Database connection
│   ├── auth.ts                # Authentication utilities
│   └── types.ts               # TypeScript types
├── prisma/                     # Database schema
│   └── schema.prisma          # Prisma schema definition
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
   cd edgy-fashion-ecommerce
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
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   JWT_SECRET="your-jwt-secret-here"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

5. **Create admin user** (optional)
   ```sql
   INSERT INTO users (id, email, name, password, role) 
   VALUES (
     'admin-1', 
     'admin@edgyfashion.com', 
     'Admin User', 
     '$2a$12$hashedpassword', 
     'ADMIN'
   );
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Access

- **URL**: `/admin`
- **Default Credentials**: Use the admin user created in the database
- **Features**: Product management, order tracking, analytics dashboard

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
NEXTAUTH_SECRET="strong-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
JWT_SECRET="strong-jwt-secret"
```

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push database schema
npm run db:migrate   # Run database migrations
```

## 📊 Database Schema

The application uses the following main entities:
- **Users**: Admin and customer accounts
- **Products**: Product catalog with categories
- **Orders**: Customer orders and order items
- **Categories**: Product classification

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected admin routes
- Input validation and sanitization
- CORS protection

## 🎯 Future Enhancements

- [ ] Stripe payment integration
- [ ] User registration and profiles
- [ ] Shopping cart functionality
- [ ] Order tracking system
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Multi-language support
- [ ] SEO optimization

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
