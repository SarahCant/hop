import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "../firebase";
import Image from "next/image";

export default function BottomMenu() {
  const router = useRouter();
  const pathname = usePathname();

  //default and active nav icons
  const navItems = [
    {
      href: "/create-chat",
      label: "Opret chat",
      icon: "./img/icons/create.png",
      activeIcon: "./img/icons/create.png",
    },
    {
      href: "/",
      label: "Alle chats",
      icon: "./img/icons/all-chats.png",
      activeIcon: "./img/icons/all-chats-active.png",
    },
    {
      href: "/settings",
      label: "Indstillinger",
      icon: "./img/icons/settings.png",
      activeIcon: "./img/icons/settings-active.png",
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-[var(--green)] pb-3 pt-1 overflow-y-visible">
      <ul className="flex">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isCreate = item.href === "/create-chat";
          return (
            <li key={item.href} className="flex-1 flex justify-center">
              <Link href={item.href}>
                {/* special styling of "create" */}
                {isCreate ? (
                  <div className="flex flex-col items-center">
                    <div className=" -mt-10  ">
                      <Image
                        src={item.icon}
                        width={80}
                        height={80}
                        alt={item.label}
                      />
                    </div>

                    {/* active vs non-active text */}
                    <span
                      className={`-mt-1 pb-2 text-xs border-b-2 border-[var(--active)] ${
                        isActive
                          ? "text-[var(--active)] "
                          : "text-[var(--black)] border-transparent"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`flex flex-col items-center justify-center py-2 border-b-2 ${
                      isActive
                        ? "text-[var(--active)] border-[var(--active)] "
                        : "border-transparent"
                    }
                      ${item.extraClasses || ""}
                    `}
                  >
                    {/* active vs non-active icon */}
                    <Image
                      src={isActive ? item.activeIcon : item.icon}
                      width={500}
                      height={500}
                      alt={item.label}
                      className={`menu-icon ${item.extraIconClasses || ""}`}
                    />

                    <span className="text-xs">{item.label}</span>
                  </div>
                )}
              </Link>
            </li>
          );
        })}

        <li className="flex-1">
          {/* logout and redirect to login */}
          <span
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex flex-col items-center justify-center py-2"
          >
            <Image
              src="./img/icons/logout.png"
              width={500}
              height={500}
              alt="menu icon"
              className="menu-icon"
            />
            <label className="text-xs">Log ud</label>
          </span>
        </li>
      </ul>
    </nav>
  );
}
