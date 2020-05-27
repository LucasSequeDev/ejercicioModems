import React, { Fragment, useState } from 'react'
import axios from 'axios';


export default function App() {

  const [vendor, setVendor] = useState('')
  const [vendorError, setVendorError] = useState(false)
  const [modems, setModems] = useState([])
  const [mensaje, setMensaje] = useState({estado: false,msg: '',categoria: ''})

  // Funcion para capturar los datos ingresados por el usuario
  const onChangeVendor = e => {
    setVendor(e.target.value)
    setVendorError(false)
  }

  // Funcion para buscar el vendor
  const onClickBuscar = async () => {
    // Validacion del vendor ingresado por usuario
    if (vendor === '') {
      setVendorError(true)
      return
    }
    
    // Seteo si viene de un error
    setVendorError(false)
    setMensaje({estado: false, msg: '',categoria: ''})

    // Realizo la consulta a la API
    try {
      const response = await axios.get(`http://localhost:5000/api/modems/${vendor}`)
      if (response.status === 200) {
        setModems(response.data);
      } else {
        setModems([]);
        setMensaje({estado: true, msg: 'No quedan modems de este fabricante sin agregar al JSON.',categoria: 'info'})
      }
    } catch (error) {
      setMensaje({estado: true, msg: error.response.data,categoria: 'danger'})
    }

  }

  // Funcion para agregar el modelo al JSON
  const onClickAgregarModelo = async (modelo) => {
    // Realizo la consulta a la API
    try {
      const response = await axios.put(`http://localhost:5000/api/modems/${vendor}`,{modelo})
      if (response.status === 200) {
        setMensaje({estado: true, msg: response.data,categoria: 'success'})
      } 
    } catch (error) {
      setMensaje({estado: true, msg: error.response.data,categoria: 'danger'})
    }
    
    
  }


  return (
    <Fragment>
      <h2>Resolucion</h2>
      {
        mensaje.estado
        ?
          <div className={`alert alert-${mensaje.categoria}`}>
              {mensaje.msg}
          </div>
        :
        null
      }
      <div className="form-group">
        <label htmlFor="vendor">Ingrese fabricante</label>
        <input className="form-control" name="vendor" onChange={onChangeVendor} value={vendor} placeholder="Ingrese el fabricante que desea buscar."/>
        {
          vendorError
          ?
            <p className="text-danger">Por favor, ingresar un fabricante.</p>
          :
            null
        }
      </div>
      <button onClick={onClickBuscar} className="btn btn-block btn-success">Buscar</button>  

      {
        modems.length > 0
        ?
          <table className='table table-sm'>
            <thead>
              <tr>
                <th>Mac-addres</th>
                <th>IP</th>
                <th>Modelo</th>
                <th>Version de software</th>
                <th>Complementos</th>
              </tr>
            </thead>
            <tbody>
              {
                modems.map(modem => 
                    <tr key={modem.modem_macaddr}>
                      <td>{modem.modem_macaddr}</td>
                      <td>{modem.ipaddr}</td>
                      <td>{modem.vsi_model}</td>
                      <td>{modem.vsi_swver}</td>
                      <td><button onClick={() => onClickAgregarModelo(modem.vsi_model)} className="btn btn-info">Agregar modelo</button></td>
                    </tr>
                  )
              }
            </tbody>
          </table>
        :
          null
      }
    </Fragment>
  )
}
