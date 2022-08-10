export const checkCartItemDataEquality = (itemToCompare, itemInReduxStore) => {
  return JSON.stringify(itemToCompare) === JSON.stringify(itemInReduxStore)
}