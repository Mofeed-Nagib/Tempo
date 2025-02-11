"use client";

import { Router } from "tabler-icons-react";

import React, { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@mantine/core";

import { useLayout } from "./layoutContext";

const LandingPage = () => {
  const { showSidebar, setShowSidebar, showFooter, setShowFooter } = useLayout();
  const router = useRouter();

  useEffect(() => {
    if (showSidebar) setShowSidebar(false);
    if (!showFooter) setShowFooter(true);
  }, [showSidebar, setShowSidebar, showFooter, setShowFooter]);

  return (
    <div className="h-full w-full bg-paper text-[#526B45] flex flex-col lg:flex-row align-middle items-center">
      <div className="mt-5 lg:mt-0 w-full lg:w-5/12 text-center flex flex-col ml-2">
        <p className="w-full font-medium pb-5 lg:pb-10 text-2xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
          Streamline your schedule with AI
        </p>
        <p className="w-full font-normal pb-5 lg:pb-10 text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
          With Tempo, you can easily organize your daily tasks, set reminders and deadlines, and
          receive personalized productivity insights based on your work patterns.
        </p>
        {/* <p className="w-full text-left font-normal text-xl pb-5">
          With Tempo, you can easily organize your daily tasks, set reminders and deadlines, and
          receive personalized productivity insights based on your work patterns.
        </p>
        <p className="w-full text-left font-normal text-xl pb-5">
          Whether you&rsquo;re juggling coursework, extracurricular activities, or part-time jobs,
          Tempo is here to help you stay on top of your to-do list.
        </p>
        <p className="w-full text-left font-normal text-xl pb-5">
          Effortlessly import your assignments, their descriptions, and deadlines within seconds by
          uploading a syllabus.
        </p>
        <p className="w-full text-left font-normal text-xl pb-5">
          Use our Chrome extension to conveniently view your daily tasks and add new ones without
          feeling overwhelmed by your entire calendar all at once.
        </p>
        <p className="w-full text-left font-normal text-xl pb-5">
          You can confidently manage your time and achieve your goals with real-time progress
          tracking and AI-powered insights.
        </p>
        <p className="w-full text-left font-normal text-xl pb-5">
          With intuitive design and easy-to-use features, our app is the perfect tool for students
          of all ages and skill levels.
        </p>
        <p className="w-full text-left font-normal text-xl pb-5">
          Join Tempo today and take control of your time like never before!
        </p> */}
        <a href="/signup">
          <Button className="text-white bg-[#526B45] hover:bg-[#3F5237] rounded-lg text-md md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl h-[48px] w-[200px] lg:h-[48px] lg:w-[200px] xl:h-[54px] xl:w-[240px] 2xl:h-[66px] 2xl:w-[300px]">
            Find your rhythm!
          </Button>
        </a>
      </div>
      <div className="mt-12 lg:mt-0 w-full lg:w-7/12 justify-center flex flex-col relative aspect-video">
        <Image
          className="mx-auto"
          src="/computer_dashboard.png"
          alt="Dashboard Image"
          quality={100}
          fill
        />
      </div>
    </div>
  );
};

export default LandingPage;
