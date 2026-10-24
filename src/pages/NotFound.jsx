import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { Button } from "../components/UI.jsx";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-grad-hero flex flex-col items-center justify-center px-6 text-center">
      <Logo size="lg" />
      <h1 className="font-display text-3xl font-semibold text-plum-800 mt-8 mb-3">Page not found</h1>
      <p className="text-plum-600 mb-8 max-w-sm">We couldn't find what you were looking for. Let's get you back on track.</p>
      <Link to="/">
        <Button variant="primary">Return home</Button>
      </Link>
    </div>
  );
}
