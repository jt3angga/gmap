const K_SIZE = 40;

const Style = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  width: K_SIZE,
  height: K_SIZE,
  left: -K_SIZE / 2,
  top: -K_SIZE / 2,
  cursor: 'pointer'
};


const StyleHover = {
  ...Style,
};

export {Style, StyleHover, K_SIZE};
