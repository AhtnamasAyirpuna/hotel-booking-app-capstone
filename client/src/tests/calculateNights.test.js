import { describe, test, expect } from "vitest";
import { calculateNights } from "../utils/calculateNight";

describe("calculateNights", () => {

    test("calculate 1 night correctly", () => {
        expect(
            calculateNights("2026-05-01", "2026-05-02")
        ).toBe(1);
    })

    test("calculates multiple nights correctly", () => {
        expect(
            calculateNights("2026-05-01", "2026-05-05")
        ).toBe(4);
    })

    test("returns 0 for same day booking", () => {
        expect(
            calculateNights("2026-05-01", "2026-05-01")
        ).toBe(0);
    });
});