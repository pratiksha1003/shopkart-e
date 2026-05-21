/** Company details shown on invoices */
export const COMPANY = {
  name: 'ShopKart',
  tagline: 'Shop Smarter, Live Better',
  address: '123 Commerce Street, Andheri East',
  city: 'Mumbai, Maharashtra 400069',
  country: 'India',
  email: 'support@shopkart.com',
  phone: '+91 1800-123-4567',
  website: 'www.shopkart.com',
  gstin: '27AAAAA0000A1Z5',
};

export const formatInvoiceNumber = (orderId) =>
  `INV-${String(orderId).slice(-8).toUpperCase()}`;

export const formatOrderDate = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
