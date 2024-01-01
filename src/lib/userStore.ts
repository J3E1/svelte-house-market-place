import { writable } from 'svelte/store';
import type { ResponseListing } from '../routes/category/[categoryName]/+page.server';

interface UserStore {
	listings: ResponseListing[];
	uid: string;
}

export const userStore = writable<UserStore>({
	listings: [],
	uid: ''
});
