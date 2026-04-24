import React, { useEffect } from 'react'
import StaffLayout from './layouts/StaffLayout'
import { useAppStore } from './store/useAppStore'

import POSView from './views/POSView'
import KDSView from './views/KDSView'
import TablesView from './views/TablesView'
import MenuManagerView from './views/MenuManagerView'
import ReportsView from './views/ReportsView'

export default function App() {
  const currentView = useAppStore(state => state.currentView)
  const fetchInitialData = useAppStore(state => state.fetchInitialData)

  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  return (
    <StaffLayout>
      {currentView === 'pos' && <POSView />}
      {currentView === 'kds' && <KDSView />}
      {currentView === 'tables' && <TablesView />}
      {currentView === 'menu' && <MenuManagerView />}
      {currentView === 'reports' && <ReportsView />}
    </StaffLayout>
  )
}
