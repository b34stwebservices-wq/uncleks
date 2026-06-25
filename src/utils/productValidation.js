export const parseProductPrice = (price) => {
  const parsedPrice = Number.parseFloat(price);
  return Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : null;
};
