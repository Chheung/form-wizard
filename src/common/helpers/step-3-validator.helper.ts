export const isValidFormData = (data: {
  name: string;
  age: number;
  pkg: number;
  location: number;
}) => {
  try {
    if (!data) return false;

    const { name, age, pkg, location } = data;

    console.log({ name, age, pkg, location });
    if (!name) return false;
    if (typeof age !== "number" || age < 0 || age > 100) return false;
    if (typeof pkg !== "number" || pkg < 0) return false;
    if (typeof location !== "number" || location < 0) return false;

    return true;
  } catch (e) {
    return false;
  }
};
