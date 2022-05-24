export const isValidFormData = (data) => {
  try {
    if (!data) return false;

    const { name, age, pkg, location } = data;

    if (!name) return false;
    if (typeof age !== "number" || age < 0 || age > 100) return false;
    if (typeof pkg !== "number" || pkg < 0) return false;
    if (typeof location !== "number" || location < 0) return false;

    return true;
  } catch (e) {
    return false;
  }
};
