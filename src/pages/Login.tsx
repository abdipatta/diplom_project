import { Button } from "../components/UI/Button";
import { Input } from "../components/UI/Input";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseEye from "../assets/close-eye.svg?react";
import Eye from "../assets/eye.svg?react";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const ctx = useContext(AuthContext);

  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });

  const changeFormValue = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const login = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    ctx?.signIn(formValue, navigate);
  };

  const toggleVisiblePassword = () =>
    setPasswordVisible((prevState) => !prevState);

  const disabledBtn = !formValue.password || !formValue.email;

  return (
    <div className="bg-white px-5 py-10 rounded-3xl sm:w-96 shadow-xl mx-auto mt-14 text-center">
      <h1 className="font-bold mb-7 sm:text-base text-xl">Login</h1>

      <form className="flex flex-col gap-3" onSubmit={login}>
        <Input
          onChange={changeFormValue}
          value={formValue.email}
          error={!formValue.email}
          name="email"
          placeholder="Email"
          type="email"
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

        {ctx?.errorMessage && (
          <p className="text-[#f00]">{ctx?.errorMessage}</p>
        )}

        <Button disabled={disabledBtn} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
