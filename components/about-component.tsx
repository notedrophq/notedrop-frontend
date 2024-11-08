"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

// Define the expected shape of the 'step' object
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

export default function AboutComponent() {
  const steps: Step[] = [
    {
      title: "Our Mission",
      description:
        "Notedrop was created to make high-quality educational resources accessible to students everywhere. Our mission is to foster a collaborative learning community where students can easily share, discover, and utilize notes for effective studying.",
      subpoints: [],
    },
    {
      title: "Our Story",
      description:
        "As students ourselves, we noticed the challenge of finding concise, well-organized notes. We wanted a space where students could not only share their work but also help each other succeed academically. That's how, Notedrop was born.",
      subpoints: [],
    },
    {
      title: "How It Works",
      description:
        "Welcome to Notedrop! Here’s a quick guide to help you get started on our platform. Follow these simple steps to get started.",
      subpoints: [
        "Signup - Create a free account to get access to all of Notedrop features",
        "Complete your Profile - Add Profile Picture, Set up your preferences for the best experience",
        "Engage with Community - Upload your own notes or interact with other Students' Notes.",
      ],
    },
    {
      title: "Key Features",
      description: "Here is a short list of Notedrop Features",
      subpoints: [
        "Note-Sharing: Easily share and discover notes.",
        "Collaborative Community: Connect with other students for mutual support.",
        "Subject Tagging: Organize notes by subjects and keywords for easy searching.",
        "Accessible from Anywhere: Access Notedrop on your phone, tablet, or computer.",
      ],
    },
    {
      title: "Our Values",
      description:
        "This is list of our values that define our development route.",
      subpoints: [
        "Accessibility: We believe knowledge should be within reach for everyone.",
        "Collaboration: We promote a supportive community where students help each other.",
        "Simplicity: We design with ease of use in mind to enhance your study experience.",
        "Integrity: We value academic honesty and encourage original work.",
      ],
    },
    {
      title: "Community Guidelines",
      description: "Here are some rules to follow regarding our platform",
      subpoints: [
        "Be respectful of others.",
        "Share original content.",
        "Support each other’s learning journey.",
      ],
    },
    {
      title: "Future Goals",
      description: "Here are future goals to levelup Notedrop",
      subpoints: [
        "Study Groups",
        "Interactive Tools",
        "Mobile app for IOS and Android devices",
      ],
    },
    {
      title: "Contact Us",
      description: "Here is a way to contact us",
      subpoints: ["Contact us at contact@notedrop.app"],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          About Notedrop
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
  const ref = useRef(null);
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
