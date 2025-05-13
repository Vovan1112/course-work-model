import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box, Container, Grid, Typography } from '@mui/material';
import CylinderModel from './components/CylinderModel';
import TemperatureControls from './components/TemperatureControls';

function App() {
  const [temperature, setTemperature] = useState(20);
  const [radius, setRadius] = useState(1);
  const [length, setLength] = useState(2);
  const [time, setTime] = useState(0);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Моделювання нестаціонарної теплопровідності в циліндрі
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ height: '60vh', border: '1px solid #ccc' }}>
              <Canvas camera={{ position: [5, 5, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <CylinderModel 
                  radius={radius} 
                  length={length} 
                  temperature={temperature}
                />
                <OrbitControls />
              </Canvas>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TemperatureControls 
              temperature={temperature}
              setTemperature={setTemperature}
              radius={radius}
              setRadius={setRadius}
              length={length}
              setLength={setLength}
              time={time}
              setTime={setTime}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App; 