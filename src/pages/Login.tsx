import axios, { AxiosError } from "axios";
import { Button } from "../components/UI/Button";
import { Input } from "../components/UI/Input";
import { BASE_URL } from "../utils/constants";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseEye from "../assets/close-eye.svg?react";
import Eye from "../assets/eye.svg?react";
import { addItemToStorage } from "../utils/helpers/storageHelpers";

export const Login = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [formValue, setFormValue] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");

  const changeFormValue = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${BASE_URL}/auth`, formValue);
      navigate("/orders");
      addItemToStorage(
        { username: data.data.username, isAuth: true },
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

  const toggleVisiblePassword = () =>
    setPasswordVisible((prevState) => !prevState);

  const disabledBtn = !formValue.password || !formValue.username;

  return (
    <div className="bg-white px-5 py-10 rounded-3xl sm:w-96 shadow-xl mx-auto mt-14 text-center">
      <h1 className="font-bold mb-7 sm:text-base text-xl">Login</h1>

      <form className="flex flex-col gap-3" onSubmit={login}>
        <Input
          onChange={changeFormValue}
          value={formValue.username}
          error={!formValue.username}
          name="username"
          placeholder="Username"
        />

        <Input
          onChange={changeFormValue}
          value={formValue.password}
          error={!formValue.password}
          name="password"
          placeholder="Password"
          onClick={toggleVisiblePassword}
          icon={passwordVisible ? <CloseEye /> : <Eye />}
          type={passwordVisible ? "text" : "password"}
        />

        {errorMessage && <p className="text-[#f00]">{errorMessage}</p>}

        <Button disabled={disabledBtn} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
};
