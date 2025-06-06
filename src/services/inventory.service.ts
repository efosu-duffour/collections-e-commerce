import { ProductID } from "./products.service";

export type SKU = string;
export type ProductColor = string;
export type Size = string | number | null;
export type Stock = number;
export type Price = number;
export type Discount = number | null;
export type DiscountPerct = number | null;
export type ProductSold = number;

export type Inventory = {
  product_id: ProductID;
  sku: SKU;
  color: ProductColor;
  size: Size;
  sale_price: Price;
  list_price: Price;
  discount: Discount;
  discount_percentage: DiscountPerct;
  sold: ProductSold;
  stock: Stock;
};

const SESSIONNAME = "sn-inventories";
export class InventoryService {
  createdAt?: number;
  private _inventories?: Inventory[];
  private _INVENTORIESAPI = import.meta.env.BASE_URL + "data/inventory.json";

  constructor() {
    if (InventoryService._INSTANCE) return InventoryService._INSTANCE;
    else {
      this.createdAt = Date.now();
      InventoryService._INSTANCE = this;
    }

    this.init()
      .then((inventories) => {
        this._inventories = inventories;
      })
      .catch((err) => console.warn(err));
  }

  async init(): Promise<Inventory[]> {
    // Fetches the inventories from server or cache
    if (this._inventories) return this._inventories;
    let inventories: Inventory[] = [];

    const cachedInvetories = sessionStorage.getItem(SESSIONNAME);
    if (cachedInvetories && cachedInvetories.length !== 0) {
      inventories = JSON.parse(cachedInvetories);
    } else {
      inventories = await this._fetchInventories();
      sessionStorage.setItem(SESSIONNAME, JSON.stringify(inventories));
    }

    return inventories;
  }

  private async _fetchInventories(): Promise<Inventory[]> {
    // Fetches inventories json from cache if not fetch from server, cache and store it in the local variable
    let fetchedInventories: Inventory[] = [];
    try {
      const response = await fetch(this._INVENTORIESAPI);
      const json: Inventory[] = await response.json();
      fetchedInventories = json;
    } catch (err: unknown) {
      console.warn(err);
    }

    return fetchedInventories;
  }

  get inventories(): Inventory[] {
    return this._inventories ?? [];
  }

  static getInventoriesByID(
    inventories: Inventory[],
    id: ProductID
  ): Inventory[] {
    // Get the available inventories of the specified product ID
    return inventories.filter((inventory) => inventory.product_id === id);
  }

  getInventoriesByID(id: ProductID): Inventory[] {
    // Get the available inventories of the specified product ID
    return InventoryService.getInventoriesByID(this.inventories, id);
  }

  static getInventoriesByColor(
    inventories: Inventory[],
    color: ProductColor
  ): Inventory[] {
    // Get the inventories according to the color
    return inventories.filter((inventory) => inventory.color === color);
  }

  getInventoriesByColor(color: ProductID): Inventory[] {
    // Get the inventories according to the color
    return InventoryService.getInventoriesByColor(this._inventories ?? [], color);
  }

  static getSizes(inventories: Inventory[]): Size[] {
    // Get the available sizes of the inventory
    const result: Set<Size> = new Set();
    for (let i = 0; i < inventories.length; i++) {
      const size = inventories[i].size;
      if (size === null || result.has(size)) continue;

      result.add(size);
    }
    return [...result];
  }

  getSizes(): Size[] {
    // Get the available sizes of the inventory
    return InventoryService.getSizes(this.inventories);
  }

  static getSizesByColor(
    inventories: Inventory[],
    color: ProductColor
  ): Size[] {
    // Get the sizes of the specified color
    const availableinventories = InventoryService.getInventoriesByColor(
      inventories,
      color
    );
    const sizes = InventoryService.getSizes(availableinventories);
    return sizes;
  }

  getSizesByColor(color: ProductColor): Size[] {
    // Get the sizes of the specified color
    return InventoryService.getSizesByColor(this._inventories ?? [], color);
  }

  private static _INSTANCE: InventoryService | null = null;
}