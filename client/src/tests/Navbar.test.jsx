import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { BrowserRouter } from "react-router-dom";
import { test, expect, vi } from "vitest";
import { AuthContext } from "../context/AuthContext";

vi.mock("../assets", () => ({
    assets: {
        logo: "logo.png",
        menu: "menu.png",
        close: "close.png",
    },
}));

vi.mock("../firebase", () => ({
    auth: {},
}));

test("renders login button when user is not logged in", () => {
    render(
        <BrowserRouter>
            <AuthContext.Provider value={{ currentUser: null }}>
                <Navbar />
            </AuthContext.Provider>
        </BrowserRouter>
    );

    expect(screen.getAllByText(/login/i)[0]).toBeInTheDocument();
});