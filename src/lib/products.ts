import type { Product } from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // Fallback image if not found
    return {
      src: `https://picsum.photos/seed/${id}/600/400`,
      alt: 'A placeholder image',
      'data-ai-hint': 'placeholder',
    };
  }
  return {
    src: image.imageUrl,
    alt: image.description,
    'data-ai-hint': image.imageHint,
  };
};

export const products: Product[] = [
  {
    id: 'prod_001',
    name: 'Vintage Camera',
    description: 'Capture moments with this classic film camera. A piece of history that still tells beautiful stories. Perfect for enthusiasts and collectors.',
    price: 125.00,
    image: getImage('vintage-camera'),
  },
  {
    id: 'prod_002',
    name: 'Leather Journal',
    description: 'Handcrafted with genuine leather, this journal is your perfect companion for thoughts, sketches, and dreams. Comes with a linen-cotton pouch.',
    price: 45.00,
    image: getImage('leather-journal'),
  },
  {
    id: 'prod_003',
    name: 'Artisan Ceramic Mug',
    description: 'Enjoy your morning coffee or tea in this beautifully crafted ceramic mug. Each piece is unique, with a speckled glaze finish.',
    price: 28.00,
    image: getImage('ceramic-mug'),
  },
  {
    id: 'prod_004',
    name: 'Cozy Woolen Scarf',
    description: 'Stay warm and stylish with this hand-knitted scarf, made from 100% merino wool. Soft, breathable, and ethically sourced.',
    price: 65.00,
    image: getImage('woolen-scarf'),
  },
  {
    id: 'prod_005',
    name: 'Antique Brass Compass',
    description: 'A functional and decorative pocket compass, a reminder of the age of exploration. Makes a great gift for the adventurer in your life.',
    price: 55.00,
    image: getImage('brass-compass'),
  },
  {
    id: 'prod_006',
    name: 'Minimalist Succulent Pot',
    description: 'Bring a touch of green to your space with this chic succulent in a geometric pot. Easy to care for and perfect for any room.',
    price: 22.00,
    image: getImage('potted-succulent'),
  },
    {
    id: 'prod_007',
    name: 'Classic Fountain Pen',
    description: 'Experience the joy of writing with this elegant fountain pen. Features a smooth gold nib and a balanced, comfortable grip.',
    price: 85.00,
    image: getImage('fountain-pen'),
  },
  {
    id: 'prod_008',
    name: 'Wooden Hourglass',
    description: 'A 30-minute sand timer that adds a touch of classic elegance to your desk or shelf. Crafted from fine wood with pristine white sand.',
    price: 40.00,
    image: getImage('hourglass'),
  },
];
