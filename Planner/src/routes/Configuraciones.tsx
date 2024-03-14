import AdminPortalLayout from "../layout/AdminPortalLayout";
import UserPortalLayout from "../layout/UserPortalLayout";
import { useAuth } from "../auth/AuthProvider";

export default function Configuraciones() {
  const auth = useAuth();
  const user = auth.getUser(); // Obtener el objeto User

  // Utilizar una declaración condicional para decidir qué layout usar
  return (
    <>
      {user?.rol === 'admin' ? (
        <AdminPortalLayout>
          Configuraciones
        </AdminPortalLayout>
      ) : (
        <UserPortalLayout>
          Configuraciones
        </UserPortalLayout>
      )}
    </>
  );
}
