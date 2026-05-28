import { describe, test, expect } from "vitest";
import { isDateRangeValid } from "../utils/isDateRangeValid";

describe("isDateRangeValid", () => {
    test("return true for valid date range", () => {
        expect(
            isDateRangeValid(
                "2026-05-01",
                "2026-05-05"
            )
        ).toBe(true);
    });

    test("returns false for same day", () => {
        expect(
            isDateRangeValid(
                "2026-05-01",
                "2026-05-01"
            )
        ).toBe(false);
    });

    test("returns false when checkOut is before checkin", () => {
        expect(
            isDateRangeValid(
                "2026-05-05",
                "2026-05-01"
            )
        ).toBe(false);
    });
});