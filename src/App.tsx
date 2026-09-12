import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { FileJson, Sparkles, Copy, CheckCircle2, Video, AlertCircle, Lightbulb, Wand2, Key, X, Check, Search, ChevronRight, ChevronLeft, Compass, Filter, ArrowRight, Film, Volume2, Layers, Download, MessageSquare, Mic, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CONTENT_IDEAS, GOLDGEN_TOPICS, formatTopicToIdea, GoldgenTopic } from './ideas';
import { ScenePrompt, VideoPayload, VoiceOver, VideoStyleId, VideoStyleOption } from './types';

export const VIDEO_STYLES: VideoStyleOption[] = [
  {
    id: 'neon-cyber',
    name: 'Khas Neon 3D Infografis',
    badge: '⚡ Khas Neon',
    tagline: 'Ultra-modern 3D motion graphics & glowing cyan/gold telemetry HUD',
    description: 'Visual 3D canggih dengan aksen neon emas bercahaya, garis telemetry HUD cyan futuristik, isometric cutaway, dan motion graphics berenergi tinggi.',
    accent: 'cyan',
    visual_aesthetic: 'Ultra-modern 3D motion graphics, sleek glowing neon HUD infographic overlays, kinetic digital telemetry, glowing luminous accents, trendy glassmorphism, isometric cutaway cross-section. High contrast with radiant gold highlights.',
    color_palette: 'Luminous 24k gold (#FFD700), dark slate riverbed (#1E232A), electric cyan telemetry (#00E5FF), neon amber accent (#FF9900)',
    render_and_lighting: 'Octane render aesthetic, ray-traced subsurface scattering, glowing neon rim lighting, volumetric light beams, 8k texture fidelity',
    sample_labels: ['[SCAN: LOW-VELOCITY EDDY]', '[DENSITY: 19.3 g/cm³]'],
    sample_sfx: ['Digital HUD telemetry blip', 'Sub-bass whoosh transition', 'Crisp high-frequency chime'],
  },
  {
    id: 'photorealistic',
    name: 'Realistis Sinematik Dokumenter',
    badge: '🎬 Sinematik Natural',
    tagline: '8K natural documentary & authentic macro geology',
    description: 'Gaya dokumenter National Geographic dengan pencahayaan alami, caustics air jernih, tekstur batuan otentik tanpa efek HUD fiksi ilmiah.',
    accent: 'amber',
    visual_aesthetic: 'Photorealistic cinematic documentary, 8K ultra-detailed geological simulation, natural physical macro cinematography, authentic mineral and rock textures, grounded tactile realism. Strictly NO futuristic holograms, NO sci-fi neon HUDs, NO cybernetic telemetry overlays.',
    color_palette: 'Natural raw 24k placer gold (#D4AF37), deep wet slate & bedrock gray (#2A2E35), crystal-clear mountain water (#4A7C59 / #3D5A80), warm natural sunlight (#FFF2B2)',
    render_and_lighting: 'Cinematic 35mm anamorphic lens realism, natural golden hour / dappled water caustics, physically-based rendering (PBR), shallow depth of field, authentic macro lens bokeh, high dynamic range',
    sample_labels: ['INSIDE BEND: LOW VELOCITY', 'GOLD DEPOSITION ZONE'],
    sample_sfx: ['Rushing mountain water stream', 'Heavy mineral settling clatter', 'Crisp metallic clink of gold against bedrock'],
  },
];

export const VOICE_PERSONAS = [
  {
    id: 'geologist',
    name: 'Veteran Field Geologist',
    subtitle: 'Deep baritone, authoritative, documentary pace (~135 WPM)',
    gender_tone: 'Deep warm baritone, calm authoritative intrigue, deliberate documentary cadence',
    tts: "ElevenLabs: 'Adam' (Narrator) / OpenAI: 'Onyx'",
  },
  {
    id: 'naturalist',
    name: 'Curious Naturalist',
    subtitle: 'Warm mid-range, conversational, discovery-driven (~140 WPM)',
    gender_tone: 'Warm natural resonance, conversational intrigue, crisp enunciation',
    tts: "ElevenLabs: 'George' / OpenAI: 'Echo'",
  },
  {
    id: 'storyteller',
    name: 'Expedition Storyteller',
    subtitle: 'Gravelly, cinematic pauses, high retention (~130 WPM)',
    gender_tone: 'Low gravelly texture, cinematic dramatic pauses, captivating mystery',
    tts: "ElevenLabs: 'Marcus' / OpenAI: 'Fable'",
  },
] as const;

const DEFAULT_TOPIC = `Reading The River: Gold drops where water slows down.
1. Scene 1 (The Hook): Photorealistic cinematic cross-section of a roaring mountain river bend under golden hour sunlight, revealing authentic hydraulic sediment flow where heavy, dense raw gold flakes naturally settle into the low-pressure gravel bar.
2. Scene 2 (The Core): High-speed underwater macro dive through crystal-clear mountain water behind a massive mossy river boulder, capturing turbulent eddy currents where heavy raw gold nuggets drop out of suspension into dark riverbed pockets.
3. Scene 3 (The Loop): Extreme macro physical inspection of natural bedrock crevices, capturing coarse raw gold trapped in vertical schist riffles under dappled sunlight caustics, rising back up to the river surface to complete the loop.`;

const CATEGORIES = ['All', 'River & Placer', 'Rocks & Minerals', 'Equipment & Tools', 'Geology & Formations', 'History & Field Knowledge'] as const;

const CANDIDATE_MODELS = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

export default function App() {
  const [userApiKey, setUserApiKey] = useState(() => localStorage.getItem('user_gemini_api_key') || '');
  const [showApiSettings, setShowApiSettings] = useState(false);
  const [selectedVideoStyle, setSelectedVideoStyle] = useState<VideoStyleId>(() => {
    return (localStorage.getItem('user_video_style') as VideoStyleId) || 'neon-cyber';
  });
  const [selectedVoicePersona, setSelectedVoicePersona] = useState<string>('geologist');
  const [copiedVoiceOver, setCopiedVoiceOver] = useState(false);

  const handleSelectVideoStyle = (styleId: VideoStyleId) => {
    setSelectedVideoStyle(styleId);
    localStorage.setItem('user_video_style', styleId);
  };
  
  // Topic catalog modal states
  const [showTopicCatalog, setShowTopicCatalog] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Randomize initial idea from CONTENT_IDEAS so it starts fresh every time
  const [idea, setIdea] = useState(() => {
    const randomIndex = Math.floor(Math.random() * CONTENT_IDEAS.length);
    return CONTENT_IDEAS[randomIndex];
  });
  
  const [isGeneratingConcept, setIsGeneratingConcept] = useState(false);
  const [topic, setTopic] = useState('');
  const [jsonOutput, setJsonOutput] = useState<string | null>(null);
  const [scenes, setScenes] = useState<ScenePrompt[] | null>(null);
  const [activeSceneTab, setActiveSceneTab] = useState<'scene-1' | 'scene-2' | 'scene-3' | 'all'>('scene-1');
  const [copiedScene, setCopiedScene] = useState<number | null>(null);
  const [socialMediaCaption, setSocialMediaCaption] = useState<string>('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copySceneJson = (sceneNum: number) => {
    if (!scenes) return;
    const scene = scenes.find((s: ScenePrompt) => s.scene_number === sceneNum);
    if (scene) {
      navigator.clipboard.writeText(JSON.stringify(scene, null, 2));
      setCopiedScene(sceneNum);
      setTimeout(() => setCopiedScene(null), 2000);
    }
  };

  const copyAllJson = () => {
    if (scenes) {
      navigator.clipboard.writeText(JSON.stringify(scenes, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyCaptionToClipboard = () => {
    if (!socialMediaCaption) return;
    const formattedTags = hashtags && hashtags.length > 0 
      ? hashtags.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')
      : '';
    const textToCopy = formattedTags ? `${socialMediaCaption}\n\n${formattedTags}` : socialMediaCaption;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const filteredTopics = useMemo(() => {
    return GOLDGEN_TOPICS.filter((t) => {
      const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
      const query = catalogSearch.toLowerCase().trim();
      if (!query) return matchesCategory;
      const matchesSearch =
        t.headline.toLowerCase().includes(query) ||
        t.subtitle.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.list_points.some((p) => p.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [catalogSearch, selectedCategory]);

  const handleSelectTopic = (selected: GoldgenTopic) => {
    setIdea(formatTopicToIdea(selected));
    setShowTopicCatalog(false);
  };

  const handleRandomizeIdea = () => {
    const currentIdx = CONTENT_IDEAS.indexOf(idea);
    let nextIdx = Math.floor(Math.random() * CONTENT_IDEAS.length);
    while (nextIdx === currentIdx && CONTENT_IDEAS.length > 1) {
      nextIdx = Math.floor(Math.random() * CONTENT_IDEAS.length);
    }
    setIdea(CONTENT_IDEAS[nextIdx]);
  };

  const getAiInstance = () => {
    const key = userApiKey.trim() || process.env.GEMINI_API_KEY;
    if (!key) {
      setShowApiSettings(true);
      throw new Error("API Key is missing. Please enter your Gemini API Key in the settings.");
    }
    return new GoogleGenAI({ apiKey: key });
  };

  const generateWithFallback = async (ai: GoogleGenAI, contents: string) => {
    let lastErr: any = null;
    for (const model of CANDIDATE_MODELS) {
      try {
        return await ai.models.generateContent({
          model,
          contents,
        });
      } catch (err: any) {
        lastErr = err;
        const msg = err?.message || JSON.stringify(err);
        if (msg.includes('404') || msg.includes('not found') || msg.includes('no longer available')) {
          console.warn(`[Video Grafis Emas] Model "${model}" not available, trying next fallback...`);
          continue;
        }
        throw err;
      }
    }
    throw lastErr;
  };

  const saveApiKey = (key: string) => {
    setUserApiKey(key);
    localStorage.setItem('user_gemini_api_key', key);
  };

  const generateConcept = async () => {
    setIsGeneratingConcept(true);
    setError(null);

    try {
      const activePersonaObj = VOICE_PERSONAS.find((p) => p.id === selectedVoicePersona) || VOICE_PERSONAS[0];
      const activeStyleObj = VIDEO_STYLES.find((s) => s.id === selectedVideoStyle) || VIDEO_STYLES[0];
      const isNeon = activeStyleObj.id === 'neon-cyber';
      const ai = getAiInstance();

      const styleInstruction = isNeon
        ? `CRITICAL VISUAL STYLE (SIGNATURE NEON 3D INFOGRAPHIC):
        - Signature visual style: Ultra-modern 3D motion graphics, luminous glowing 24k gold shaders, sleek cyan (#00E5FF) and amber HUD telemetry overlays, isometric cross-section cutaways, and dynamic kinetic typography/infographics.
        - Distinctive aesthetic: Vibrant contrast with radiant gold highlights, glowing fluid particles, holographic measurement lines, and stylish glassmorphism.
        - Retention Hook in Scene 1: Must open with an immediate dynamic 3D hook in seconds 0-2 (e.g., explosive 3D isometric cutaway plunge revealing glowing 24k gold trapped under high-pressure river hydraulics).`
        : `CRITICAL VISUAL STYLE (REALISTIC & GROUNDED DOCUMENTARY):
        - Focus on photorealistic nature & geological realism: natural sunlight (golden hour, dappled light through crystal-clear mountain water), authentic sediment physics, tangible mineral textures (raw 24k placer gold luster, oxidized quartz, fractured bedrock schist).
        - STRICTLY AVOID: sci-fi holograms, glowing futuristic neon HUDs, cybernetic telemetry overlays, or artificial tech animations. Ground the story in realistic physical cross-sections, macro physical close-ups, and natural documentary cinematography (National Geographic / BBC Earth style).
        - Retention Hook in Scene 1: Scene 1 MUST start with an immediate high-impact curiosity hook in the first 1-2 seconds (e.g., extreme macro reveal of raw gold trapped in jagged riverbed cracks under sunlight caustics).`;

      const response = await generateWithFallback(ai, `You are an expert cinematic director for viral, ${isNeon ? 'high-tech 3D infographic' : 'photorealistic short-form educational'} videos (TikTok/Reels/Shorts).
        Based on the following idea, create a detailed, highly visual video concept structured exactly into 3 sequential scenes (8 seconds each, 24 seconds total).
        Write the descriptions in English for high-end AI video generators (Runway Gen-3, Sora, Kling, Veo).

        ${styleInstruction}

        CRITICAL VIRALITY RULES (FIRST-SECOND HOOK & SEAMLESS LOOP):
        - Scene 1 MUST start with an immediate high-impact curiosity hook in the first 1-2 seconds.
        - The voice-over hook must provoke instant curiosity and stop the viewer from scrolling.
        - Scene 3 MUST end with a natural physical camera transition that seamlessly loops back to the opening framing of Scene 1.

        CRITICAL VOICE-OVER PERSONA CONSISTENCY:
        - Consistent Narrator Persona across all 3 scenes: "${activePersonaObj.name}" (${activePersonaObj.gender_tone}).
        - Word budget per scene: strictly 18 to 22 words so the voice-over pacing is natural, deliberate, and fits perfectly in 8 seconds.

        Idea: ${idea}
        
        Format the output strictly as:
        [Title of the Video]
        
        1. Scene 1 (The Hook):
           - Visuals: [Detailed visual description emphasizing ${isNeon ? 'ultra-modern 3D motion graphics, glowing gold, cyan telemetry,' : 'tangible macro geology, natural lighting,'} and an immediate visual hook...]
           - Voice Over: [Spoken hook script by ${activePersonaObj.name} strictly 18-22 words grabbing attention in the first 2 seconds...]
        2. Scene 2 (The Core):
           - Visuals: [Detailed visual description demonstrating the physical mechanism or geological principle...]
           - Voice Over: [Spoken script by ${activePersonaObj.name} strictly 18-22 words...]
        3. Scene 3 (The Loop):
           - Visuals: [Detailed visual description concluding the insight and ending in a camera position that loops into Scene 1...]
           - Voice Over: [Spoken script by ${activePersonaObj.name} strictly 18-22 words...]`);

      if (response.text) {
        setTopic(response.text);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate concept. Please try again.');
    } finally {
      setIsGeneratingConcept(false);
    }
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    setError(null);
    setJsonOutput(null);
    setScenes(null);

    try {
      const activePersonaObj = VOICE_PERSONAS.find((p) => p.id === selectedVoicePersona) || VOICE_PERSONAS[0];
      const activeStyleObj = VIDEO_STYLES.find((s) => s.id === selectedVideoStyle) || VIDEO_STYLES[0];
      const isNeon = activeStyleObj.id === 'neon-cyber';
      const ai = getAiInstance();

      const response = await generateWithFallback(ai, `You are an elite AI video generation prompt engineer and ${isNeon ? '3D motion graphics director specializing in high-tech viral infographics' : 'cinematic documentary director'}.
Create a production payload for a viral, ${isNeon ? 'ultra-modern 3D infographic' : 'photorealistic cinematic documentary'} 3-scene educational video based on the following topic.

Topic: ${topic}

CRITICAL RULES:
1. Return a single JSON object with THREE root keys: "scenes", "social_media_caption", and "hashtags".
2. "scenes" MUST be an array of EXACTLY 3 sequential scenes (Scene 1: Hook, Scene 2: Core, Scene 3: Loop), 8 seconds each.
3. PURITY OF VIDEO PROMPT: Inside "scenes", DO NOT include any social media captions, hashtags, project titles, marketing copy, or emojis. Every scene object must be strictly technical AI video generator instructions.
4. UNIFORM SCHEMA: Each scene in "scenes" MUST have the EXACT SAME uniform JSON structure so each scene can be used independently by Runway Gen-3, Sora, Kling, Veo, or Luma.
5. STYLE CONSISTENCY (${isNeon ? 'SIGNATURE NEON 3D INFOGRAPHIC' : 'PHOTOREALISTIC DOCUMENTARY'}):
   - Every scene must share the exact same locked aesthetic, color palette, and render parameters in its "style_consistency" object.
   - "visual_aesthetic": "${activeStyleObj.visual_aesthetic}"
   - "color_palette": "${activeStyleObj.color_palette}"
   - "render_and_lighting": "${activeStyleObj.render_and_lighting}"
6. CONTINUITY & SEAMLESS TRANSITIONS: Every scene must define its "continuity" object with timeline_segment, visual_anchor, transition_in, and transition_out so the clips connect seamlessly on physical action and Scene 3 loops back to Scene 1.
7. FIRST-SECOND AUDIENCE RETENTION:
   - Scene 1's visual prompt and camera movement MUST grab the audience in the first 0-2 seconds with intense visual curiosity, dynamic physical motion, and ${isNeon ? 'striking glowing gold contrast' : 'tangible macro detail'}.
8. ${isNeon ? 'CYBER HUD TELEMETRY LABELS' : 'MINIMALIST DOCUMENTARY LABELS'}: "on_screen_text_labels" must be ${isNeon ? 'sleek glowing telemetry HUD callouts or metric tags (e.g. ["[SCAN: LOW-VELOCITY EDDY]", "[DENSITY: 19.3 g/cm³]"])' : 'clean, subtle documentary lower-third text (e.g. ["INSIDE BEND: LOW VELOCITY", "GOLD DEPOSITION ZONE"])'}.
9. ${isNeon ? 'FUTURISTIC SOUND EFFECTS' : 'ORGANIC SOUND EFFECTS'}: "sound_effects" must be ${isNeon ? 'futuristic digital telemetry whooshes, UI clicks, sub-bass riser, and crisp metallic resonance' : 'rich organic Foley design (e.g. rushing mountain river, underwater low rumble, crisp clink of heavy raw gold nugget on bedrock, gravel crunch)'}.
10. VOICE-OVER CHARACTER & DELIVERY CONSISTENCY:
    - Every scene MUST use the EXACT SAME narrator character for seamless audio continuity:
      * "persona": "${activePersonaObj.name}"
      * "tone_and_delivery": "${activePersonaObj.gender_tone}"
      * "speaking_rate": "135 WPM (~2.3 words/sec, max 22 words for 8s)"
      * "recommended_tts": "${activePersonaObj.tts}"
      * "script": Spoken English narration script strictly budgeted to 18-22 words for 8 seconds.
    - Monologue Flow: The voice-over scripts across Scene 1, 2, and 3 must connect naturally as one cohesive, compelling monologue.
11. LANGUAGE: All output text (prompts, camera moves, text labels, voice-overs, caption) MUST be in English.
12. "social_media_caption": Write an engaging, high-retention English caption tailored for TikTok, Instagram Reels, and YouTube Shorts (include emojis, curiosity hook, and a quick call-to-action).
13. "hashtags": An array of 6-8 trending hashtags (e.g. ["#GoldProspecting", "#GoldMining", "#GeologyFacts", "#GoldNugget", "#MiningLife", "#EarthScience"]).

Respond ONLY with a valid JSON object matching this schema:
{
  "scenes": [
    {
      "scene_number": 1,
      "duration": "8s",
      "visual_prompt": "Detailed generative video prompt in English describing ${isNeon ? '3D visuals, glowing neon accents, isometric motion, and environment...' : 'natural environment, authentic mineral textures, physical fluid hydrodynamics, and realistic lighting...'}",
      "camera_movement": "Specific cinematic camera trajectory instruction in English with immediate dynamic plunge or macro reveal...",
      "style_consistency": {
        "visual_aesthetic": "${activeStyleObj.visual_aesthetic}",
        "color_palette": "${activeStyleObj.color_palette}",
        "render_and_lighting": "${activeStyleObj.render_and_lighting}"
      },
      "continuity": {
        "timeline_segment": "0:00 - 0:08 (The Hook)",
        "visual_anchor": "Establishing baseline ${isNeon ? 'isometric terrain and locked 24k gold luminous material shader' : 'photorealistic riverbed terrain and authentic raw 24k gold mineral luster'}",
        "transition_in": "Instant high-speed plunge into scene grabbing attention in second 1",
        "transition_out": "Camera tilts down smoothly toward a massive submerged river boulder, tracking downstream eddy currents"
      },
      "on_screen_text_labels": ${JSON.stringify(activeStyleObj.sample_labels)},
      "sound_effects": ${JSON.stringify(activeStyleObj.sample_sfx.slice(0, 2))},
      "voice_over": {
        "persona": "${activePersonaObj.name}",
        "tone_and_delivery": "${activePersonaObj.gender_tone}",
        "speaking_rate": "135 WPM (~2.3 words/sec, max 22 words for 8s)",
        "recommended_tts": "${activePersonaObj.tts}",
        "script": "Spoken curiosity hook in English strictly budgeted to 18-22 words for 8 seconds."
      }
    },
    {
      "scene_number": 2,
      "duration": "8s",
      "visual_prompt": "Detailed generative video prompt in English describing ${isNeon ? '3D visuals, glowing neon accents, and fluid mechanics...' : 'natural environment, authentic mineral textures, physical fluid hydrodynamics...'}",
      "camera_movement": "Specific cinematic camera trajectory instruction in English...",
      "style_consistency": {
        "visual_aesthetic": "${activeStyleObj.visual_aesthetic}",
        "color_palette": "${activeStyleObj.color_palette}",
        "render_and_lighting": "${activeStyleObj.render_and_lighting}"
      },
      "continuity": {
        "timeline_segment": "0:08 - 0:16 (The Core)",
        "visual_anchor": "Maintains identical ${isNeon ? 'water fluid shaders and bedrock geometry' : 'crystal-clear water caustics and wet bedrock textures'} from Scene 1",
        "transition_in": "Seamless match cut matching downward camera momentum, penetrating water behind boulder",
        "transition_out": "Camera pushes deep into submerged schist crevices where current drops to near zero"
      },
      "on_screen_text_labels": ${JSON.stringify(activeStyleObj.sample_labels)},
      "sound_effects": ${JSON.stringify(activeStyleObj.sample_sfx.slice(0, 2))},
      "voice_over": {
        "persona": "${activePersonaObj.name}",
        "tone_and_delivery": "${activePersonaObj.gender_tone}",
        "speaking_rate": "135 WPM (~2.3 words/sec, max 22 words for 8s)",
        "recommended_tts": "${activePersonaObj.tts}",
        "script": "Spoken core explanation script in English strictly budgeted to 18-22 words for 8 seconds."
      }
    },
    {
      "scene_number": 3,
      "duration": "8s",
      "visual_prompt": "Detailed generative video prompt in English describing ${isNeon ? '3D visuals, glowing neon accents, and coarse gold settling...' : 'natural environment, authentic mineral textures, physical fluid hydrodynamics...'}",
      "camera_movement": "Specific cinematic camera trajectory instruction in English...",
      "style_consistency": {
        "visual_aesthetic": "${activeStyleObj.visual_aesthetic}",
        "color_palette": "${activeStyleObj.color_palette}",
        "render_and_lighting": "${activeStyleObj.render_and_lighting}"
      },
      "continuity": {
        "timeline_segment": "0:16 - 0:24 (The Loop & Payoff)",
        "visual_anchor": "${isNeon ? 'Continues microscopic view; identical luminous 24k gold reflectance' : 'Extreme macro view of coarse gold nuggets resting in natural schist riffle trap'}",
        "transition_in": "Locks onto deep bedrock crevice trap",
        "transition_out": "Camera swoops upward breaking surface water, re-aligning with Scene 1's starting aerial angle for an infinite visual loop"
      },
      "on_screen_text_labels": ${JSON.stringify(activeStyleObj.sample_labels)},
      "sound_effects": ${JSON.stringify(activeStyleObj.sample_sfx.slice(0, 2))},
      "voice_over": {
        "persona": "${activePersonaObj.name}",
        "tone_and_delivery": "${activePersonaObj.gender_tone}",
        "speaking_rate": "135 WPM (~2.3 words/sec, max 22 words for 8s)",
        "recommended_tts": "${activePersonaObj.tts}",
        "script": "Spoken payoff script in English strictly budgeted to 18-22 words for 8 seconds ending with loop lead-in."
      }
    }
  ],
  "social_media_caption": "Engaging caption in English for TikTok, Instagram Reels, and YouTube Shorts summarizing the secret.",
  "hashtags": ["#GoldProspecting", "#GoldMining", "#GeologyFacts", "#GoldNugget", "#MiningLife", "#EarthScience"]
}`);

      let text = response.text || '';
      // Clean up markdown formatting if present
      if (text.startsWith('```json')) {
        text = text.replace(/```json\n?/, '').replace(/```$/, '');
      } else if (text.startsWith('```')) {
        text = text.replace(/```\n?/, '').replace(/```$/, '');
      }
      
      const rawParsed = JSON.parse(text);
      const rawScenes = Array.isArray(rawParsed) 
        ? rawParsed 
        : (rawParsed.scenes || []);

      // Extract caption and hashtags for UI display
      let caption = rawParsed.social_media_caption || '';
      let tags: string[] = Array.isArray(rawParsed.hashtags) ? rawParsed.hashtags : [];

      if (!caption && topic) {
        const firstLine = topic.split('\n')[0].replace(/^[0-9#.*-\s]+/, '');
        caption = `✨ ${firstLine}\n\nDiscover how gold naturally concentrates and why identifying these geological patterns gives you an unfair advantage. Watch the full 3D breakdown!`;
        tags = ["#GoldProspecting", "#MiningGeology", "#GoldNugget", "#EarthScience", "#Geology", "#GoldRush"];
      }

      setSocialMediaCaption(caption);
      setHashtags(tags);

      // Normalize all scenes to guarantee 100% identical and robust JSON format across scenes
      const normalizedScenes: ScenePrompt[] = rawScenes.map((s: any, idx: number) => {
        const sceneNum = s.scene_number || (idx + 1);
        const voScript = s.voice_over?.script || s.voice_over_script || '';
        return {
          scene_number: sceneNum,
          duration: s.duration || '8s',
          visual_prompt: s.visual_prompt || s.visual_description || '',
          camera_movement: s.camera_movement || 'Smooth cinematic tracking camera with natural depth of field.',
          style_consistency: {
            visual_aesthetic: s.style_consistency?.visual_aesthetic || 'Photorealistic cinematic documentary, 8K ultra-detailed geological simulation, natural physical macro cinematography, authentic mineral and rock textures, grounded tactile realism',
            color_palette: s.style_consistency?.color_palette || 'Natural raw 24k placer gold (#D4AF37), deep wet slate & bedrock gray (#2A2E35), crystal-clear mountain water (#4A7C59 / #3D5A80), warm natural sunlight (#FFF2B2)',
            render_and_lighting: s.style_consistency?.render_and_lighting || 'Cinematic 35mm anamorphic lens realism, natural golden hour / dappled water caustics, physically-based rendering (PBR), shallow depth of field, authentic macro lens bokeh'
          },
          continuity: {
            timeline_segment: s.continuity?.timeline_segment || `${(sceneNum - 1) * 8}s - ${sceneNum * 8}s`,
            visual_anchor: s.continuity?.visual_anchor || 'Locked photorealistic mineral shader and natural riverbed perspective',
            transition_in: s.continuity?.transition_in || (sceneNum === 1 ? 'Instant dynamic macro plunge into scene' : `Seamless match cut from Scene ${sceneNum - 1}`),
            transition_out: s.continuity?.transition_out || (sceneNum === 3 ? 'Upward swoop aligning with Scene 1 for seamless infinite loop' : `Camera pushes forward preparing handoff to Scene ${sceneNum + 1}`)
          },
          on_screen_text_labels: Array.isArray(s.on_screen_text_labels) ? s.on_screen_text_labels : [],
          sound_effects: Array.isArray(s.sound_effects) ? s.sound_effects : [],
          voice_over: {
            persona: s.voice_over?.persona || activePersonaObj.name,
            tone_and_delivery: s.voice_over?.tone_and_delivery || activePersonaObj.gender_tone,
            speaking_rate: s.voice_over?.speaking_rate || '135 WPM (~2.3 words/sec, max 22 words for 8s)',
            recommended_tts: s.voice_over?.recommended_tts || activePersonaObj.tts,
            script: voScript
          },
          voice_over_script: voScript
        };
      });

      setScenes(normalizedScenes);
      setJsonOutput(JSON.stringify(normalizedScenes, null, 2));
      setActiveSceneTab('scene-1');
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate JSON prompt. Please check your API key or try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCurrentPromptText = () => {
    if (!scenes || scenes.length === 0) return jsonOutput || '';
    if (activeSceneTab === 'all') {
      return JSON.stringify(scenes, null, 2);
    }
    const idx = activeSceneTab === 'scene-1' ? 0 : activeSceneTab === 'scene-2' ? 1 : 2;
    return JSON.stringify(scenes[idx] || scenes[0], null, 2);
  };

  const copyToClipboard = () => {
    const text = getCurrentPromptText();
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-neutral-200 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl mx-auto space-y-8 relative z-10"
      >
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-8 mb-8 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-5">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-16 h-16 shrink-0 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] border border-amber-300/20"
            >
              <Video className="w-8 h-8" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-white to-neutral-400 tracking-tight">
                Video Grafis Emas
              </h1>
              <p className="text-neutral-400 text-sm md:text-base mt-2 font-medium max-w-2xl">
                Turn your gold prospecting ideas into photorealistic cinematic 3D video prompts structured exactly as JSON for AI video models.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowApiSettings(!showApiSettings)}
              className={`p-3 rounded-2xl border transition-all ${
                userApiKey 
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20' 
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white'
              }`}
              title="API Key Settings"
            >
              <Key className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {showApiSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-3 w-80 bg-neutral-900/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-5 shadow-2xl z-50 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-500" />
                      API Key Settings
                    </h3>
                    <button onClick={() => setShowApiSettings(false)} className="text-neutral-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                    Enter your own Google Gemini API key to override the default system key. Your key is stored securely in your browser's local storage.
                  </p>
                  
                  <input
                    type="password"
                    value={userApiKey}
                    onChange={(e) => saveApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-neutral-700 font-mono"
                  />
                  
                  {userApiKey && (
                    <div className="mt-3 flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg text-xs font-medium">
                      <Check className="w-4 h-4" />
                      <span>Custom API key active</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            
            {/* 0. Video Style / Version Selector Card */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="bg-neutral-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 via-amber-500/20 to-orange-500/20 flex items-center justify-center border border-white/10">
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-neutral-200 tracking-wider uppercase flex items-center gap-2">
                      Pilihan Versi Gaya Video
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-normal">
                        Preset Visual AI
                      </span>
                    </h2>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Pilih format visual khas neon berenergi tinggi atau sinematik dokumenter natural
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VIDEO_STYLES.map((style) => {
                  const isSelected = selectedVideoStyle === style.id;
                  const isNeon = style.id === 'neon-cyber';
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleSelectVideoStyle(style.id)}
                      className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                        isSelected
                          ? isNeon
                            ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40'
                            : 'bg-amber-500/10 border-amber-500/50 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40'
                          : 'bg-black/40 border-white/5 text-neutral-400 hover:bg-white/5 hover:text-neutral-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-bold flex items-center gap-1.5 ${
                            isSelected ? (isNeon ? 'text-cyan-300' : 'text-amber-300') : 'text-neutral-200'
                          }`}>
                            {isNeon ? <Zap className="w-3.5 h-3.5 text-cyan-400" /> : <Film className="w-3.5 h-3.5 text-amber-400" />}
                            {style.name}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            isSelected 
                              ? (isNeon ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30')
                              : 'bg-white/5 text-neutral-500 border border-white/5'
                          }`}>
                            {style.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                          {style.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px]">
                        <span className={`font-medium ${isSelected ? (isNeon ? 'text-cyan-400/90' : 'text-amber-400/90') : 'text-neutral-500'}`}>
                          {style.tagline}
                        </span>
                        {isSelected && (
                          <div className={`p-0.5 rounded-full ${isNeon ? 'bg-cyan-500/20 text-cyan-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            <Check className="w-3.5 h-3.5 shrink-0" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
            
            {/* 1. Idea Generator */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <span className="font-bold text-sm">1</span>
                  </div>
                  <label className="text-sm font-bold text-neutral-300 tracking-widest uppercase">
                    Initial Idea
                  </label>
                </div>
                
                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowTopicCatalog(true)}
                    className="text-xs flex items-center justify-center space-x-1.5 text-blue-400 hover:text-blue-300 transition-all bg-blue-500/10 hover:bg-blue-500/25 px-3 py-1.5 rounded-xl border border-blue-500/20 hover:border-blue-500/40 duration-200 active:scale-95"
                    title="Buka katalog dan cari dari 102 topik prospeksi emas"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Katalog Topik (102)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRandomizeIdea}
                    className="text-xs flex items-center justify-center space-x-1.5 text-amber-400 hover:text-amber-300 transition-all bg-amber-500/10 hover:bg-amber-500/25 px-3 py-1.5 rounded-xl border border-amber-500/20 hover:border-amber-500/40 duration-200 active:scale-95"
                    title="Dapatkan rekomendasi ide emas menarik secara acak"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Acak Ide Baru</span>
                  </button>
                </div>
              </div>

              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="w-full h-28 bg-black/40 border border-white/5 rounded-2xl p-4 text-sm text-neutral-200 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all outline-none resize-none mb-5 placeholder:text-neutral-700 font-medium leading-relaxed"
                placeholder="What is your video about?"
              />

              <button
                onClick={generateConcept}
                disabled={isGeneratingConcept || !idea.trim()}
                className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-50 text-white font-medium rounded-2xl flex items-center justify-center space-x-2 transition-all hover:shadow-lg active:scale-[0.98]"
              >
                {isGeneratingConcept ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                    <span className="text-sm text-blue-300">Drafting Concept...</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Generate Concept Outline</span>
                  </>
                )}
              </button>
            </motion.div>

            {/* 2. Topic Editor */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-neutral-900/40 backdrop-blur-2xl border border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
              
              <div className="flex items-center space-x-3 mb-2 relative z-10">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <span className="font-bold text-sm">2</span>
                </div>
                <label className="text-sm font-bold text-neutral-300 tracking-widest uppercase">
                  Video Concept & Structure
                </label>
              </div>
              <p className="text-xs text-neutral-500 mb-5 ml-11 relative z-10 font-medium">
                Refine the scene instructions. The AI will strictly format this into 3 scenes of 8 seconds each.
              </p>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-5 text-sm leading-relaxed text-neutral-200 focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all outline-none resize-none placeholder:text-neutral-700 font-medium relative z-10 custom-scrollbar"
                placeholder="Describe your highly detailed video concept here..."
              />

              {/* Quick Style & Voice-Over Controls */}
              <div className="mt-5 mb-2 space-y-3.5 relative z-10">
                {/* Style Switcher Bar in Step 2 */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/5">
                  <span className="text-neutral-300 font-semibold text-xs flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-amber-400" />
                    Versi Gaya Video:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {VIDEO_STYLES.map((st) => {
                      const isSelected = selectedVideoStyle === st.id;
                      const isNeon = st.id === 'neon-cyber';
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => handleSelectVideoStyle(st.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 border ${
                            isSelected
                              ? isNeon
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                              : 'bg-black/40 text-neutral-400 border-white/5 hover:text-neutral-300 hover:bg-white/5'
                          }`}
                        >
                          {isNeon ? <Zap className="w-3 h-3 text-cyan-400" /> : <Film className="w-3 h-3 text-amber-400" />}
                          <span>{st.badge}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Voice-Over Character Consistency Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-amber-400" />
                      Karakter Voice Over (Konsisten 3 Scene):
                    </span>
                    <span className="text-[11px] text-amber-400/80 font-mono">18-22 kata / scene (8s)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {VOICE_PERSONAS.map((vp) => {
                      const isSelected = selectedVoicePersona === vp.id;
                      return (
                        <button
                          key={vp.id}
                          type="button"
                          onClick={() => setSelectedVoicePersona(vp.id)}
                          className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30'
                              : 'bg-black/40 border-white/5 text-neutral-400 hover:bg-white/5 hover:text-neutral-300'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-bold flex items-center justify-between">
                              <span>{vp.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            </div>
                            <div className="text-[10px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                              {vp.subtitle}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={generatePrompt}
                className={`mt-6 w-full py-4 px-4 font-bold rounded-2xl flex items-center justify-center space-x-2 transition-all relative z-10 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 text-white ${
                  selectedVideoStyle === 'neon-cyber'
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-amber-500 hover:from-cyan-400 hover:via-blue-500 hover:to-amber-400 shadow-[0_4px_25px_rgba(6,182,212,0.3)]'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-[0_4px_20px_rgba(245,158,11,0.25)]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating JSON...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Generate 3-Scene JSON Prompt</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-start space-x-3 backdrop-blur-md"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social Media Caption Card (Dedicated for UI display, strictly excluded from video prompt JSON) */}
            <AnimatePresence>
              {socialMediaCaption && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  className="bg-[#0c0e14]/90 backdrop-blur-2xl border border-sky-500/25 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-4"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-sky-500/15 rounded-xl border border-sky-500/25 text-sky-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-sky-300 tracking-wider uppercase">
                          Social Media Caption
                        </h3>
                        <p className="text-[11px] text-neutral-400">
                          TikTok • Instagram Reels • YouTube Shorts
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={copyCaptionToClipboard}
                      className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all active:scale-95 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                      title="Salin Caption & Hashtags"
                    >
                      {copiedCaption ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Caption</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="relative z-10 space-y-3">
                    <div className="relative">
                      <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed bg-black/60 p-4 rounded-2xl border border-white/5 whitespace-pre-wrap font-sans">
                        {socialMediaCaption}
                      </p>
                    </div>
                    
                    {hashtags && hashtags.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                          Hashtags
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {hashtags.map((tag: string, idx: number) => (
                            <span 
                              key={idx} 
                              className="text-[11px] font-medium text-sky-300/90 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg"
                            >
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>Dipisahkan dari JSON prompt agar tidak mengotori AI video generator.</span>
                      <button
                        onClick={copyCaptionToClipboard}
                        className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
                      >
                        {copiedCaption ? 'Tersalin' : 'Copy All'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Output Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col space-y-6 h-auto min-h-[650px] lg:min-h-full"
          >
            <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden flex flex-col shadow-2xl flex-1">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/30">
                <div className="flex items-center space-x-3 text-neutral-300">
                  <div className={`p-2 rounded-xl border ${
                    selectedVideoStyle === 'neon-cyber'
                      ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400'
                      : 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                  }`}>
                    {selectedVideoStyle === 'neon-cyber' ? (
                      <Zap className="w-5 h-5" />
                    ) : (
                      <FileJson className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold tracking-widest text-neutral-300 uppercase">
                        Per-Scene Video Prompts (JSON)
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        selectedVideoStyle === 'neon-cyber'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                      }`}>
                        {selectedVideoStyle === 'neon-cyber' ? '⚡ Khas Neon 3D' : '🎬 Realistis Sinematik'}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500 font-medium block mt-0.5">
                      {selectedVideoStyle === 'neon-cyber'
                        ? '3D Motion Graphics & Cyan Telemetry HUD (8s per Scene)'
                        : 'Photorealistic 8s Cinematic Scene Prompts for AI Video Generators'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {scenes && scenes.length > 0 && activeSceneTab !== 'all' && (
                    <button
                      onClick={() => {
                        const sceneNum = activeSceneTab === 'scene-1' ? 1 : activeSceneTab === 'scene-2' ? 2 : 3;
                        copySceneJson(sceneNum);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center space-x-1.5 transition-all active:scale-95 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                      title="Salin hanya JSON scene yang aktif"
                    >
                      {copiedScene === (activeSceneTab === 'scene-1' ? 1 : activeSceneTab === 'scene-2' ? 2 : 3) ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy {activeSceneTab.toUpperCase().replace('-', ' ')} JSON</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={copyAllJson}
                    disabled={!scenes}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-40 transition-all active:scale-95 border border-white/5"
                    title="Copy All 3 Scenes JSON Array"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Scene Tabs Bar */}
              {scenes && scenes.length > 0 && (
                <div className="px-6 pt-3 pb-3 border-b border-white/5 bg-[#07080c] flex items-center gap-2 overflow-x-auto custom-scrollbar">
                  {[
                    { id: 'scene-1', label: 'Scene 1: Hook', badge: '8s' },
                    { id: 'scene-2', label: 'Scene 2: Core', badge: '8s' },
                    { id: 'scene-3', label: 'Scene 3: Loop', badge: '8s' },
                    { id: 'all', label: 'Semua (3 Scenes Array)', badge: '24s' },
                  ].map((tab) => {
                    const isActive = activeSceneTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSceneTab(tab.id as any)}
                        className={`text-xs px-3.5 py-2 rounded-xl whitespace-nowrap font-medium transition-all flex items-center gap-2 border ${
                          isActive
                            ? selectedVideoStyle === 'neon-cyber'
                              ? 'bg-cyan-400 text-black font-bold border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                              : 'bg-amber-500 text-black font-bold border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                            : 'bg-white/5 text-neutral-400 border-white/5 hover:bg-white/10 hover:text-neutral-200'
                        }`}
                      >
                        {selectedVideoStyle === 'neon-cyber' ? (
                          <Zap className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-neutral-500'}`} />
                        ) : (
                          <Film className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-neutral-500'}`} />
                        )}
                        <span>{tab.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-black/25 text-black' : 'bg-white/10 text-neutral-400'}`}>
                          {tab.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Continuity and Details Strip for Active Scene */}
              {scenes && scenes.length > 0 && activeSceneTab !== 'all' && (() => {
                const sceneIndex = activeSceneTab === 'scene-1' ? 0 : activeSceneTab === 'scene-2' ? 1 : 2;
                const activeScene = scenes[sceneIndex] || scenes[0];
                return (
                  <div className="px-6 py-3.5 bg-[#090a0f] border-b border-white/5 space-y-2.5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded border ${
                          selectedVideoStyle === 'neon-cyber'
                            ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25'
                            : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        }`}>
                          Timeline: {activeScene.continuity?.timeline_segment || `${activeScene.duration}`}
                        </span>
                        <span className="text-neutral-500">•</span>
                        <span className="text-neutral-300 font-medium truncate max-w-xs">
                          {activeScene.continuity?.visual_anchor}
                        </span>
                      </div>

                      {activeScene.on_screen_text_labels && activeScene.on_screen_text_labels.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {activeScene.on_screen_text_labels.map((lbl, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                              {lbl}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Flow & Transitions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <div>
                        <span className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px] block mb-0.5">
                          Transition In:
                        </span>
                        <span className="text-neutral-300">{activeScene.continuity?.transition_in || '-'}</span>
                      </div>
                      <div>
                        <span className="text-amber-500/80 font-semibold uppercase tracking-wider text-[10px] block mb-0.5">
                          Transition Out & Continuity Link:
                        </span>
                        <span className="text-neutral-300">{activeScene.continuity?.transition_out || '-'}</span>
                      </div>
                    </div>

                    {/* Voice Over Script & Character Inspector */}
                    {(activeScene.voice_over?.script || activeScene.voice_over_script) && (
                      <div className="bg-emerald-500/[0.04] border border-emerald-500/20 rounded-2xl p-3 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/10 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-emerald-500/20 rounded-lg text-emerald-400">
                              <Mic className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-emerald-300">
                                  {activeScene.voice_over?.persona || 'Documentary Narrator'}
                                </span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300/80 font-medium">
                                  Voice Over
                                </span>
                              </div>
                              <span className="text-[10px] text-neutral-400 block mt-0.5">
                                {activeScene.voice_over?.tone_and_delivery || 'Documentary cadence, calm authoritative'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {activeScene.voice_over?.recommended_tts && (
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/40 text-emerald-400/80 border border-emerald-500/20 font-mono hidden sm:inline-block">
                                {activeScene.voice_over.recommended_tts}
                              </span>
                            )}
                            <button
                              onClick={() => {
                                const text = activeScene.voice_over?.script || activeScene.voice_over_script || '';
                                if (text) {
                                  navigator.clipboard.writeText(text);
                                  setCopiedVoiceOver(true);
                                  setTimeout(() => setCopiedVoiceOver(false), 2000);
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-[10px] font-semibold transition-all flex items-center gap-1 border border-emerald-500/20 active:scale-95"
                              title="Salin naskah voice over scene ini"
                            >
                              {copiedVoiceOver ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedVoiceOver ? 'Tersalin' : 'Salin Naskah'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="pt-0.5">
                          <p className="text-xs sm:text-[13px] text-emerald-200/95 leading-relaxed italic font-sans bg-black/40 p-2.5 rounded-xl border border-white/5">
                            "{activeScene.voice_over?.script || activeScene.voice_over_script}"
                          </p>
                          <div className="flex items-center justify-between mt-1.5 text-[10px] text-neutral-500">
                            <span>Pacing: {activeScene.voice_over?.speaking_rate || '~135 WPM (8s)'}</span>
                            <span>
                              ~{(activeScene.voice_over?.script || activeScene.voice_over_script || '').split(/\s+/).filter(Boolean).length} kata (Target: 18-22 kata)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
              
              {/* Code Viewer */}
              <div className="p-6 md:p-8 bg-[#050508]/80 flex-1 overflow-auto custom-scrollbar relative">
                <AnimatePresence mode="wait">
                  {scenes && scenes.length > 0 ? (
                    <motion.div
                      key={activeSceneTab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-neutral-500">
                        <span>
                          {activeSceneTab === 'all' 
                            ? 'ALL_SCENES_PROMPT_ARRAY.JSON' 
                            : `STANDALONE_SCENE_${activeSceneTab.toUpperCase().replace('-', '_')}.JSON`}
                        </span>
                        <span>Format: Standardized Pure Scene JSON</span>
                      </div>

                      <pre className="text-[12px] sm:text-[13px] leading-relaxed font-mono text-emerald-400/90 whitespace-pre-wrap break-words bg-black/60 p-5 rounded-2xl border border-white/5">
                        {activeSceneTab === 'all'
                          ? JSON.stringify(scenes, null, 2)
                          : (() => {
                              const sceneIndex = activeSceneTab === 'scene-1' ? 0 : activeSceneTab === 'scene-2' ? 1 : 2;
                              const scene = scenes[sceneIndex] || scenes[0];
                              return JSON.stringify(scene, null, 2);
                            })()}
                      </pre>
                    </motion.div>
                  ) : jsonOutput ? (
                    <motion.pre 
                      key="raw-code"
                      initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-[13px] leading-relaxed font-mono text-emerald-400/90 whitespace-pre-wrap break-words"
                    >
                      {jsonOutput}
                    </motion.pre>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-5 min-h-[350px]"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                        <FileJson className="w-16 h-16 opacity-30 relative z-10 text-blue-300" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-semibold tracking-widest uppercase text-neutral-400">Waiting for generation...</p>
                        <p className="text-xs text-neutral-600 max-w-xs">
                          JSON per scene murni tanpa metadata medsos akan tampil di sini.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Copy Footer Bar */}
              {scenes && scenes.length >= 3 && (
                <div className="px-6 py-3 border-t border-white/5 bg-[#08090d] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-neutral-500 font-medium">Quick Copy per Scene:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        onClick={() => copySceneJson(num)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500/15 hover:text-emerald-300 border border-white/5 text-[11px] font-medium transition-all active:scale-95 flex items-center gap-1"
                      >
                        {copiedScene === num ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-neutral-500" />
                        )}
                        <span>Scene {num}</span>
                      </button>
                    ))}
                    <button
                      onClick={copyAllJson}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/15 hover:text-amber-300 border border-white/5 text-[11px] font-medium transition-all active:scale-95 flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3 text-amber-400" /> : <Layers className="w-3 h-3 text-neutral-500" />}
                      <span>All (3 Scenes)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Topic Catalog Modal */}
      <AnimatePresence>
        {showTopicCatalog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0b0c12] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                      Katalog Topik Prospeksi Emas (Goldgen)
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                        {filteredTopics.length} Topik
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Pilih topik geologi dan metode penemuan emas lapangan untuk membuat video 3D visual.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowTopicCatalog(false)}
                  className="p-2 text-neutral-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-95"
                  title="Tutup Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Category Filter Toolbar */}
              <div className="p-4 sm:p-6 border-b border-white/5 space-y-3 bg-[#0e1017]">
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Cari topik (misal: river, quartz, sluice, pyrite, detector)..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-10 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all"
                  />
                  {catalogSearch && (
                    <button
                      onClick={() => setCatalogSearch('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  {CATEGORIES.map((cat) => {
                    const count = cat === 'All' 
                      ? GOLDGEN_TOPICS.length 
                      : GOLDGEN_TOPICS.filter(t => t.category === cat).length;
                    const isActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all flex items-center gap-1.5 border ${
                          isActive
                            ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                            : 'bg-white/5 text-neutral-400 border-white/5 hover:bg-white/10 hover:text-neutral-200'
                        }`}
                      >
                        <span>{cat === 'All' ? 'Semua Kategori' : cat}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/30 text-black' : 'bg-white/10 text-neutral-400'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Topics Grid */}
              <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-3">
                {filteredTopics.length === 0 ? (
                  <div className="py-16 text-center text-neutral-500 flex flex-col items-center justify-center space-y-3">
                    <Search className="w-10 h-10 opacity-30" />
                    <p className="text-sm font-medium">Tidak ada topik yang cocok dengan pencarian "{catalogSearch}"</p>
                    <button
                      onClick={() => { setCatalogSearch(''); setSelectedCategory('All'); }}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      Reset filter & pencarian
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredTopics.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleSelectTopic(t)}
                        className="group bg-white/[0.02] hover:bg-amber-500/[0.04] border border-white/5 hover:border-amber-500/30 rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-[0_4px_20px_rgba(245,158,11,0.08)] active:scale-[0.99]"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 border border-white/5 group-hover:border-amber-500/20 group-hover:text-amber-400 transition-colors">
                              {t.category}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-600 group-hover:text-neutral-400">
                              #{t.id}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-neutral-200 group-hover:text-amber-300 transition-colors leading-snug">
                            {t.headline}
                          </h3>
                          <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                            {t.subtitle}
                          </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/5">
                          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                            {t.list_header}:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {t.list_points.slice(0, 3).map((point, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-neutral-400 border border-white/5 group-hover:border-white/10"
                              >
                                {point.replace(/\.$/, '')}
                              </span>
                            ))}
                            {t.list_points.length > 3 && (
                              <span className="text-[10px] px-1.5 py-0.5 text-neutral-500">
                                +{t.list_points.length - 3} lagi
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/5 bg-[#08090d] flex items-center justify-between text-xs text-neutral-500">
                <span>Klik kartu topik untuk langsung mengisi ke <strong>Step 1 (Initial Idea)</strong>.</span>
                <button
                  onClick={() => setShowTopicCatalog(false)}
                  className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl transition-all font-medium"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
