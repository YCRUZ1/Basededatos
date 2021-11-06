//Importar express, nos da soporte en la infraextruxtura del backend, es la forma tradiocional
//const express = require('express');

//Forma actual de importar express
import Express from 'express';
//import * as express from "express";

//Esta parte es la conexion con Mongodb
//const { MongoClient } = require('mongodb'); // es del profe es stringConexion
import { MongoClient } from 'mongodb';
const uri = "mongodb+srv://ycruz:casa1234@proyectomisiontic.1lzxm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//client.connect(err => {
  //const collection = client.db('store').collection('Storeproductos');
   // perform actions on the collection object
   //client.close();
  //});
//---

const app = Express();
app.use(Express.json());
let conexion;


import {ObjectId} from 'mongodb';

app.use((req, res, next) => {

    // Dominio que tengan acceso (ej. 'http://example.com')
       res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Metodos de solicitud que deseas permitir
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    
    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
       res.setHeader('Access-Control-Allow-Headers', '*');
    
    next();
    });

import cors from 'cors';
//const cors = require('cors')
app.use(cors());

//PRODUCTOS
app.get('/productos',(req, res)=>{
    console.log('Alguien hizo get en la ruta /productos');
    conexion.collection('Storeproductos').find({}).limit(100).toArray((err,result)=>{
        if(err){
            res.send(500).send('Error consultando los productos');
        } else{
            res.json(result);
        }
    }); 
});

app.post('/productos/nuevos', (req,res)=>{
    console.log(req);
    const datosproductos=req.body;
    console.log('llaves:', Object.keys(datosproductos)); //para mirar los id de la base de datos
    
     try{   
        
        if(
        Object.keys(datosproductos).includes('id_productos')&&
        Object.keys(datosproductos).includes('descripcion')&&
        Object.keys(datosproductos).includes('valor_unitario')&&
        Object.keys(datosproductos).includes('cantidad') &&
        Object.keys(datosproductos).includes('estado')

    ){
        //implementar codigo para crear producto en BD
        conexion.collection('Storeproductos').insertOne(datosproductos,(err,result)=>{
            if(err){
                console.error(err);
                res.sendStatus(500); //Campos con informacion errada, algo fallo
            } else{ 
                console.log(result);
                res.sendStatus(200); //Campos con informacion correcta, todo OK
             }
         });
    } else{
        res.sendStatus(500);
        } //Campos con informacion errada, algo fallo  
    }catch{
        console.log("Error, no tienes las mismas llaves");
        res.sendStatus(500);
    } 
    //console.log('Producto a crear:', req.body); //envia lo que se quiere agregar a la base de datos
    //res.send('Producto creado');
});


app.patch('/productos/editar', (req,res)=>{
    const edicion=req.body;
    console.log(edicion);
    const filtroProducto ={_id: new ObjectId(edicion.id)};
    delete edicion.id;
    const operacion ={
        $set:edicion,
    };
    conexion.collection('Storeproductos').findOneAndUpdate(filtroProducto,operacion,{upsert:true, returnOriginal: true}, (err,result)=>{
        if(err){
            console.error('Error actualizando el producto: ', err);
            res.sendStatus(500);
        }
        else{
            console.log('Actualizado con exito');
            res.sendStatus(200);
        }
    });
});

app.delete('/productos/eliminar', (req,res)=>{
    const filtroProducto ={_id: new ObjectId(req.body.id)};
    conexion.collection('Storeproductos').deleteOne(filtroProducto,(err,result)=>{
        if(err){
            console.error('Error eliminando el producto: ', err);
            res.sendStatus(500);
        }
        else{
            console.log('Producto eliminado con exito');
            res.sendStatus(200);
        }
    });
});



const main = ()=>{
     client.connect((err,db) => {

            if (err){
                console.error("Error conectando a la base de datos");
            }
            conexion = db.db("store");
            console.log('Conexion exitosa');
            return app.listen(5000,()=>{
        console.log('Eschando puerto 5000');
            });
        });
     };
main();
//----

//VENTAS

app.get('/sales',(req, res)=>{
    console.log('Alguien hizo get en la ruta /sales');
    conexion.collection('Storesales').find({}).limit(100).toArray((err,result)=>{
        if(err){
            res.send(500).send('Error consultando las ventas');
        } else{
            res.json(result);
        }
    }); 
});

app.post('/sales/nuevos', (req,res)=>{
    console.log(req);
    const datossales=req.body;
    console.log('llaves:', Object.keys(datossales)); //para mirar los id de la base de datos
    
     try{   
        
        if(
        Object.keys(datossales).includes('id_ventas')&&
        Object.keys(datossales).includes('valor_total')&&
        Object.keys(datossales).includes('id_producto')&&
        Object.keys(datossales).includes('cantidad') &&
        Object.keys(datossales).includes('precio_unitario')&&
        Object.keys(datossales).includes('fecha_venta')&&
        Object.keys(datossales).includes('id_cliente')&&
        Object.keys(datossales).includes('cliente')&&
        Object.keys(datossales).includes('vendedor')

    ){
        //implementar codigo para crear ventas en BD
        conexion.collection('Storesales').insertOne(datossales,(err,result)=>{
            if(err){
                console.error(err);
                res.sendStatus(500); //Campos con informacion errada, algo fallo
            } else{ 
                console.log(result);
                res.sendStatus(200); //Campos con informacion correcta, todo OK
             }
         });
    } else{
        res.sendStatus(500);
        } //Campos con informacion errada, algo fallo  
    }catch{
        console.log("Error, no tienes las mismas llaves");
        res.sendStatus(500);
    } 
   
});

app.patch('/sales/editar', (req,res)=>{
    const edicion=req.body;
    console.log(edicion);
    const filtroProducto ={_id: new ObjectId(edicion.id)};
    delete edicion.id;
    const operacion ={
        $set:edicion,
    };
    conexion.collection('Storesales').findOneAndUpdate(filtroProducto,operacion,{upsert:true, returnOriginal: true}, (err,result)=>{
        if(err){
            console.error('Error actualizando la venta: ', err);
            res.sendStatus(500);
        }
        else{
            console.log('Actualizado con exito');
            res.sendStatus(200);
        }
    });
});

app.delete('/sales/eliminar', (req,res)=>{
    const filtroProducto ={_id: new ObjectId(req.body.id)};
    conexion.collection('Storesales').deleteOne(filtroProducto,(err,result)=>{
        if(err){
            console.error('Error eliminando la venta: ', err);
            res.sendStatus(500);
        }
        else{
            console.log('Venta eliminado con exito');
            res.sendStatus(200);
        }
    });
});

// --

//USUARIOS

app.get('/usuarios',(req, res)=>{
    console.log('Alguien hizo get en la ruta /usuarios');
    conexion.collection('Storeusuario').find({}).limit(100).toArray((err,result)=>{
        if(err){
            res.send(500).send('Error consultando los usuarios');
        } else{
            res.json(result);
        }
    }); 
});

app.post('/usuarios/nuevos', (req,res)=>{
    console.log(req);
    const datosusuarios=req.body;
    console.log('llaves:', Object.keys(datosusuarios)); //para mirar los id de la base de datos
    
     try{   
        
        if(
        Object.keys(datosusuarios).includes('id_usuario')&&
        Object.keys(datosusuarios).includes('estado')&&
        Object.keys(datosusuarios).includes('rol')&&
        Object.keys(datosusuarios).includes('nombre') &&
        Object.keys(datosusuarios).includes('identificacion')&&
        Object.keys(datosusuarios).includes('direccion')&&
        Object.keys(datosusuarios).includes('telefono')
       

    ){
        //implementar codigo para crear ventas en BD
        conexion.collection('Storeusuario').insertOne(datosusuarios,(err,result)=>{
            if(err){
                console.error(err);
                res.sendStatus(500); //Campos con informacion errada, algo fallo
            } else{ 
                console.log(result);
                res.sendStatus(200); //Campos con informacion correcta, todo OK
             }
         });
    } else{
        res.sendStatus(500);
        } //Campos con informacion errada, algo fallo  
    }catch{
        console.log("Error, no tienes las mismas llaves");
        res.sendStatus(500);
    } 
   
});

app.patch('/usuarios/editar', (req,res)=>{
    const edicion=req.body;
    console.log(edicion);
    const filtroProducto ={_id: new ObjectId(edicion.id)};
    delete edicion.id;
    const operacion ={
        $set:edicion,
    };
    conexion.collection('Storeusuario').findOneAndUpdate(filtroProducto,operacion,{upsert:true, returnOriginal: true}, (err,result)=>{
        if(err){
            console.error('Error actualizando el usuario: ', err);
            res.sendStatus(500);
        }
        else{
            console.log('Actualizado con exito');
            res.sendStatus(200);
        }
    });
});

app.delete('/usuarios/eliminar', (req,res)=>{
    const filtroProducto ={_id: new ObjectId(req.body.id)};
    conexion.collection('Storeusuario').deleteOne(filtroProducto,(err,result)=>{
        if(err){
            console.error('Error eliminando el usuario: ', err);
            res.sendStatus(500);
        }
        else{
            console.log('Venta eliminado con exito');
            res.sendStatus(200);
        }
    });
});

// --