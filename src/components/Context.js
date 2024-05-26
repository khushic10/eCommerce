"use client";
import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const initialData = {
		name: "",
		email: "",
		phone: "",
		country: "",
		city: "",
		area: "",
		street: "",
		latitude: "",
		longitude: "",
	};
	const [formData, setFormData] = useState(initialData);

	return (
		<AppContext.Provider value={{ formData, setFormData }}>
			{children}
		</AppContext.Provider>
	);
};
