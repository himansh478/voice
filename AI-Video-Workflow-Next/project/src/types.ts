export type TimedWord = {
  id: number;
  text: string;
  start: number;
  end: number;
  keyword: boolean;
  sceneId: string;
};

export type Caption = {
  id: number;
  start: number;
  end: number;
  text: string;
  lines: string[];
  breakAfter: number[];
  words: TimedWord[];
};

export type SceneDefinition = {
  id: string;
  start: number;
  end: number;
  title: string;
  purpose: string;
};

export type TimingData = {
  duration: number;
  fps: number;
  durationInFrames: number;
  sourceSha256: string;
  scenes: SceneDefinition[];
  captions: Caption[];
};
