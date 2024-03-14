
import AdminPortalLayout from "../layout/AdminPortalLayout";
import UserPortalLayout from "../layout/UserPortalLayout";
import { useAuth } from "../auth/AuthProvider";

export default function Soporte() {
  const auth = useAuth();
  const user = auth.getUser(); // Obtener el objeto User


  return (
    <>
      {user?.rol === 'admin' ? (
          <AdminPortalLayout>
            soporte
          </AdminPortalLayout>
        ) : (
          <UserPortalLayout>
            soporte
          </UserPortalLayout>
    )}
    </>
  );
}