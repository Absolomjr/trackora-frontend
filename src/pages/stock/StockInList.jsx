import { FiArrowDownCircle } from "react-icons/fi";

import StockMovementList from "./StockMovementList";
import { stockIn } from "../../api/stockApi";

export default function StockInList() {
  return (
    <StockMovementList
      api={stockIn}
      kind="in"
      title="Stock In"
      subtitle="Record incoming stock and receive deliveries."
      icon={<FiArrowDownCircle />}
    />
  );
}
