import { describe, test, expect } from "vitest";
import { calculateTotalPrice } from "../utils/calculateTotalPrice";

describe("calculateTotalPrice", () => {

    test("calculates total price correctly", () => {
        expect(
            calculateTotalPrice(200, 3)
        ).toBe(600);
    });

    test("returns 0 when nights are 0", () => {
        expect(
            calculateTotalPrice(200, 0)
        ).toBe(0);
    });

    test("works with decimal prices", () => {
        expect(
            calculateTotalPrice(99.99, 2)
        ).toBeCloseTo(199.98);
    });

});