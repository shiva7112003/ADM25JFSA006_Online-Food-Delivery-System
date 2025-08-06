export interface OrderDetail {
  orderId: string;
  id: number;     
  restaurant_id: number;   
  restaurant:string;
  orderDate: string;
  deliveryDate: string;
  status: 'Delivered' | 'Pending' | 'Cancelled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}
