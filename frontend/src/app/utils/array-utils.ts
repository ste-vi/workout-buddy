export function deleteFromArray<T>(array: T[], item: T): void {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

export function replaceItemInArray<T>(array: T[], newItem: T, predicate: (item: T) => boolean) {
  const index = array.findIndex(predicate);
  if (index !== -1) {
    array.splice(index, 1, newItem);
  }
}
