/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */

const sounds = {
  explosion: { url: 'media/explosion.mp3' },
  splash: { url: 'media/splash.mp3' },
};

const soundContext = new AudioContext();

function loadSound(name) {
  const sound = sounds[name];

  const { url } = sound;
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = () => {
    soundContext.decodeAudioData(request.response, (newBuffer) => {
      sound.buffer = newBuffer;
    });
  };

  request.send();
}

export default function playSound(name, options) {
  const sound = sounds[name];
  const soundVolume = sounds[name].volume || 1;

  const { buffer } = sound;
  if (buffer) {
    const source = soundContext.createBufferSource();
    source.buffer = buffer;

    const volume = soundContext.createGain();

    if (options) {
      if (options.volume) {
        volume.gain.value = soundVolume * options.volume;
      }
    } else {
      volume.gain.value = soundVolume;
    }

    volume.connect(soundContext.destination);
    source.connect(volume);
    source.start(0);
  }
}

for (const key in sounds) {
  loadSound(key);
}
