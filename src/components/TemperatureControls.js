import React, { useState } from 'react';
import { Box, Slider, Typography, Button, Paper, Grid, Divider } from '@mui/material';
import { calculateTemperatureField } from '../utils/heatTransfer';

function TemperatureControls({ 
  temperature, 
  setTemperature, 
  radius, 
  setRadius, 
  length, 
  setLength,
  time,
  setTime 
}) {
  const [simulationResults, setSimulationResults] = useState(null);
  const [maxTemp, setMaxTemp] = useState(temperature);
  const [minTemp, setMinTemp] = useState(temperature);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleStartSimulation = () => {
    setIsSimulating(true);

    // Параметри для розрахунку
    const params = {
      radius: radius,
      length: length,
      time: time,
      initialTemp: temperature,
      boundaryTemp: 20, // температура навколишнього середовища
      thermalDiffusivity: 0.000001 // коефіцієнт температуропровідності (м²/с)
    };

    try {
      // Розрахунок температурного поля
      const temperatureField = calculateTemperatureField(params);
      
      // Знаходимо максимальну та мінімальну температуру
      let max = -Infinity;
      let min = Infinity;
      let sum = 0;
      let count = 0;
      
      temperatureField.forEach(row => {
        row.forEach(temp => {
          max = Math.max(max, temp);
          min = Math.min(min, temp);
          sum += temp;
          count++;
        });
      });

      const avgTemp = sum / count;
      
      // Оновлюємо стан
      setMaxTemp(max);
      setMinTemp(min);
      setSimulationResults({
        field: temperatureField,
        centerTemp: temperatureField[Math.floor(temperatureField.length/2)][Math.floor(temperatureField[0].length/2)],
        surfaceTemp: temperatureField[temperatureField.length-1][Math.floor(temperatureField[0].length/2)],
        averageTemp: avgTemp
      });
    } catch (error) {
      console.error('Помилка при моделюванні:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Параметри моделювання
      </Typography>

      <Typography gutterBottom>
        Початкова температура (°C): {temperature.toFixed(2)}
      </Typography>
      <Slider
        value={temperature}
        onChange={(e, newValue) => setTemperature(newValue)}
        min={0}
        max={100}
        step={1}
      />

      <Typography gutterBottom sx={{ mt: 2 }}>
        Радіус циліндра (м): {radius}
      </Typography>
      <Slider
        value={radius}
        onChange={(e, newValue) => setRadius(newValue)}
        min={0.1}
        max={5}
        step={0.1}
      />

      <Typography gutterBottom sx={{ mt: 2 }}>
        Довжина циліндра (м): {length}
      </Typography>
      <Slider
        value={length}
        onChange={(e, newValue) => setLength(newValue)}
        min={0.1}
        max={10}
        step={0.1}
      />

      <Typography gutterBottom sx={{ mt: 2 }}>
        Час симуляції (с): {time}
      </Typography>
      <Slider
        value={time}
        onChange={(e, newValue) => setTime(newValue)}
        min={0}
        max={100}
        step={1}
      />

      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        sx={{ mt: 2, mb: 3 }}
        onClick={handleStartSimulation}
        disabled={isSimulating}
      >
        {isSimulating ? 'Виконується розрахунок...' : 'Почати моделювання'}
      </Button>

      {simulationResults && (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Результати моделювання
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" color="primary">
                Максимальна температура: {maxTemp.toFixed(2)}°C
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="error">
                Мінімальна температура: {minTemp.toFixed(2)}°C
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                Середня температура: {simulationResults.averageTemp.toFixed(2)}°C
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                Температура в центрі: {simulationResults.centerTemp.toFixed(2)}°C
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                Температура на поверхні: {simulationResults.surfaceTemp.toFixed(2)}°C
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="secondary">
                Градієнт температури: {(maxTemp - minTemp).toFixed(2)}°C
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default TemperatureControls; 