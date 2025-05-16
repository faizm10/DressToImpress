export interface CartItem extends Attire {
  quantity: number;
}

export interface Attire {
  id: string;
  name: string;
  gender: string;
  size: string;
  category: string;
  file_name: string; 
}

export interface AttireWithUrl extends Attire {
  imageUrl: string | null;
}
