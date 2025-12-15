# Angular Shop Co

A modern e-commerce web application built with Angular 20, featuring a complete shopping experience with product catalog, cart management, and responsive design.
Version 1.2
All shop part frontend with mock data (data folder)
Admin panel with real backend and RxJS (brands, types, products, users)

## 🛠️ Tech Stack

- **Framework**: Angular 20.2.4
- **Language**: TypeScript 5.9.2
- **Styling**: SCSS
- **Testing**: Jest + Angular Testing Utilities
- **State Management**: Angular Signals
- **Routing**: Angular Router
- **Build Tool**: @angular/build
- **Deployment**: Firebase Hosting

## 🛠️ Version 1.1 (Full Frontend part) 16 pages

- **SHOP**: Home, Catalog, Cart, Checkout, Payment, Success
- **AUTH**: Login, Register
- **USER**: Profile, Edit profile
- **ADMIN**: Dashboard, Products, Brands, Types, Users, Orders

## ✨ Features

- **Product Catalog**: Browse products with filtering by brand, type, and search
- **Product Details**: Detailed product view with size selection and quantity control
- **Shopping Cart**: Add/remove items, update quantities, persistent cart with localStorage
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **User Authentication**: Login/register pages (UI ready)
- **Checkout Flow**: Multi-step checkout process with order summary
- **Empty States**: User-friendly empty state components

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18+)
- npm or yarn
- Angular CLI

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd angular-shopco
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
# or
ng serve
```

4. Open your browser and navigate to `http://localhost:4200/`

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run unit tests with Jest
npm run watch      # Build in watch mode
```

## 📁 Project Structure

```
src/app/
├── data/                 # Static data (products, brands, types)
├── entities/            # Business entities
│   ├── cart/           # Cart models, services, and UI components
│   ├── product/        # Product models, services, and UI components
│   └── user/           # User-related components
├── features/           # Feature-specific components
│   └── product/        # Product filtering, sorting, pagination
├── pages/              # Page components
│   ├── auth/           # Login/register pages
│   ├── cart-page/      # Shopping cart page
│   ├── checkout-page/  # Checkout flow
│   ├── home-page/      # Homepage
│   └── product-*/      # Product-related pages
├── shared/             # Shared UI components
│   └── ui/             # Reusable UI components
└── widgets/            # Complex UI widgets
    ├── auth-form/      # Authentication forms
    ├── cart/           # Cart-related widgets
    ├── footer/         # Footer components
    ├── header/         # Header/navigation
    └── product/        # Product-related widgets
```

## 🏗️ Architecture

The project follows **Feature-Sliced Design** principles with a clean separation of concerns:

- **Entities**: Core business logic and models
- **Features**: Specific functionality implementations
- **Widgets**: Complex UI components
- **Shared**: Reusable components and utilities
- **Pages**: Route-level components

Key architectural patterns:

- **Signals-based State Management**: Using Angular Signals for reactive state
- **Standalone Components**: All components are standalone for better tree-shaking
- **Service-based Data Layer**: Centralized data management through services
- **Responsive Design**: Mobile-first CSS with breakpoint-based layouts

## 🔧 Key Services

- **ProductService**: Product data management and filtering
- **CartService**: Shopping cart state management with localStorage persistence
- **Responsive Design**: Automatic mobile/desktop layout switching

## 🎨 Styling

- SCSS with CSS custom properties
- Mobile-first responsive design
- Consistent spacing and typography system
- Modular component-based styles

## 🧪 Testing

- Jest for unit testing
- Angular Testing Utilities
- Component isolation testing
- Service testing with mocks

## 🚀 Deployment

The project is configured for Firebase Hosting:

```bash
npm run build
firebase deploy
```

## 📱 Responsive Design

- **Mobile**: < 768px - Optimized mobile layout
- **Tablet**: 768px - 1024px - Tablet-friendly design
- **Desktop**: > 1024px - Full desktop experience

## 🛍️ Shopping Features

- Product browsing with search and filters
- Add to cart with size and quantity selection
- Cart persistence across sessions
- Order summary with discount calculations
- Multi-step checkout process

## 🔮 Future Enhancements

- User authentication integration
- Payment processing
- Order history
- Product reviews and ratings
- Advanced filtering options

nvm install 22
