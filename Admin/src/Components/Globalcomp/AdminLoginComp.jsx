import './GlobalcompStyles/AdminLoginComp.css'

function AdminLoginComp({ children }) {
  return (
    <main className="admin-login">
      <section className="admin-login__card" aria-label="Administrator sign in">
        {children}
      </section>
    </main>
  )
}

export default AdminLoginComp
