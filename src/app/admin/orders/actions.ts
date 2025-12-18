
'use server';

import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

// Mock data store
let ordersData = [
    { id: 'ORD001', customer: 'Liam Johnson', email: 'liam@example.com', date: '2023-11-23', status: 'Delivered', total: '$250.00', trackingNumber: '1Z999AA10123456784', tags: ['High-Value'], fraudRisk: 'low' },
    { id: 'ORD002', customer: 'Olivia Smith', email: 'olivia@example.com', date: '2023-11-22', status: 'Shipped', total: '$150.75', trackingNumber: '1Z999AA10123456785', tags: ['Apparel'], fraudRisk: 'low' },
    { id: 'ORD003', customer: 'Noah Williams', email: 'noah@example.com', date: '2023-11-21', status: 'Delivered', total: '$350.00', trackingNumber: '1Z999AA10123456786', tags: ['High-Value', 'Fragile'], fraudRisk: 'low' },
    { id: 'ORD004', customer: 'Emma Brown', email: 'emma@example.com', date: '2023-11-20', status: 'Processing', total: '$450.50', trackingNumber: '', tags: ['High-Value'], fraudRisk: 'high' },
    { id: 'ORD005', customer: 'James Jones', email: 'james@example.com', date: '2023-11-19', status: 'Delivered', total: '$550.00', trackingNumber: '1Z9A9A9A0192783421', tags: ['High-Value', 'Gift'], fraudRisk: 'low' },
    { id: 'ORD006', customer: 'Sophia Garcia', email: 'sophia@example.com', date: '2023-11-18', status: 'Cancelled', total: '$50.25', trackingNumber: '', tags: ['Home Goods'], fraudRisk: 'low' },
    { id: 'ORD007', customer: 'Isabella Miller', email: 'isabella@example.com', date: '2023-11-17', status: 'Delivered', total: '$100.00', trackingNumber: '1Z999AA10123456789', tags: ['Stationery'], fraudRisk: 'low' },
    { id: 'ORD008', customer: 'Mason Davis', email: 'mason@example.com', date: '2023-11-16', status: 'Shipped', total: '$120.80', trackingNumber: '1Z999AA10123456790', tags: [], fraudRisk: 'medium' },
    { id: 'ORD009', customer: 'Ava Rodriguez', email: 'ava@example.com', date: '2023-11-15', status: 'Delivered', total: '$275.00', trackingNumber: '1Z999AA10123456791', tags: ['High-Value'], fraudRisk: 'low' },
    { id: 'ORD010', customer: 'Ethan Martinez', email: 'ethan@example.com', date: '2023-11-14', status: 'Processing', total: '$80.90', trackingNumber: '', tags: [], fraudRisk: 'low' },
];

export type Order = typeof ordersData[0];
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';


export async function getOrders(): Promise<Order[]> {
    return Promise.resolve(ordersData);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    console.log(`Updating order ${orderId} to status ${status}`);
    
    // In a real app, you would update the database here.
    // For now, we update the mock data.
    const orderIndex = ordersData.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        ordersData[orderIndex].status = status;
        if (status === 'Cancelled') {
             ordersData[orderIndex].trackingNumber = '';
        }
        revalidatePath('/admin/orders');
        return { success: true, order: ordersData[orderIndex] };
    }
    return { success: false, message: 'Order not found' };
}

export async function updateShippingInfo(orderId: string, trackingNumber: string, customerEmail: string) {
     console.log(`Updating shipping for ${orderId} with tracking ${trackingNumber}`);
    
    const orderIndex = ordersData.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        const order = ordersData[orderIndex];
        order.trackingNumber = trackingNumber;
        if (trackingNumber) {
            order.status = 'Shipped';
        }
        
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.RESEND_FROM_EMAIL;

        if (!fromEmail) {
            console.error("RESEND_FROM_EMAIL is not set in environment variables. Cannot send shipping notification.");
            // We don't want to block the UI update if email fails, so just log it and return success.
            revalidatePath('/admin/orders');
            return { success: true, order: order };
        }

        // Send a shipping confirmation email
        try {
            await resend.emails.send({
                from: fromEmail,
                to: customerEmail,
                subject: `Your order ${order.id} has shipped!`,
                html: `
                    <h1>Your Order Has Shipped!</h1>
                    <p>Great news, ${order.customer}!</p>
                    <p>Your order #${order.id} from Curated Finds is on its way.</p>
                    <p>You can track your package using the following tracking number:</p>
                    <p><strong>${trackingNumber}</strong></p>
                    <p>Thank you for your purchase!</p>
                `,
            });
            console.log(`Shipping notification email sent to ${customerEmail}.`);
        } catch (error) {
            console.error("Failed to send shipping email via Resend:", error);
            // We don't want to block the UI update if email fails, so we'll just log it.
        }

        revalidatePath('/admin/orders');
        return { success: true, order: ordersData[orderIndex] };
    }
    return { success: false, message: 'Order not found' };
}
