export const getZonesPlaceholder = () => {
  return [
    {
      points: [
        {
          x: -4000,
          y: 0,
        },
        {
          x: 4000,
          y: 0,
        },
        {
          x: 4000,
          y: -4000,
        },
        {
          x: -4000,
          y: -4000,
        },
      ],
      maxPowerPwm: 3,
    },
  ];
};
