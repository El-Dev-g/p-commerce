
'use server';

import { revalidatePath } from 'next/cache';

// Mock data store
let ordersData = [
    { id: 'ORD001', customer: 'Liam Johnson', date: '2023-11-23', status: 'Delivered', total: '$250.00', trackingNumber: '1Z999AA10123456784', tags: ['High-Value'], fraudRisk: 'low' },
    { id: 'ORD002', customer: 'Olivia Smith', date: '2023-11-22', status: 'Shipped', total: '$150.75', trackingNumber: '1Z999AA10123456785', tags: ['Apparel'], fraudRisk: 'low' },
    { id: 'ORD003', customer: 'Noah Williams', date: '2023-11-21', status: 'Delivered', total: '$350.00', trackingNumber: '1Z999AA10123456786', tags: ['High-Value', 'Fragile'], fraudRisk: 'low' },
    { id: 'ORD004', customer: 'Emma Brown', date: '2023-11-20', status: 'Processing', total: '$450.50', trackingNumber: '', tags: ['High-Value'], fraudRisk: 'high' },
    { id: 'ORD005', customer: 'James Jones', date: '2023-11-19', status: 'Delivered', total: '$550.00', trackingNumber: '1Z9A9A9A0192783421', tags: ['High-Value', 'Gift'], fraudRisk: 'low' },
    { id: 'ORD006', customer: 'Sophia Garcia', date: '2023-11-18', status: 'Cancelled', total: '$50.25', trackingNumber: '', tags: ['Home Goods'], fraudRisk: 'low' },
    { id: 'ORD007', customer: 'Isabella Miller', date: '2023-11-17', status: 'Delivered', total: '$100.00', trackingNumber: '1Z999AA10123456789', tags: ['Stationery'], fraudRisk: 'low' },
    { id: 'ORD008', customer: 'Mason Davis', date: '2023-11-16', status: 'Shipped', total: '$120.80', trackingNumber: '1Z999AA10123456790', tags: [], fraudRisk: 'medium' },
    { id: 'ORD009', customer: 'Ava Rodriguez', date: '2023-11-15', status: 'Delivered', total: '$275.00', trackingNumber: '1Z999AA10123456791', tags: ['High-Value'], fraudRisk: 'low' },
    { id: 'ORD010', customer: 'Ethan Martinez', date: '2023-11-14', status: 'Processing', total: '$80.90', trackingNumber: '', tags: [], fraudRisk: 'low' },
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

export async function updateShippingInfo(orderId: string, trackingNumber: string, customerPhone: string) {
     console.log(`Updating shipping for ${orderId} with tracking ${trackingNumber}`);
    
    const orderIndex = ordersData.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        ordersData[orderIndex].trackingNumber = trackingNumber;
        if (trackingNumber) {
            ordersData[orderIndex].status = 'Shipped';
        }
        
        // Simulate sending a WhatsApp notification
        try {
            // NOTE: This uses a hardcoded origin for server-side actions. 
            // In a real deployed environment, you'd use environment variables.
            await fetch(`http://localhost:9002/api/v1/send-whatsapp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: customerPhone,
                    type: 'shipping_update',
                    orderId: orderId,
                    trackingNumber: trackingNumber,
                    carrier: 'Auto-Detect',
                }),
            });
             console.log("WhatsApp tracking update triggered successfully.");
        } catch (error) {
             console.error("Failed to trigger WhatsApp tracking message:", error);
        }

        revalidatePath('/admin/orders');
        return { success: true, order: ordersData[orderIndex] };
    }
    return { success: false, message: 'Order not found' };
}
