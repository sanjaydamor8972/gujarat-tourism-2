import { useLocation } from 'react-router-dom'
import Navbar from '../common/Navbar'
import Footer from '../common/Footer'

function AppLayout({ children }) {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="grow">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default AppLayout
