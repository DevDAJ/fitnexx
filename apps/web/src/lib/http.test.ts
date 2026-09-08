import { expect, test } from "bun:test";

import { BodyTooLargeError, readLimitedBody } from "./http";

test("reads bodies up to the byte limit", async () => {
  expect(
    await readLimitedBody(
      new Request("https://fitnexx.app", { method: "POST", body: "ok" }),
      2,
    ),
  ).toBe("ok");
  await expect(
    readLimitedBody(
      new Request("https://fitnexx.app", { method: "POST", body: "large" }),
      2,
    ),
  ).rejects.toBeInstanceOf(BodyTooLargeError);
});
