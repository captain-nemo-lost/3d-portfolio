// @ts-nocheck
import React from 'react';
import { EffectComposer, Bloom, Noise as _Noise, Vignette as _Vignette, ChromaticAberration, ToneMapping as _ToneMapping } from '@react-three/postprocessing';

const Noise = _Noise as any;
const Vignette = _Vignette as any;
const ToneMapping = _ToneMapping as any;
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

export const Effects: React.FC = () => {
  return (
    <EffectComposer disableNormalPass multisampling={4}>
      {/* Bloom to catch the HDR values of the dye */}
      <Bloom 
        luminanceThreshold={0.8} 
        luminanceSmoothing={0.9} 
        intensity={1.2} 
        mipmapBlur 
      />
      
      {/* Subtle chromatic aberration for cinematic edge */}
      <ChromaticAberration 
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.001, 0.001)} 
      />
      
      {/* Very fine film grain */}
      <Noise 
        premultiply 
        blendFunction={BlendFunction.SCREEN} 
        opacity={0.015} 
      />
      
      {/* Vignette to draw attention to the center */}
      <Vignette 
        eskil={false} 
        offset={0.1} 
        darkness={1.1} 
      />
      
      {/* Premium ACES Filmic tone mapping */}
      <ToneMapping 
        adaptive={true}
        mode={THREE.ACESFilmicToneMapping}
      />
    </EffectComposer>
  );
};
