import {
  Tag,
  User,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  HandCoins
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        // {
        //   href: "",
        //   label: "Posts",
        //   active: pathname.includes("/posts"),
        //   icon: SquarePen,
        //   submenus: [
        //     {
        //       href: "/posts",
        //       label: "All Posts",
        //       active: pathname === "/posts"
        //     },
        //     {
        //       href: "/posts/new",
        //       label: "New Post",
        //       active: pathname === "/posts/new"
        //     }
        //   ]
        // },
        {
          href: "/friends",
          label: "Friends",
          active: pathname.includes("/friends"),
          icon: User,
          submenus: []
        },
        {
          href: "/groups",
          label: "Groups",
          active: pathname.includes("/groups"),
          icon: Users,
          submenus: []
        },
        {
          href: "/expenses",
          label: "Expenses",
          active: pathname.includes("/expenses"),
          icon: HandCoins,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        // {
        //   href: "/users",
        //   label: "Users",
        //   active: pathname.includes("/users"),
        //   icon: Users,
        //   submenus: []
        // },
        {
          href: "/profile",
          label: "Settings",
          active: pathname.includes("/settings"),
          icon: Settings,
          submenus: []
        }
      ]
    }
  ];
}
