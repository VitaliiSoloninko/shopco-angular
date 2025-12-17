// Backend URL configuration for the ShopCo application
const BASE_URL = 'http://localhost:5000';
// const BASE_URL = 'https://shopco.soloninko.online';

export const DOCS_URL = BASE_URL + '/api/docs';

export const BRANDS_URL = BASE_URL + '/api/brands';
export const TYPES_URL = BASE_URL + '/api/types';
export const USERS_URL = BASE_URL + '/api/users';
export const PRODUCTS_URL = BASE_URL + '/api/products';
export const CART_URL = BASE_URL + '/api/cart';
export const IMAGES_BASE_URL = BASE_URL + '/uploads/products/';

export const LOGIN_URL = BASE_URL + '/api/auth/login';
export const REGISTER_URL = BASE_URL + '/api/auth/register';
export const PROFILE_URL = BASE_URL + '/api/auth/profile';

// Frontend URL configuration for the ShopCo application
export const HOME = '/';
export const CATALOG = '/catalog';
export const PRODUCT_DETAILS = '/product/:id';
export const CART = '/cart';
export const CHECKOUT = '/checkout';
export const LOGIN = '/login';
export const REGISTER = '/register';
export const PROFILE = '/profile';
export const ORDERS = '/profile/orders';
