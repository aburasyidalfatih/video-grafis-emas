export type VideoStyleId = 'neon-cyber' | 'photorealistic';

export interface VideoStyleOption {
  id: VideoStyleId;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  accent: 'cyan' | 'amber';
  visual_aesthetic: string;
  color_palette: string;
  render_and_lighting: string;
  sample_labels: string[];
  sample_sfx: string[];
}

export interface StyleConsistency {
  visual_aesthetic: string;
  color_palette: string;
  render_and_lighting: string;
}

export interface Continuity {
  timeline_segment: string;
  visual_anchor: string;
  transition_in: string;
  transition_out: string;
}

export interface VoiceOver {
  persona: string;
  tone_and_delivery: string;
  speaking_rate: string;
  recommended_tts: string;
  script: string;
}

export interface ScenePrompt {
  scene_number: number;
  duration: string;
  visual_prompt: string;
  camera_movement: string;
  style_consistency: StyleConsistency;
  continuity: Continuity;
  on_screen_text_labels: string[];
  sound_effects: string[];
  voice_over: VoiceOver;
  voice_over_script?: string;
}

export interface VideoPayload {
  scenes: ScenePrompt[];
  social_media_caption?: string;
  hashtags?: string[];
}
