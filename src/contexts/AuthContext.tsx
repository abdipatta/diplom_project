import axios, { AxiosError } from "axios";
import { ReactNode, createContext, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { NavigateFunction } from "react-router-dom";
import { addItemToStorage } from "../utils/helpers/storageHelpers";

type FormType = {
  email: string;
  password: string;
};

type AuthContextType = {
  signIn: (formValue: FormType, navigate: NavigateFunction) => void;
  isAuth: boolean;
  email: string;
  errorMessage: string | undefined;
  setIsAuth: (auth: boolean) => void;
  setEmail: (name: string) => void;
  logOut: () => void;
  setFullName: (name: string) => void;
  fullName: string;
};

type Props = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({ children }: Props) => {
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [fullName, setFullName] = useState("");

  const signIn = async (formValue: FormType, navigate: NavigateFunction) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth`, formValue);
      navigate("/orders");
      setIsAuth(true);
      setEmail(data.data.firstName);
      addItemToStorage(
        {
          email: data.data.email,
          isAuth,
          fullName: data.data.firstName + " " + data.data.lastName,
        },
        "LOGIN_DATA"
      );
    } catch (error) {
      const e = error as AxiosError<{
        status: number;
        message: string;
      }>;
      setErrorMessage(e.response?.data.message);
    }
  };

  const logOut = () => {
    localStorage.removeItem("LOGIN_DATA");
    setIsAuth(false);
    setEmail("");
  };

  const value = {
    signIn,
    isAuth,
    email,
    errorMessage,
    setIsAuth,
    setEmail,
    logOut,
    setFullName,
    fullName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
