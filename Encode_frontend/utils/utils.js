export function getLorem() {
  return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id nibh tortor id aliquet lectus proin nibh nisl. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Massa sed elementum tempus egestas sed sed. Viverra nibh cras pulvinar mattis nunc sed. Nunc consequat interdum varius sit amet int- erdum posuere lorem ipsum dolor sit amet.";
}

export function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

export function truncateNumber(number) {
  let tmp = number * 10 ** -18
  return tmp.toFixed(5)
}