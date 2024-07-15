import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { Menu } from "@/components/admin-panel/menu";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state: any) => state);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed top-[56px] left-0 z-20 h-screen border-r-[1px] border-border -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[0px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <Menu isOpen />
    </aside>
  );
}
