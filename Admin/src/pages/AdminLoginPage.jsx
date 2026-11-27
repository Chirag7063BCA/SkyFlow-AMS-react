import AdminLoginComp from '../Components/Globalcomp/AdminLoginComp.jsx'
import AdminCredentialsForm from '../Components/Globalcomp/AdminCredentialsForm.jsx'
import AdminShowcase from '../Components/Globalcomp/AdminShowcase.jsx'

function AdminLoginPage({ onLogin }) {
  return (
    <AdminLoginComp>
      <AdminShowcase />
      <AdminCredentialsForm onLogin={onLogin} />
    </AdminLoginComp>
  )
}

export default AdminLoginPage
