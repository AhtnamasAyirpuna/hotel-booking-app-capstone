import React from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import LoginModal from "../components/LoginModal";

vi.mock("firebase/auth", () => ({
    getAuth: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
}));

describe("LoginModal", () => {
    test("renders login form correctly", () => {
        render(
            <LoginModal
                onClose={() => { }}
                switchToSignup={() => { }} />
        );

        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText(/email/i)
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText(/password/i)
        ).toBeInTheDocument();
    });
});