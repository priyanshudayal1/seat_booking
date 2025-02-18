import { Home, Ticket, Settings, Bell } from "lucide-react";
import Dock from "./Menu";

const Navbar = () => {
  const dockItems = [
    {
      label: "Home",
      icon: <Home size={24} />,
      onClick: () => console.log("Home clicked"),
    },
    {
      label: "Tickets",
      icon: <Ticket size={24} />,
      onClick: () => console.log("Tickets clicked"),
    },
    {
      label: "Notifications",
      icon: <Bell size={24} />,
      onClick: () => console.log("Notifications clicked"),
    },
    {
      label: "Settings",
      icon: <Settings size={24} />,
      onClick: () => console.log("Settings clicked"),
    },
  ];

  return (
    <div className="h-screen w-full bg-neutral-950 flex items-end justify-center">
      <Dock items={dockItems} />
    </div>
  );
};

export default Navbar;
