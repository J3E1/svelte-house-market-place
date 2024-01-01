import { writable } from 'svelte/store';

export type Listing = {
	name: string;
	bedrooms: string;
	bathrooms: string;
	address: string;
	regularPrice: string;
	type: 'rent' | 'sale';
	parking: 'yes' | 'no';
	furnished: 'yes' | 'no';
	images: File[];
} & ({ offer: 'yes'; discountedPrice: string } | { offer: 'no' });
export const listings = writable<Listing[]>([]);
