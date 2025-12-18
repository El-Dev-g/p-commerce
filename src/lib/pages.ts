
export type Page = {
  slug: string;
  title: string;
  content: Record<string, any>;
};

export const pagesData: Page[] = [
  {
    slug: 'about-us',
    title: 'About Us',
    content: {
      mission:
        'To bring thoughtfully curated, high-quality goods to customers who appreciate authenticity and craftsmanship. We believe in products with a story.',
      story:
        'Founded in a small workshop with a big dream, Curated Finds has grown from a passion project into a beloved brand. Our journey is one of dedication to quality and a deep respect for the artisans we work with. We travel the world to find unique items that you won\'t find anywhere else.',
    },
  },
  {
    slug: 'contact-us',
    title: 'Contact Us',
    content: {
      intro:
        "We'd love to hear from you! Whether you have a question about our products, need assistance with an order, or just want to say hello, feel free to reach out.",
      email: 'support@curatedfinds.com',
      phone: '+1 (555) 123-4567',
    },
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    content: {
      policy:
        "Your privacy is important to us. It is Curated Finds' policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate. We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.",
    },
  },
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    content: {
      terms:
        'By accessing the website at https://curatedfinds.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.',
    },
  },
  {
    slug: 'shipping-policy',
    title: 'Shipping Policy',
    content: {
      processingTime: 'Orders are processed within 1-2 business days. Once your order has shipped, you will receive a confirmation email with tracking information.',
      shippingRates: 'We offer flat-rate shipping of $5.00 for all domestic orders. International shipping is calculated at checkout based on your location. Enjoy free shipping on all domestic orders over $75.',
      deliveryEstimates: 'Domestic orders typically arrive within 3-5 business days. International delivery times vary by destination.'
    }
  },
  {
    slug: 'return-policy',
    title: 'Return Policy',
    content: {
      policy: 'We want you to love your purchase. If you are not completely satisfied, you may return your item(s) within 30 days of receipt for a full refund or exchange. Items must be unused and in their original condition and packaging.',
      process: 'To initiate a return, please contact our support team at support@curatedfinds.com with your order number. We will provide you with instructions and a return shipping label.'
    }
  },
  {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    content: {
      question1: 'What is your return policy?',
      answer1: 'You can return any item within 30 days of receipt for a full refund, provided it is unused and in its original packaging. Please see our full Return Policy for more details.',
      question2: 'How long will it take to get my order?',
      answer2: 'Orders are typically processed in 1-2 business days and standard domestic shipping takes 3-5 business days.',
      question3: 'Do you ship internationally?',
      answer3: 'Yes, we do! International shipping rates and times are calculated at checkout.'
    }
  }
];
