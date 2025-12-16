
import { ProductForm } from '../product-form';

export default function NewProductPage() {
  return (
    <main className="flex-1 p-6 md:p-8">
       <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Add New Product</h1>
      </div>
      <ProductForm />
    </main>
  );
}
