import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import  userRoutes  from './users/index.js'
import  roleRoutes  from './roles/index.js' 
import  productRoutes  from './products/index.js'

import db from './db/index.js'

const app = new Hono()

let vehicles = [
  { VehicleID: "V001", PlateNumber: "1กข-123", Model: "Toyota Camry", Year: 2022, Color: "Black" },
  { VehicleID: "V002", PlateNumber: "2ขค-456", Model: "Honda Civic", Year: 2021, Color: "White" }
];

app.get('/vehicles', (c) => {
  return c.json(vehicles);
});

app.get('/vehicles/:id', (c) => {
  const id = c.req.param('id');
  const vehicle = vehicles.find(v => v.VehicleID === id);
  
  if (!vehicle) {
    return c.json({ message: "Vehicle not found" }, 404);
  }
  return c.json(vehicle);
});

app.post('/vehicles', async (c) => {
  const body = await c.req.json();
  const newVehicle = {
    VehicleID: body.VehicleID,
    PlateNumber: body.PlateNumber,
    Model: body.Model,
    Year: body.Year,
    Color: body.Color
  };
  
  vehicles.push(newVehicle);
  return c.json({ message: "Vehicle added!", data: newVehicle }, 201);
});

app.put('/vehicles/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const index = vehicles.findIndex(v => v.VehicleID === id);

  if (index === -1) {
    return c.json({ message: "Vehicle not found" }, 404);
  }

  vehicles[index] = { ...vehicles[index], ...body };
  return c.json({ message: "Vehicle updated!", data: vehicles[index] });
});

app.delete('/vehicles/:id', (c) => {
  const id = c.req.param('id');
  const initialLength = vehicles.length;
  vehicles = vehicles.filter(v => v.VehicleID !== id);

  if (vehicles.length === initialLength) {
    return c.json({ message: "Vehicle not found" }, 404);
  }
  return c.json({ message: `Vehicle ID: ${id} deleted successfully` });
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});