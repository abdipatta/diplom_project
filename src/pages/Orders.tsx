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
  const [totalOrder, setTotalOrder] = useState<number>(0);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [openCashOutModal, setOpenCashOutModal] = useState(false);
  const [amount, setAmount] = useState<string>("");

  const openModalhandler = (data: OrderType) => {
    setOpenModal(true);
    setOrder(data.order);
    setOrderId(data.id);
    setUserPrice("");
  };

  const openCashOutModalHandler = () => {
    setOpenCashOutModal(true);
  };

  const closeCashOutModalHandler = () => {
    setOpenCashOutModal(false);
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

  const withdrawMoneyHandler = () => {
    const res = totalOrder && totalOrder - +amount;
    if (res) {
      changeOrder(res);
      setAmount("");
    }
    closeCashOutModalHandler();
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

  const getTotalOrder = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/total-order`);
      setTotalOrder(data[0].order);
    } catch (error) {
      const e = error as AxiosError<{
        status: number;
        message: string;
      }>;
      setErrorMessage(e.response?.data.message);
    }
  };

  useEffect(() => {
    getTotalOrder();
  }, []);

  const changeOrder = async (res: number | undefined) => {
    try {
      await axios.patch(`${BASE_URL}/total-order/1`, { order: res });
      await getTotalOrder();
    } catch (error) {
      const e = error as AxiosError<{
        status: number;
        message: string;
      }>;
      setErrorMessage(e.response?.data.message);
    }
  };

  const postOrder = async () => {
    try {
      const paidObj = {
        paid: +userPrice,
        change: +userPrice - order,
      };
      await axios.patch(`${BASE_URL}/orders/${orderId}`, paidObj);
      setOpenSecondModal(true);
      changeOrder(totalOrder + order);
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
      header: "Paid",
      key: "paid",
      render: (data) => <span>{data.paid} $</span>,
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
          <p>Total order {totalOrder && totalOrder}$</p>
          <div className="w-32">
            <Button onClick={openCashOutModalHandler}>Cash out</Button>
          </div>
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
          {/* change this line */}
          <p>{+userPrice - +order}$</p>
        </div>
        <Button variant="outlined" onClick={closeSecondModalhandler}>
          Back to orders
        </Button>
      </Modal>

      <Modal open={openCashOutModal} onClose={closeCashOutModalHandler}>
        <div className="flex flex-col gap-4">
          <p>Total order {totalOrder && totalOrder}$</p>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="Amount"
            min={0}
          />
          <Button
            onClick={withdrawMoneyHandler}
            disabled={!amount || +amount > totalOrder}
          >
            Withdraw money
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Orders;
