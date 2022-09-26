export const getRandomObjectName = () => {
  const firstName = [
    "Happy",
    "Blessed",
    "Spooky",
    "Brave",
    "Good",
    "Light",
    "Laser",
    "New",
    "Old",
    "Shinging",
    "Quick",
    "Cool",
    "Fun",
    "Nice",
  ];

  const surName = ["duck", "lasershow", "ghost", "color", "jar", "point", "show", "emiting", "sensational", "look"];

  const firstNameIndex = Math.round(Math.random() * firstName.length - 1);
  const lastNameIndex = Math.round(Math.random() * surName.length - 1);
  return `${firstName[firstNameIndex]} ${surName[lastNameIndex]}`;
};
