import { useEffect, useState } from "react";

const useLocalStorage = <T,>(key: string, initialValue: T) => {
	const [value, setValue] = useState<T>(() => {
		const value = window.localStorage.getItem(key);
		if (value) {
			return JSON.parse(value);
		}

		if (typeof initialValue === "function") {
			return initialValue();
		}

		return initialValue;
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [value, key]);

	return [value, setValue] as [T, typeof setValue];
};

export default useLocalStorage;
