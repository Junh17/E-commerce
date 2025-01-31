import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user:null,
    loading:false,
    checkingAuth:true,

    signup: async ({name, email, password, confirmPassword}) => {
        set({loading: true});
        if (password !== confirmPassword) {
            set({loading: false});
            toast.error("Passwords do not match");
        }

        try {
            const res =  await axios.post("/auth/signup", {name, email, password});
            set({user: res.data, loading:false});
        } catch (error) {
            set({loading:false});
            toast.error(error.response.data.message || "An error occurred");

        }
    },

    login: async ({email, password}) => {
        set({loading: true});
        try {
            const res = await axios.post("/auth/login", {email, password});
            set({user: res.data, loading: false});
        } catch (error) {
            set({loading:false});
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    logout: async () => {
        try{
            set({user:null});
            await axios.post("/auth/logout");
            toast.success('Logout successful');
        } catch (error){
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    checkAuth: async () => {
        set({checkingAuth: true});
    
        try {
            const res = await axios.get("/auth/profile");
            set({user: res.data, checkingAuth: false});
        } catch (error) {
            console.log(error.message);
            set({checkingAuth: false, user: null});
        }
    },
    refreshToken: async () => {
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},

    
}));


