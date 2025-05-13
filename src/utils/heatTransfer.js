import { create, all } from 'mathjs';

const math = create(all);

// Функція для розрахунку температурного поля в циліндрі
export function calculateTemperatureField(params) {
  const { radius, length, time, initialTemp, boundaryTemp, thermalDiffusivity } = params;
  
  // Збільшуємо кількість точок для більш точного розрахунку
  const nr = 30; // радіальні точки
  const nz = 30; // осьові точки
  
  // Кроки сітки
  const dr = radius / (nr - 1);
  const dz = length / (nz - 1);
  const dt = 0.01; // зменшуємо часовий крок для стабільності
  
  // Створюємо сітку для температурного поля
  let T = Array(nr).fill().map(() => Array(nz).fill(initialTemp));
  
  // Встановлюємо граничні умови
  for (let i = 0; i < nr; i++) {
    for (let j = 0; j < nz; j++) {
      // Початковий розподіл температури - в центрі гарячіше
      const r = i * dr;
      const z = j * dz;
      const distanceFromCenter = Math.sqrt(Math.pow(r, 2) + Math.pow(z - length/2, 2));
      const maxDistance = Math.sqrt(Math.pow(radius, 2) + Math.pow(length/2, 2));
      T[i][j] = initialTemp - (initialTemp - boundaryTemp) * (distanceFromCenter / maxDistance);
    }
  }

  // Кількість часових кроків
  const numTimeSteps = Math.floor(time / dt);
  
  // Розрахунок температурного поля методом кінцевих різниць
  for (let t = 0; t < numTimeSteps; t++) {
    let newT = Array(nr).fill().map(() => Array(nz).fill(0));
    
    for (let i = 1; i < nr-1; i++) {
      for (let j = 1; j < nz-1; j++) {
        const r = i * dr;
        
        // Рівняння теплопровідності в циліндричних координатах
        const d2Tdr2 = (T[i+1][j] - 2*T[i][j] + T[i-1][j]) / (dr*dr);
        const dTdr = (T[i+1][j] - T[i-1][j]) / (2*dr);
        const d2Tdz2 = (T[i][j+1] - 2*T[i][j] + T[i][j-1]) / (dz*dz);
        
        // Додаємо джерело тепла в центрі циліндра
        const heatSource = (r < radius/3) ? 10 : 0; // Джерело тепла в центральній третині циліндра
        
        newT[i][j] = T[i][j] + dt * (
          thermalDiffusivity * (d2Tdr2 + (1/r)*dTdr + d2Tdz2) + 
          heatSource
        );
        
        // Обмежуємо температуру фізично розумними значеннями
        newT[i][j] = Math.max(boundaryTemp, Math.min(initialTemp * 1.5, newT[i][j]));
      }
    }
    
    // Граничні умови на поверхні (закон Ньютона)
    for (let j = 0; j < nz; j++) {
      newT[0][j] = boundaryTemp;
      newT[nr-1][j] = boundaryTemp + (newT[nr-2][j] - boundaryTemp) * 0.7;
    }
    
    for (let i = 0; i < nr; i++) {
      newT[i][0] = boundaryTemp + (newT[i][1] - boundaryTemp) * 0.7;
      newT[i][nz-1] = boundaryTemp + (newT[i][nz-2] - boundaryTemp) * 0.7;
    }
    
    T = newT;
  }
  
  return T;
}

// Функція для отримання кольору на основі температури
export function getTemperatureColor(temp, minTemp, maxTemp) {
  const normalizedTemp = (temp - minTemp) / (maxTemp - minTemp);
  return {
    r: math.min(1, 2 * normalizedTemp),
    g: math.min(1, 2 * (1 - math.abs(normalizedTemp - 0.5))),
    b: math.min(1, 2 * (1 - normalizedTemp))
  };
} 