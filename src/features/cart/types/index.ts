export type CartPizza = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
};

export type CartItem = {
    pizza: CartPizza;
    quantity: number;
};

export type CustomerData = {
    name: string;
    cep: string;
    state: string;
    city: string;
    district: string;
    street: string;
    number: string;
    complement?: string;
};
