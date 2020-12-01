import { bresenhamLine, getImage, toBlob } from './helpers.js';

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d', {
  desynchronized: true,
});

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'black';

let previousPoint = null;
canvas.addEventListener('pointerdown', (event) => {
  previousPoint = { x: ~~event.offsetX, y: ~~event.offsetY };
});
canvas.addEventListener('pointermove', (event) => {
  if (previousPoint) {
    const currentPoint = { x: ~~event.offsetX, y: ~~event.offsetY };
    for (const point of bresenhamLine(
      previousPoint.x,
      previousPoint.y,
      currentPoint.x,
      currentPoint.y
    )) {
      ctx.fillRect(point.x, point.y, 2, 2);
    }
    previousPoint = currentPoint;
  }
});
canvas.addEventListener('pointerup', () => {
  previousPoint = null;
});

const txtColor = document.querySelector('#color');
txtColor.addEventListener('change', () => {
  ctx.fillStyle = txtColor.value;
});

let clearButton = document.getElementById('clear');
clearButton.addEventListener('click', (e) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});



let openButton = document.getElementById('open');
openButton.addEventListener('click', async () => {
  

  if ('showOpenFilePicker' in window)
  {
    let fileHandle;
    [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    const image = await getImage(file);
    ctx.drawImage(image, 0, 0);
  }
  else
  {
    alert('Besorg dir halt nen ordentlichen Browser, Trottel!');
    //TODO: Fallback für IE11-Gesindel
  }
});

let saveButton = document.getElementById('save');
saveButton.addEventListener('click', async () => {
  //TODO: Fallback für IE11-Gesindel
  if ('showSaveFilePicker' in window)
  {
    const options = {
      types: [
        {
          description: 'PNG Images',
          accept: {
            'image/png': ['.png'],
          },
        },
      ],
    };
  
    const fileHandle = await window.showSaveFilePicker(options);
    const writable = await fileHandle.createWritable();
    const contents = await toBlob(canvas);
    await writable.write(contents);
    await writable.close();
  }
  else
  {
    alert('Besorg dir halt nen ordentlichen Browser, Trottel!');
    //TODO: Fallback für IE11-Gesindel
  }
});

let copyButton = document.getElementById('copy');
copyButton.addEventListener('click', async () => {
  try {
      const blob = await toBlob(canvas);
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
  } catch (err) {
    console.error(err.name, err.message);
  }
});

let pasteButton = document.getElementById('paste');
pasteButton.addEventListener('click', async () => {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        const image = await getImage(blob);
        ctx.drawImage(image, 0, 0);
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
});

let shareButton = document.getElementById('share');
shareButton.addEventListener('click', async() => {
  const blob = await toBlob(canvas);
  const file = new File([blob], 'shittypwa-scribble.png', { type: "image/png" });
  const filesArray = [file];

  if (navigator.canShare && navigator.canShare({ files: filesArray })) {
    navigator.share({
      files: filesArray,
      title: 'Scribble',
      text: 'MyShitty PWA scribble',
    })
    .then(() => console.log('Share was successful.'))
    .catch((error) => console.log('Sharing failed', error));
  } else {
    console.log(`Your system doesn't support sharing files.`);
  }
});
