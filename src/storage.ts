import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface LoginStore {
    id: number;
    fullname: string;
    level: string;
    setAccount: (id: number, data: string, level: string) => void;
}

const useLoginStore = create<LoginStore>()(
  devtools(
    persist(
      (set) => ({
        id: 0,
        fullname: "",
        level: "",
        setAccount: (id: number, fullname: string, level: string) => set(() => ({ id: id, fullname: fullname, level:level })),
      }),
      //this persist for token store in session storage
      { name: "login-account" }
    )
  )
);

export default useLoginStore;
