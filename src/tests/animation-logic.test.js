const {
  getPatternAnimationSettingsPlaceholder,
} = require("services/logic/animation-logic");

test("getPatternAnimationSettingsPlaceholder test", () => {
  const settingsUuid = "a7f63c54-bcc5-4384-b969-3f59c00c8318";
  const patternAnimationUuid = "254b409f-bd5e-4ebf-8cbd-4369d4a4b16e";
  const points = [{ uuid: "2e287337-5c9a-41e5-a4ef-05991a57cfda" }];

  const placeholder = getPatternAnimationSettingsPlaceholder(
    settingsUuid,
    patternAnimationUuid,
    points
  );

  expect(placeholder.uuid).toBe(settingsUuid);
  expect(placeholder.patternAnimationUuid).toBe(patternAnimationUuid);
  expect(placeholder.points.length).toBe(1);
});
