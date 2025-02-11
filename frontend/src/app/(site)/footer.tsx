"use client";

import { Center, Footer as MantineFooter } from "@mantine/core";

const Footer = () => {
  return (
    <MantineFooter height={48} className="bg-beigegray">
      <Center className="h-12">
        <p className="text-sm" data-testid="footer">
          © {new Date().getFullYear()} Tempo
        </p>
      </Center>
    </MantineFooter>
  );
};

export default Footer;
