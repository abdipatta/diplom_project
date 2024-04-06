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
  const [order, setOrder] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [totalOrder, setTotalOrder] = useState(0);
  const [orderId, setOrderId] = useState<number | null>(null);

  const openModalhandler = (data: OrderType) => {
    setOpenModal(true);
    setOrder(data.order);
    setOrderId(data.id);
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
  useEffect(() => {
    if (orders) {
      setTotalOrder(
        orders.reduce((acc, cur) => acc + cur.buyerMoney - cur.change, 0)
      );
    }
  }, [orders]);

  const postOrder = async () => {
    try {
      await axios.patch(`${BASE_URL}/orders/${orderId}`, {
        buyerMoney: +userPrice,
        change: +userPrice - order,
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
      header: "Cashier name",
      key: "fullName",
    },
    {
      header: "Order",
      key: "order",
      render: (data) => <span>{data.order} $</span>,
    },
    {
      header: "Buyer's money",
      key: "buyerMoney",
      render: (data) => <span>{data.buyerMoney} $</span>,
    },
    {
      header: "Change",
      key: "change",
      render: (data) => <span>{data.change} $</span>,
    },
    {
      header: "",
      key: "",
      render: (data) => (
        <Button onClick={() => openModalhandler(data)}>Buy</Button>
      ),
    },
  ];

  return (
    <>
      <h1 className="text-orange font-bold mb-4 text-xl">Orders</h1>
      {errorMessage && <p className="text-[#f00]">{errorMessage}</p>}
      {orders && (
        <>
          <Table
            columns={orderColumns}
            rows={orders}
            getUniqueId={(val) => val.id}
          />
          <p>Total order {totalOrder}$</p>
        </>
      )}
      <Modal open={openModal} onClose={closeModalhandler}>
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-lg font-bold">Payment</h1>
          <Close onClick={closeModalhandler} />
        </div>
        <div className="flex justify-between mb-5">
          <p>Total price</p>
          <p>{order}$</p>
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
        <Button disabled={+userPrice < order} onClick={postOrder}>
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
          <p>{+userPrice - order}$</p>
        </div>
        <Button variant="outlined" onClick={closeSecondModalhandler}>
          Back to orders
        </Button>
      </Modal>
    </>
  );
};

export default Orders;
