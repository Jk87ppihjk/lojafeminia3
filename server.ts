import express, { RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './initDb';

// Import Page Logics
import homeRoutes from './home';
import productListRoutes from './productList';
import productDetailsRoutes from './productDetails';
import cartRoutes from './cart';
import checkoutRoutes from './checkout';
import profileRoutes from './profile';
import dashboardRoutes from './dashboard';
import adminProductsRoutes from './adminProducts';
import adminOrdersRoutes from './adminOrders';
import adminCustomersRoutes from './adminCustomers';
import adminReportsRoutes from './adminReports';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - Configuração Robusta de CORS
app.use(cors({
  origin: '*', // Permite qualquer origem (Frontend Hostinger, Localhost, etc)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}) as any);

// Tratamento explícito de Preflight (OPTIONS)
app.options('*', cors() as any);

app.use(express.json() as any);

// Routes Mapped to Frontend Pages
app.use('/api/home', homeRoutes);
app.use('/api/products', productListRoutes);
app.use('/api/product-details', productDetailsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/products', adminProductsRoutes);
app.use('/api/admin/orders', adminOrdersRoutes);
app.use('/api/admin/customers', adminCustomersRoutes);
app.use('/api/admin/reports', adminReportsRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Moda Bella API is running');
});

// Initialize DB and Start Server
app.listen(PORT, async () => {
  await initDb();
  console.log(`Server running on port ${PORT}`);
});