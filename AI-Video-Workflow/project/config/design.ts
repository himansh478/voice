export const C = {
  canvas: '#FBFAF4',
  paper: '#FFFFFF',
  ink: '#2E2E33',
  muted: '#85847E',
  faint: '#E9E6DC',
  amber: '#F29E12',
  amberDark: '#9C6300',
  amberSoft: '#FFF2D7',
  green: '#388C6B',
  greenSoft: '#E6F3EC',
  blue: '#4B75A7',
  blueSoft: '#EAF0F8',
  red: '#BD625D',
  redSoft: '#F9EAE7',
  output: '#2D2D31',
  outputText: '#F8F6EF',
} as const;

export const font = {
  heading: 'Space Grotesk',
  body: 'Inter',
} as const;

export const isVertical = (width: number, height: number) => height > width;
