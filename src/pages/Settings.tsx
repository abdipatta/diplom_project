import { IconButton } from "../components/UI/IconButton";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Modal } from "../components/UI/Modal";
import { Input } from "../components/UI/Input";
import { Button } from "../components/UI/Button";
import Pencil from "../assets/pencil.svg?react";
import Trash from "../assets/trash.svg?react";
import Close from "../assets/close.svg?react";
import CloseEye from "../assets/close-eye.svg?react";
import Eye from "../assets/eye.svg?react";
import { UserType } from "../utils/types";
import axios, { AxiosError } from "axios";
import { BASE_URL, SELECT_OPTIONS } from "../utils/constants";
import { Select } from "../components/UI/Select";

const Settings = () => {
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [isEdit, setIsEdit] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [formValue, setFormValue] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    password: "",
    role: "user",
    email: "",
  });

  const openModalhandler = () => {
    setOpenEditModal(true);
    setIsEdit(false);
    setFormValue({
      email: "",
      firstName: "",
      lastName: "",
      middleName: "",
      password: "",
      role: "user",
    });
  };

  const openEditModalHandler = (user: UserType) => {
    setOpenEditModal(true);
    setIsEdit(true);
    setUserId(user.id);
    setFormValue({
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      password: user.password,
      role: user.role,
      email: user.email,
    });
  };

  const closeModalhandler = () => {
    setOpenEditModal(false);
  };

  const toggleVisiblePassword = () =>
    setPasswordVisible((prevState) => !prevState);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChangeValue = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormValue((prevState) => ({ ...prevState, role: e.target.value }));
  };

  const getUsers = async () => {
    try {
      const { data } = await axios.get<UserType[]>(`${BASE_URL}/users`);

      setUsers(data);
    } catch (error) {
      const e = error as AxiosError<{
        status: number;
        message: string;
      }>;
      setErrorMessage(e.response?.data.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const addUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/users`, formValue);
      closeModalhandler();
      getUsers();
      setFormValue({
        email: "",
        firstName: "",
        lastName: "",
        middleName: "",
        password: "",
        role: "user",
      });
    } catch (error) {
      const e = error as AxiosError<{
        status: number;
        message: string;
      }>;
      setErrorMessage(e.response?.data.message);
    }
  };

  const editUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.patch(`${BASE_URL}/users/${userId}`, formValue);
      getUsers();
      closeModalhandler();
    } catch (error) {
      const e = error as AxiosError<{
        status: number;
        message: string;
      }>;
      setErrorMessage(e.response?.data.message);
    }
  };

  const deleteUser = async (id: number | undefined) => {
    try {
      await axios.delete(`${BASE_URL}/users/${id}`);
      getUsers();
    } catch (error) {
      const e = error as AxiosError<{
        status: number;
        message: string;
      }>;
      setErrorMessage(e.response?.data.message);
    }
  };

  const disabledBtn =
    !formValue.password ||
    !formValue.firstName ||
    !formValue.lastName ||
    !formValue.middleName ||
    !formValue.role;

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-orange font-bold mb-4 text-xl">Settings</h1>
        <div className="w-20">
          <Button onClick={openModalhandler}>Add</Button>
        </div>
      </div>
      <div className="h-[75vh] overflow-hidden overflow-y-auto">
        {users &&
          users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between border-b border-dashed py-3 mr-5"
            >
              <div>
                <p className="font-bold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="mb-2 font-bold max-w-40 overflow-hidden text-ellipsis">
                  {user.email}
                </p>

                <p className="bg-light-orange text-orange text-center rounded-xl text-sm w-fit px-3 capitalize">
                  {user.role}
                </p>
              </div>
              <div className="flex sm:flex-col flex-row h-8 gap-2">
                {user.email !== "admin@gmail.com" && (
                  <>
                    <IconButton
                      icon={<Pencil />}
                      onClick={() => openEditModalHandler(user)}
                    />
                    <IconButton
                      icon={<Trash />}
                      onClick={() => deleteUser(user.id)}
                      variant="outlined"
                    />
                  </>
                )}
              </div>
            </div>
          ))}
      </div>

      <Modal open={openEditModal} onClose={closeModalhandler}>
        <div className="flex justify-between items-center mb-5 sm:w-auto w-64">
          <h1 className="text-xl text-orange font-semibold">Edit</h1>
          <Close className="cursor-pointer" onClick={closeModalhandler} />
        </div>
        <form
          className="flex flex-col gap-3"
          onSubmit={isEdit ? editUser : addUser}
        >
          <Input
            placeholder="First name"
            onChange={handleChangeValue}
            value={formValue.firstName}
            name="firstName"
            error={!formValue.firstName}
          />
          <Input
            placeholder="Last name"
            onChange={handleChangeValue}
            value={formValue.lastName}
            name="lastName"
            error={!formValue.lastName}
          />
          <Input
            placeholder="Middle name"
            onChange={handleChangeValue}
            value={formValue.middleName}
            name="middleName"
            error={!formValue.middleName}
          />
          <Input
            placeholder="Email"
            onChange={handleChangeValue}
            value={formValue.email}
            name="email"
            error={!formValue.email}
            type="email"
          />
          <Input
            placeholder="Password"
            onChange={handleChangeValue}
            value={formValue.password}
            name="password"
            type={passwordVisible ? "text" : "password"}
            onClick={toggleVisiblePassword}
            icon={passwordVisible ? <CloseEye /> : <Eye />}
            error={!formValue.password}
          />
          <Select
            options={SELECT_OPTIONS}
            onChange={handleRoleChangeValue}
            value={formValue.role}
            name="role"
          />
          {errorMessage && <p className="text-[#f00]">{errorMessage}</p>}
          <div className="flex gap-3 mt-5">
            <Button variant="outlined" onClick={closeModalhandler}>
              Go back
            </Button>
            <Button type="submit" disabled={!!disabledBtn}>
              {isEdit ? "Edit" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Settings;
