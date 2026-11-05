export const C = {
  canvas: '#0B1020',
  paper: '#121C30',
  paper2: '#17243B',
  ink: '#EDF3FA',
  muted: '#8C9AB2',
  faint: '#283751',
  amber: '#FFBB55',
  amberDark: '#2B2112',
  amberSoft: '#3B2D17',
  green: '#66E3B4',
  greenSoft: '#12382F',
  blue: '#68C8FF',
  blueSoft: '#142F43',
  red: '#FF7D78',
  redSoft: '#3B2029',
  output: '#111A2C',
  outputText: '#EDF3FA',
} as const;

export const font = {
  heading: 'Space Grotesk',
  body: 'Inter',
} as const;

export const isVertical = (width: number, height: number) => height > width;
