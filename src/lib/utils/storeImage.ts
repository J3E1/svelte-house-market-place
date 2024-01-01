import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import generateUniqueId from './generateId';
import { storage } from '$lib/firebase';

export default async function (image: File, uid: string) {
	return new Promise((resolve, reject) => {
		const fileName = `${uid}-${image.name}-${generateUniqueId()}`;

		const storageRef = ref(storage, 'images/' + fileName);

		const uploadTask = uploadBytesResumable(storageRef, image);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log('Upload is ' + progress + '% done');
				switch (snapshot.state) {
					case 'paused':
						console.log('Upload is paused');
						break;
					case 'running':
						console.log('Upload is running');
						break;
					default:
						break;
				}
			},
			(error) => {
				reject(error);
			},
			() => {
				// Handle successful uploads on complete
				// For instance, get the download URL: https://firebasestorage.googleapis.com/...
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					resolve(downloadURL);
				});
			}
		);
	});
}
