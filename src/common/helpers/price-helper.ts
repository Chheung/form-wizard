import { COUNTRY_INFORMATIONS_CONSTANT, PACKAGE_CONSTANT } from "..";

export const getPremiumPrice = (age: number, locationValue: number) => {
  const selectedCountry = COUNTRY_INFORMATIONS_CONSTANT.find(
    (c) => c.value === locationValue
  );

  return 10 * age * (selectedCountry?.rate || 0);
};

export const getAdditionalPriceByPackage = (
  premiumPrice: number,
  pkgValue: number
) => {
  if (!pkgValue) return 0;

  const selectedPkg = PACKAGE_CONSTANT.find((p) => p.value === pkgValue);
  return (premiumPrice * (selectedPkg?.addOnPercentage || 0)) / 100;
};
