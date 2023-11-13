import {ArrowIcon} from "@/app/components/icons";
import {ReactNode} from "react";

interface ContactLinkProps {
  icon: ReactNode;
  link: string;
  name: string;
}

export const ContactLink = ({icon, link, name}: ContactLinkProps) => {
  return <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-between px-1 py-2 w-full m-2"
  >
    <div>{icon}</div>
    <div className="mx-1">{name}</div>
    <div className="text-neutral-700 dark:text-neutral-300">
      <ArrowIcon/>
    </div>
  </a>
}