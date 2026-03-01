import OrderStatusCards from "@/components/Order/OrderStatusCards";
import Navbar from "../components/Navbar";
import OrderList from "@/components/Order/OrdersList";

export default function Orders() {
  return (
    <div className="mt-12 md:mt-0 ">
      <Navbar pageTitle="Order Management" />
      <div>
        <OrderStatusCards />
        {/* <OrderStatusDropdown /> */}
        <OrderList />
      </div>
    </div>
  );
}
