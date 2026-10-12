export interface OrderItem {
  code_product: string;
  code_category: string;
  descr_product: string;
  quantity: number;
}

export interface OrderDocument {
  first_name: string;
  last_name: string;
  address: string;
  mail: string;
  datetime: string;
  items: OrderItem[];
}

export interface OrderResponse extends OrderDocument {
  id: string;
}
