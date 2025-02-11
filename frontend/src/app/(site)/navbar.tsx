"use client";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Burger, Header as MantineHeader } from "@mantine/core";

import { useSupabase } from "../../components/supabase-provider";
import { MobileLink, StandardLink } from "../../components/ui/links";
import { classnames } from "../../utils/utils";
import { useLayout } from "./layoutContext";

const loaderProp = ({ src }) => {
  return src;
};

const Navbar = () => {
  const { supabase, session, loggedIn } = useSupabase();

  const { setSidebar } = useLayout();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
  };

  const [toggle, setToggle] = useState(false);

  return (
    <MantineHeader
      height={60}
      withBorder={loggedIn ? true : false}
      className={classnames(
        "w-full flex flex-col",
        loggedIn ? "bg-tempoGreen text-white shadow-md" : "bg-paper text-tempoGreen"
      )}
    >
      <div className="body-font px-4 py-3 flex text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl">
        {loggedIn ? (
          <div onClick={() => setSidebar(0)} className="flex items-center gap-2 font-bold">
            <div className="relative sm:h-[28px] sm:w-[28px] md:h-[30px] md:w-[30px] lg:h-[32px] lg:w-[32px] xl:h-[34px] xl:w-[34px] 2xl:h-[36px] 2xl:w-[36px]">
              <Image src="/tempo.png" alt="logo" loader={loaderProp} fill unoptimized />
            </div>
            Tempo
          </div>
        ) : (
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="relative h-[24px] w-[24px] sm:h-[28px] sm:w-[28px] md:h-[30px] md:w-[30px] lg:h-[32px] lg:w-[32px] xl:h-[34px] xl:w-[34px] 2xl:h-[36px] 2xl:w-[36px]">
              <Image src="/tempo.png" alt="logo" loader={loaderProp} fill unoptimized />
            </div>
            Tempo
          </Link>
        )}
        <div className="flex-grow text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl" />
        {loggedIn ? (
          <StandardLink href={"/login"} onClick={handleLogout}>
            Logout
          </StandardLink>
        ) : (
          <>
            <div className="flex text-center hover:text-[#3F5237]">
              <StandardLink href={"/login"}>Login</StandardLink>
            </div>
            <div className="text-center hover:text-white hover:bg-tempoGreen p-2 rounded-lg border-[2px] border-tempoGreen ml-4">
              <StandardLink href={"/signup"}>Sign Up</StandardLink>
            </div>
          </>
        )}

        <div className="md:hidden flex ml-auto items-center">
          <Burger
            opened={toggle}
            onClick={() => setToggle(!toggle)}
            color="white"
            className="w-6 h-6"
          />
        </div>
      </div>
      <div
        className={classnames(
          "pt-0 border-t-[1px] border-gray-500 w-full flex flex-col gap-2",
          "md:hidden", // Hide on desktop
          !toggle && "hidden"
        )}
      >
        <div className="h-2" />
        {loggedIn ? (
          <MobileLink
            href={"/login"}
            onClick={() => {
              setToggle(false);
              handleLogout();
            }}
          >
            Logout
          </MobileLink>
        ) : (
          <MobileLink href={"/login"} onClick={() => setToggle(false)}>
            Login
          </MobileLink>
        )}
        <div className="h-2" />
      </div>
    </MantineHeader>
  );
};

export default Navbar;
