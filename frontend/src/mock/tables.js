export const TABLES = [
  // Ground floor
  { id: "table_01", number: 1, floor: "Ground", capacity: 2, status: "free",           currentOrderId: null },
  { id: "table_02", number: 2, floor: "Ground", capacity: 4, status: "occupied",       currentOrderId: "order_001" },
  { id: "table_03", number: 3, floor: "Ground", capacity: 4, status: "occupied",       currentOrderId: "order_002" },
  { id: "table_04", number: 4, floor: "Ground", capacity: 6, status: "free",           currentOrderId: null },
  { id: "table_05", number: 5, floor: "Ground", capacity: 4, status: "bill_requested", currentOrderId: "order_003" },
  { id: "table_06", number: 6, floor: "Ground", capacity: 2, status: "free",           currentOrderId: null },
  { id: "table_07", number: 7, floor: "Ground", capacity: 4, status: "free",           currentOrderId: null },
  // First floor
  { id: "table_08", number: 8,  floor: "First", capacity: 4, status: "occupied", currentOrderId: "order_004" },
  { id: "table_09", number: 9,  floor: "First", capacity: 6, status: "free",     currentOrderId: null },
  { id: "table_10", number: 10, floor: "First", capacity: 4, status: "free",     currentOrderId: null },
  { id: "table_11", number: 11, floor: "First", capacity: 2, status: "occupied", currentOrderId: "order_005" },
  { id: "table_12", number: 12, floor: "First", capacity: 8, status: "free",     currentOrderId: null },
]
