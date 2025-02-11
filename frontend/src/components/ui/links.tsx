import Link from "next/link";

import { classnames } from "../../utils/utils";

const StandardLink = ({
  href,
  onClick,
  isLoggedIn,
  children,
}: {
  href: string;
  onClick?: () => void;
  isLoggedIn?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className={"hidden md:flex align-middle items-center mb-1"}>
      <Link
        href={href}
        onClick={onClick}
        className={isLoggedIn ? "text-white-300 hover:text-white-100" : "font-bold"}
      >
        {children}
      </Link>
    </div>
  );
};

const MobileLink = ({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <Link href={href} className="w-full text-center" onClick={onClick}>
      {children}
    </Link>
  );
};

export { StandardLink, MobileLink };
