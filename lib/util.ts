export function shuffle(array: Array<any>) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function maxItemsFromHeight(height: number, deadspace: number, rowHeight: number) {
  return Math.floor((height - deadspace) / rowHeight)
}

export function formatDate(object: Object) {
  Object.keys(object).forEach((key) => {
    if (object[key] instanceof Date) {
      object[key] = object[key].toUTCString();
    }
  });
}

export function formatUndefined(object: Object) {
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === 'undefined') {
      console.log('Key', key, 'Object', object)
      object[key] = null;
    }
  });
}
