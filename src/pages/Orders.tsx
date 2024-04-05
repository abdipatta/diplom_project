import axios, { AxiosError } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { Column, OrderType } from "../utils/types";
import { Table } from "../components/UI/Table";
import { Button } from "../components/UI/Button";
import { Modal } from "../components/UI/Modal";
import Close from "../assets/close.svg?react";
import { Input } from "../components/UI/Input";

const Orders = () => {
  const [orders, setOrders] = useState<OrderType[] | undefined>();
  const [openModal, setOpenModal] = useState(false);
  const [openSecondModal, setOpenSecondModal] = useState(false);
  const [userPrice, setUserPrice] = useState("");
  const [totalPrice] = useState(230);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");

  const openModalhandler = () => {
    setOpenModal(true);
  };

  const closeModalhandler = () => {
    setOpenModal(false);
  };

  const closeSecondModalhandler = () => {
    setOpenSecondModal(false);
  };

  const changeUserPrice = (e: ChangeEvent<HTMLInputElement>) => {
    setUserPrice(e.target.value);
  };

  const getOrders = async () => {
    try {
      const { data } = await axios.get<OrderType[]>(`${BASE_URL}/orders`);
      setOrders(data);
    } catch (error) {
      const e = error as AxiosError<{
        status: number;
        message: string;
      }>;
      setErrorMessage(e.response?.data.message);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const postOrder = async () => {
    try {
      await axios.post(`${BASE_URL}/orders`, {
        fullName: "John Doe",
        order: 320,
        price: 1500,
      });
      setOpenSecondModal(true);
      closeModalhandler();
      getOrders();
    } catch (error) {
      const e = error as AxiosError<{
        status: number;
        message: string;
      }>;
      setErrorMessage(e.response?.data.message);
    }
  };

  const orderColumns: Column<OrderType>[] = [
    {
      header: "Client name",
      key: "fullName",
    },
    {
      header: "Order",
      key: "order",
      render: (data) => <span>{data.order} kg</span>,
    },
    {
      header: "Price",
      key: "price",
      render: (data) => <span>{data.price} $</span>,
    },
    {
      header: "",
      key: "",
      render: () => <Button>Buy</Button>,
    },
  ];

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-orange font-bold mb-4 text-xl">Orders</h1>
        <div className="w-20">
          <Button onClick={openModalhandler}>Add</Button>
        </div>
      </div>
      {errorMessage && <p className="text-[#f00]">{errorMessage}</p>}
      {orders && (
        <Table
          columns={orderColumns}
          rows={orders}
          getUniqueId={(val) => val.id}
        />
      )}
      <Modal open={openModal} onClose={closeModalhandler}>
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-lg font-bold">Payment</h1>
          <Close onClick={closeModalhandler} />
        </div>
        <div className="flex justify-between mb-5">
          <p>Total price</p>
          <p>{totalPrice}$</p>
        </div>
        <div className="mb-5">
          <Input
            placeholder="user price"
            onChange={changeUserPrice}
            value={userPrice}
            error={!userPrice}
            type="number"
          />
        </div>
        <Button disabled={+userPrice < totalPrice} onClick={postOrder}>
          Save
        </Button>
      </Modal>
      <Modal open={openSecondModal} onClose={closeSecondModalhandler}>
        <div className="flex justify-between items-center  mb-5">
          <h1 className="text-lg font-bold">Rest money</h1>
          <Close onClick={closeSecondModalhandler} />
        </div>
        <div className="flex justify-between mb-5">
          <p>Total mount</p>
          <p>{+userPrice - totalPrice}$</p>
        </div>
        <Button variant="outlined" onClick={closeSecondModalhandler}>
          Back to orders
        </Button>
      </Modal>
    </>
  );
};

export default Orders;
