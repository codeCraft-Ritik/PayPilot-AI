import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OrderRecord } from '@paypilot/shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../../.data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

export interface IOrderRepository {
  create(order: OrderRecord): OrderRecord;
  getById(id: string): OrderRecord | undefined;
  getByPaypalOrderId(paypalOrderId: string): OrderRecord | undefined;
  update(id: string, updates: Partial<OrderRecord>): OrderRecord;
  getAll(): OrderRecord[];
}

export class OrderRepository implements IOrderRepository {
  private orders: Map<string, OrderRecord> = new Map();

  constructor() {
    this.ensureDataDir();
    this.loadFromDisk();
  }

  private ensureDataDir(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
      console.warn('⚠️ Could not create data directory for orders:', err);
    }
  }

  private loadFromDisk(): void {
    try {
      if (fs.existsSync(ORDERS_FILE)) {
        const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
        const list: OrderRecord[] = JSON.parse(raw);
        for (const order of list) {
          this.orders.set(order.id, order);
        }
      }
    } catch (err) {
      console.warn('⚠️ Could not read orders from disk:', err);
    }
  }

  private saveToDisk(): void {
    try {
      this.ensureDataDir();
      const list = Array.from(this.orders.values());
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.warn('⚠️ Could not persist orders to disk:', err);
    }
  }

  public create(order: OrderRecord): OrderRecord {
    this.orders.set(order.id, order);
    this.saveToDisk();
    return order;
  }

  public getById(id: string): OrderRecord | undefined {
    return this.orders.get(id);
  }

  public getByPaypalOrderId(paypalOrderId: string): OrderRecord | undefined {
    for (const order of this.orders.values()) {
      if (order.paypalOrderId === paypalOrderId) {
        return order;
      }
    }
    return undefined;
  }

  public update(id: string, updates: Partial<OrderRecord>): OrderRecord {
    const existing = this.orders.get(id);
    if (!existing) {
      throw new Error(`Order ${id} does not exist for update`);
    }

    const updated: OrderRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.orders.set(id, updated);
    this.saveToDisk();
    return updated;
  }

  public getAll(): OrderRecord[] {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export const orderRepository = new OrderRepository();
