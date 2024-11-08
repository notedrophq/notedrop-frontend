"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface Step {
  title: string;
  description: string;
  subpoints: string[];
}

// Define the props for StepItem component
interface StepItemProps {
  step: Step;
  index: number;
}

export default function GetStartedGuide() {
  const steps: Step[] = [
    {
      title: "Sign up for an account",
      description:
        "Create your personal account to get started with our platform.",
      subpoints: [
        "Visit our homepage and click the 'Sign Up' button",
        "Fill in your details: name, email, and password or continue with Google",
        "Agree to the terms of service",
      ],
    },
    {
      title: "Verify your email address",
      description:
        "Confirm your email to ensure account security and access all features.",
      subpoints: [
        "Check your inbox for a verification email",
        "Click the verification link in the email",
        "If you don't see the email, check your spam folder",
      ],
    },
    {
      title: "Complete your profile",
      description: "Add more information to personalize your experience.",
      subpoints: [
        "Upload a profile picture",
        "Add your professional details",
        "Set your preferences",
      ],
    },
    {
      title: "Explore the dashboard",
      description:
        "Familiarize yourself with the main features and navigation.",
      subpoints: [
        "Browse through the main menu items",
        "Check out the quick start guide",
        "Locate the help and support section",
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Get Started
        </h1>
        <ol className="space-y-8 mr-4 ml-4">
          {steps.map((step, index) => (
            <StepItem key={index} step={step} index={index} />
          ))}
        </ol>
      </div>
    </div>
  );
}

function StepItem({ step, index }: StepItemProps) {
  const ref = useRef<HTMLLIElement>(null); // Specify the ref type for better TypeScript support
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
          <span className="text-[#15D364] mr-3 text-2xl">{index + 1}</span>
          {step.title}
        </h2>
        <p className="text-gray-600 mb-4">{step.description}</p>
        <ul className="space-y-2 text-gray-700">
          {step.subpoints.map((subpoint, subIndex) => (
            <li key={subIndex} className="flex items-start">
              <span className="text-[#15D364] mr-2">•</span>
              {subpoint}
            </li>
          ))}
        </ul>
      </div>
    </motion.li>
  );
}
