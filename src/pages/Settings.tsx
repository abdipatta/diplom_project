import { IconButton } from "../components/UI/IconButton";
import { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";

const Settings = () => {
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [isEdit, setIsEdit] = useState(false);
  const [userId, setUserId] = useState<number | undefined>();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const {
    reset,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      password: "",
      role: "user",
      email: "",
    },
  });

  const openModalhandler = () => {
    setOpenEditModal(true);
    setIsEdit(false);
    reset({
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
    setValue("firstName", user.firstName);
    reset({
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

  const openDeleteModalHandler = (id: number | undefined) => {
    setOpenDeleteModal(true);
    setUserId(id);
  };
  const closeDeleteModalhandler = () => {
    setOpenDeleteModal(false);
  };

  const toggleVisiblePassword = () =>
    setPasswordVisible((prevState) => !prevState);

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

  const addUser = async (value: UserType) => {
    try {
      await axios.post(`${BASE_URL}/users`, value);
      closeModalhandler();
      getUsers();
      reset({
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

  const editUser = async (value: UserType) => {
    try {
      await axios.patch(`${BASE_URL}/users/${userId}`, value);
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

  const deleteUser = async () => {
    try {
      await axios.delete(`${BASE_URL}/users/${userId}`);
      getUsers();
      closeDeleteModalhandler();
    } catch (error) {
      const e = error as AxiosError<{
        status: number;
        message: string;
      }>;
      setErrorMessage(e.response?.data.message);
    }
  };

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
                      onClick={() => openDeleteModalHandler(user.id)}
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
          <h1 className="text-xl text-orange font-semibold">
            {isEdit ? "Edit" : "Save"}
          </h1>
          <Close className="cursor-pointer" onClick={closeModalhandler} />
        </div>
        <form
          className="flex flex-col gap-3"
          onSubmit={isEdit ? handleSubmit(editUser) : handleSubmit(addUser)}
        >
          <Input
            placeholder="First name"
            {...register("firstName", { required: true })}
            name="firstName"
            error={!!errors.firstName}
          />
          <Input
            placeholder="Last name"
            {...register("lastName", { required: true })}
            name="lastName"
            error={!!errors.lastName}
          />
          <Input
            placeholder="Middle name"
            {...register("middleName", { required: true })}
            name="middleName"
            error={!!errors.middleName}
          />
          <Input
            placeholder="Email"
            {...register("email", { required: true })}
            name="email"
            error={!!errors.email}
            type="email"
          />
          <Input
            placeholder="Password"
            {...register("password", { required: !isEdit })}
            name="password"
            type={passwordVisible ? "text" : "password"}
            onClick={toggleVisiblePassword}
            icon={passwordVisible ? <CloseEye /> : <Eye />}
            error={!!errors.password}
          />
          <Select
            options={SELECT_OPTIONS}
            {...register("role", { required: true })}
            name="role"
          />
          {errorMessage && <p className="text-[#f00]">{errorMessage}</p>}
          <div className="flex gap-3 mt-5">
            <Button variant="outlined" onClick={closeModalhandler}>
              Go back
            </Button>
            <Button type="submit">{isEdit ? "Edit" : "Save"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={openDeleteModal} onClose={closeDeleteModalhandler}>
        <h3 className="text-xl mb-4 text-center font-bold">
          Are you sure you want to delete this?
        </h3>
        <div className="flex gap-4">
          <Button variant="outlined" onClick={closeDeleteModalhandler}>
            Cancel
          </Button>
          <Button onClick={deleteUser}>Yes</Button>
        </div>
      </Modal>
    </>
  );
};

export default Settings;
