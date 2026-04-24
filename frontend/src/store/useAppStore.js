import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api'
import { calculateBill } from '../utils/invoice'

const EMPTY_ACTIVE_ORDER = {
  tableId: null,
  tableNumber: null,
  type: 'Dine In',
  customerName: '',
  customerMobile: '',
  items: [],
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ── Navigation ──────────────────────────────────────────────
      currentView: 'pos',
      setView: (view) => set({ currentView: view }),

      // ── Initialization ──────────────────────────────────────────
      fetchInitialData: async () => {
        try {
          const [menuRes, tablesRes, ordersRes] = await Promise.all([
            api.get('/menu'),
            api.get('/tables'),
            api.get('/orders')
          ])
          
          const categories = ["All", ...new Set(menuRes.data.map(item => item.category))]
          
          set({
            menuItems: menuRes.data.map(i => ({ ...i, id: i._id })),
            categories,
            tables: tablesRes.data.map(t => ({ ...t, id: t._id })),
            orders: ordersRes.data.map(o => ({ ...o, id: o._id }))
          })
        } catch (error) {
          console.error("Failed to fetch initial data:", error)
        }
      },

      // ── Menu ────────────────────────────────────────────────────
      menuItems: [],
      categories: ["All"],
      activeCategory: 'All',
      searchQuery: '',
      setActiveCategory: (cat) => set({ activeCategory: cat }),
      setSearchQuery: (q) => set({ searchQuery: q }),

      // Derived: filtered menu items
      getFilteredItems: () => {
        const { menuItems, activeCategory, searchQuery } = get()
        return menuItems.filter(item => {
          const matchCat = activeCategory === 'All' || item.category === activeCategory
          const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
          return matchCat && matchSearch
        })
      },

      // ── Tables ──────────────────────────────────────────────────
      tables: [],
      selectedTableId: null,
      setSelectedTable: (tableId) => {
        const table = get().tables.find(t => t.id === tableId)
        set({
          selectedTableId: tableId,
          activeOrder: {
            ...get().activeOrder,
            tableId,
            tableNumber: table ? table.number : null,
          }
        })
      },

      // ── Active Order (being built on POS) ───────────────────────
      activeOrder: { ...EMPTY_ACTIVE_ORDER },

      setOrderType: (type) => set(s => ({
        activeOrder: { ...s.activeOrder, type }
      })),

      setCustomerInfo: (name, mobile) => set(s => ({
        activeOrder: { ...s.activeOrder, customerName: name, customerMobile: mobile }
      })),

      addItemToOrder: (item) => {
        const { activeOrder } = get()
        const existing = activeOrder.items.find(i => i.itemId === item.id)
        if (existing) {
          set(s => ({
            activeOrder: {
              ...s.activeOrder,
              items: s.activeOrder.items.map(i =>
                i.itemId === item.id ? { ...i, qty: i.qty + 1 } : i
              )
            }
          }))
        } else {
          set(s => ({
            activeOrder: {
              ...s.activeOrder,
              items: [
                ...s.activeOrder.items,
                { itemId: item.id, name: item.name, qty: 1, price: item.price }
              ]
            }
          }))
        }
      },

      updateItemQty: (itemId, qty) => {
        if (qty <= 0) {
          get().removeItemFromOrder(itemId)
          return
        }
        set(s => ({
          activeOrder: {
            ...s.activeOrder,
            items: s.activeOrder.items.map(i =>
              i.itemId === itemId ? { ...i, qty } : i
            )
          }
        }))
      },

      removeItemFromOrder: (itemId) => set(s => ({
        activeOrder: {
          ...s.activeOrder,
          items: s.activeOrder.items.filter(i => i.itemId !== itemId)
        }
      })),

      clearActiveOrder: () => set({ activeOrder: { ...EMPTY_ACTIVE_ORDER }, selectedTableId: null }),

      // ── Held Orders (Critical Fix 2) ────────────────────────────
      heldOrders: [],
      
      holdActiveOrder: () => {
        const { activeOrder, heldOrders } = get()
        if (activeOrder.items.length === 0) return
        set({
          heldOrders: [...heldOrders, { ...activeOrder, heldAt: Date.now() }],
          activeOrder: { ...EMPTY_ACTIVE_ORDER },
          selectedTableId: null,
        })
      },

      resumeHeldOrder: (index) => {
        const { heldOrders } = get()
        const order = heldOrders[index]
        set({
          activeOrder: order,
          selectedTableId: order.tableId,
          heldOrders: heldOrders.filter((_, i) => i !== index),
        })
      },

      // ── Order Queue (all orders — KDS reads this) ───────────────
      orders: [],

      // THE MOST IMPORTANT ACTION — called on payment confirm
      placeOrder: async (paymentMethod) => {
        const { activeOrder } = get()
        if (activeOrder.items.length === 0) return

        try {
          const res = await api.post('/orders', {
            type: activeOrder.type,
            customerName: activeOrder.customerName,
            customerMobile: activeOrder.customerMobile,
            tableNumber: activeOrder.tableNumber,
            tableId: activeOrder.tableId,
            paymentMethod,
            items: activeOrder.items.map(i => ({ menuItemId: i.itemId, qty: i.qty }))
          })
          
          // Refresh data
          await get().fetchInitialData()

          set({
            currentInvoice: { ...res.data, id: res.data._id },
            paymentModalOpen: false,
            invoiceModalOpen: true,
            activeOrder: { ...EMPTY_ACTIVE_ORDER },
            selectedTableId: null,
          })
        } catch (error) {
          console.error("Failed to place order:", error)
          alert("Error placing order")
        }
      },

      // KDS: staff update order status
      updateOrderStatus: async (orderId, status) => {
        try {
          await api.patch(`/orders/${orderId}/status`, { status })
          await get().fetchInitialData()
        } catch (error) {
          console.error("Failed to update status:", error)
        }
      },

      // Menu Manager: toggle item availability
      toggleItemAvailability: async (itemId) => {
        try {
          await api.patch(`/menu/${itemId}/availability`)
          await get().fetchInitialData()
        } catch (error) {
          console.error("Failed to toggle availability:", error)
        }
      },

      // ── UI State ─────────────────────────────────────────────────
      paymentModalOpen: false,
      invoiceModalOpen: false,
      currentInvoice: null,

      openPaymentModal: () => set({ paymentModalOpen: true }),
      closePaymentModal: () => set({ paymentModalOpen: false }),
      openInvoiceModal: (order) => set({ invoiceModalOpen: true, currentInvoice: order }),
      closeInvoiceModal: () => set({ invoiceModalOpen: false, currentInvoice: null }),
    }),
    {
      name: 'cafeos-store',
      partialize: (state) => ({
        heldOrders: state.heldOrders,
      }),
    }
  )
)
