import Highcharts from 'highcharts';
import { ReactNode } from 'react';
import { Algorithm, ProsperitySymbol } from '../../models.ts';
import { useStore } from '../../store.ts';
import { Chart } from './Chart.tsx';

function getLimit(algorithm: Algorithm, symbol: ProsperitySymbol): number {
  const knownLimits: Record<string, number> = {
    TOMATOES: 80,
    EMERALDS: 80,
    ASH_COATED_OSMIUM: 80,
    INTARIAN_PEPPER_ROOT: 80,
    HYDROGEL_PACK: 200,
    VELVETFRUIT_EXTRACT: 200,
    VEV_4000: 300,
    VEV_4500: 300,
    VEV_5000: 300,
    VEV_5100: 300,
    VEV_5200: 300,
    VEV_5300: 300,
    VEV_5400: 300,
    VEV_5500: 300,
    VEV_6000: 300,
    VEV_6500: 300,
    GALAXY_SOUNDS_DARK_MATTER: 10,
    GALAXY_SOUNDS_BLACK_HOLES: 10,
    GALAXY_SOUNDS_PLANETARY_RINGS: 10,
    GALAXY_SOUNDS_SOLAR_WINDS: 10,
    GALAXY_SOUNDS_SOLAR_FLAMES: 10,
    SLEEP_POD_SUEDE: 10,
    SLEEP_POD_LAMB_WOOL: 10,
    SLEEP_POD_POLYESTER: 10,
    SLEEP_POD_NYLON: 10,
    SLEEP_POD_COTTON: 10,
    MICROCHIP_CIRCLE: 10,
    MICROCHIP_OVAL: 10,
    MICROCHIP_SQUARE: 10,
    MICROCHIP_RECTANGLE: 10,
    MICROCHIP_TRIANGLE: 10,
    PEBBLES_XS: 10,
    PEBBLES_S: 10,
    PEBBLES_M: 10,
    PEBBLES_L: 10,
    PEBBLES_XL: 10,
    ROBOT_VACUUMING: 10,
    ROBOT_MOPPING: 10,
    ROBOT_DISHES: 10,
    ROBOT_LAUNDRY: 10,
    ROBOT_IRONING: 10,
    UV_VISOR_YELLOW: 10,
    UV_VISOR_AMBER: 10,
    UV_VISOR_ORANGE: 10,
    UV_VISOR_RED: 10,
    UV_VISOR_MAGENTA: 10,
    TRANSLATOR_SPACE_GRAY: 10,
    TRANSLATOR_ASTRO_BLACK: 10,
    TRANSLATOR_ECLIPSE_CHARCOAL: 10,
    TRANSLATOR_GRAPHITE_MIST: 10,
    TRANSLATOR_VOID_BLUE: 10,
    PANEL_1X2: 10,
    PANEL_2X2: 10,
    PANEL_1X4: 10,
    PANEL_2X4: 10,
    PANEL_4X4: 10,
    OXYGEN_SHAKE_MORNING_BREATH: 10,
    OXYGEN_SHAKE_EVENING_BREATH: 10,
    OXYGEN_SHAKE_MINT: 10,
    OXYGEN_SHAKE_CHOCOLATE: 10,
    OXYGEN_SHAKE_GARLIC: 10,
    SNACKPACK_CHOCOLATE: 10,
    SNACKPACK_VANILLA: 10,
    SNACKPACK_PISTACHIO: 10,
    SNACKPACK_STRAWBERRY: 10,
    SNACKPACK_RASPBERRY: 10
  };

  if (knownLimits[symbol] !== undefined) {
    return knownLimits[symbol];
  }

  // This code will be hit when a new product is added to the competition and the visualizer isn't updated yet
  // In that case the visualizer doesn't know the real limit yet, so we make a guess based on the algorithm's positions

  const positions = algorithm.data.map(row => row.state.position[symbol] || 0);
  const minPosition = Math.min(...positions);
  const maxPosition = Math.max(...positions);

  return Math.max(Math.abs(minPosition), maxPosition);
}

export interface PositionChartProps {
  symbols: string[];
}

export function PositionChart({ symbols }: PositionChartProps): ReactNode {
  const algorithm = useStore(state => state.algorithm)!;

  const limits: Record<string, number> = {};
  for (const symbol of symbols) {
    limits[symbol] = getLimit(algorithm, symbol);
  }

  const data: Record<string, [number, number][]> = {};
  for (const symbol of symbols) {
    data[symbol] = [];
  }

  for (const row of algorithm.data) {
    for (const symbol of symbols) {
      const position = row.state.position[symbol] || 0;
      data[symbol].push([row.state.timestamp, (position / limits[symbol]) * 100]);
    }
  }

  const series: Highcharts.SeriesOptionsType[] = symbols.map((symbol, i) => ({
    type: 'line',
    name: symbol,
    data: data[symbol],

    // We offset the position color by 1 to make it line up with the colors in the profit / loss chart,
    // while keeping the "Total" line in the profit / loss chart the same color at all times
    colorIndex: (i + 1) % 10,
  }));

  return <Chart title="Positions (% of limit)" series={series} min={-100} max={100} />;
}
