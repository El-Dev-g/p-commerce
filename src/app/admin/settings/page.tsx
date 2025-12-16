
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <main className="flex-1 p-6 md:p-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">Settings</h1>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Update your store's name and contact details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="Curated Finds" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail">Contact Email</Label>
              <Input id="storeEmail" type="email" defaultValue="hello@curatedfinds.com" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage API keys for integrations like WhatsApp and your dropshipping supplier.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="whatsappToken">WhatsApp Verify Token</Label>
              <Input id="whatsappToken" type="password" defaultValue="a-secret-token-goes-here" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="supplierKey">Supplier API Key</Label>
              <Input id="supplierKey" type="password" defaultValue="another-secret-key-goes-here" />
            </div>
            <Button>Save API Keys</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
