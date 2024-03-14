import PortalLayout from "../layout/AdminPortalLayout";
import '../css/Pacientes.css'

export default function Pacientes() {
  return (
    <PortalLayout>
        <form  className="buscar-paciente" action="/buscar" method="GET">
            <input className="input-pacientes" type="text" name="q" placeholder="Buscar..."/>
            <button className="button-pacientes" type="submit">Buscar</button>
            </form>
        <table className="table-pacientes">
            <tbody className="table-border">  
                <tr>       
                    <td id="name" className="td-campos1">Nombre</td>
                    <td id="lastname" className="td-campos1">Apellido</td> 
                    <td id="email" className="td-campos1">Correo</td>
                    <td id="phone" className="td-campos1">Telefono</td>
                    <td id="rut" className="td-campos1">Rut</td>
                    <td id="categoria" className="td-campos1">Categoria</td>
                </tr>
                <tr> 
                    <td className="td-campos">rafael</td> 
                    <td className="td-campos">benguria</td> 
                    <td className="td-campos">asdaksj@gmail.com</td> 
                    <td className="td-campos">123124124</td> 
                    <td className="td-campos">19.831.403-k</td> 
                    <td className="td-campos">psicologia</td> 
                </tr>
            </tbody>
        </table>
    </PortalLayout>
  );
}