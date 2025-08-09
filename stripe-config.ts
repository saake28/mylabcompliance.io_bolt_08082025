export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_SfUSDzI3gmN7Ze',
    priceId: 'price_1Rk9TfDQHSWH37Eouz649Ask',
    name: '2 Instrument Lab',
    description: 'Complete laboratory management solution for facilities with up to 2 instruments. Includes full CLIA compliance tracking, quality control management, personnel training, and comprehensive reporting.',
    mode: 'subscription',
    price: 259.00,
  },
  {
    id: 'prod_SfUS2CYQYKDO11',
    priceId: 'price_1Rk9T9DQHSWH37EoH0VBW2DX',
    name: '1 Instrument Lab',
    description: 'Essential laboratory management solution for single-instrument facilities. Perfect for smaller labs needing CLIA compliance, basic quality control, and staff training management.',
    mode: 'subscription',
    price: 159.00,
  },
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export function getProductById(id: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.id === id);
}