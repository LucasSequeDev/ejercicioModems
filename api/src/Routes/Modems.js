// Enrutadores de express para generar los endpoints
const { Router } = require('express')
const router = Router()
const fs = require('fs')

// Obtengo los modelos del JSON
const jsonString = fs.readFileSync('src/models.json','utf-8')
const models = JSON.parse(jsonString)

// Conexion a la base de datos MySql
const conexion =  require('./../database')

// Endpoit para obtener los modems que no hacen match con el JSON de models
// Metodo: GET - URL: /api/modems/:vendor
router.get('/:vendor',async (req, res) => {  
    try {
        // Obtengo el vendor que el usuario ingreso
        const vendor = req.params.vendor
        
        // Obtengo todos los modelos del vendor solicitado
        var modelsVendor = models.models.filter(model => 
                                                model.vendor.toUpperCase() === vendor.toUpperCase())

        // Valido si el vendor solicitado se encuentra en en el JSPN
        if (modelsVendor.length === 0) {
            return res.status(404).send("No se encontro el fabricante.")
        }        

        // Armo un Arr con los modelos buscados para insertarlo en la querty
        var nameModelVendor = modelsVendor.map(model => model.name)

        // Armo la queri que buscar todos los modelos del vendor solicitado
        var query = `SELECT modem_macaddr,ipaddr,vsi_model,vsi_swver FROM docsis_update WHERE vsi_vendor like '%${vendor}%'`

        // Busco los modelos que no esten en el JSON
        if (nameModelVendor.length > 0) {
            query += " and vsi_model not in (?)"
        }

        // Ejecuto la query
        conexion.query(query, [nameModelVendor], function(error, resultado){
            if(error){
                //console.log("Error en la consulta: " + error + " - La query es: " + result.sql)
                res.status(500).send("Ocurrio un error al ejecutar la consulta.")
            }else{
                //console.log(result.sql)

                // Si no encuentro modems sin agregar, devuelco un 204 no content
                (resultado.length > 0) 
                ? 
                    res.json(resultado)
                :
                    res.status(204).send()
            }
         }
      );
      
    } catch (error) {
        console.log("Error en Route GET:'api/modems/' " + error);
        res.status(500).send("Ocurrio un error en el servidor.")
    }
})

// Endpoit para guardar un modelo al JSON
// Metodo: PUT - URL: /api/modems/:vendor
router.put('/:vendor',(req, res) => {    
    try {
        // Obtengo el vendor que el usuario ingreso
        const vendor = req.params.vendor
        const name = req.body.modelo

        // Valido si existe el modelo y el nombre
        const existeModelo = models.models.filter(model => 
                                                model.vendor.toUpperCase().search(vendor.toUpperCase) &&  
                                                model.name.toUpperCase() === name.toUpperCase)

        // Responso con bad request si el modelo ya fue agregado
        if (existeModelo.length > 0) {
            return res.status(400).send("El modelo seleccionado ya se encuentra agregado.")
        }

        // Agrego a los modelos el nuevo vendor-modelo
        models.models.push({
            vendor,
            name
        })

        // Los agrego al JSON
        const jsonStringModel= JSON.stringify(models)
        fs.writeFileSync('src/models.json',jsonStringModel,'utf-8')
        

        res.json('JSON actualizado')

    } catch (error) {
        console.log("Error en Route PUT:'api/modems/' " + error);
        res.status(500).send("Ocurrio un error en el servidor.")
    }
})



module.exports = router