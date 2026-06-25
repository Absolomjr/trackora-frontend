import { FiArrowUpCircle } from "react-icons/fi";

import StockMovementList from "./StockMovementList";
import { stockOut } from "../../api/stockApi";

export default function StockOutList() {
  return (
    <StockMovementList
      api={stockOut}
      kind="out"
      title="Stock Out"
      subtitle="Record stock leaving outside of sales (write-offs, damages)."
      icon={<FiArrowUpCircle />}
    />
  );
}
