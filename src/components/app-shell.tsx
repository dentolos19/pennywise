"use client";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ForumIcon from "@mui/icons-material/Forum";
import MenuIcon from "@mui/icons-material/Menu";
import MessageIcon from "@mui/icons-material/Message";
import PaidIcon from "@mui/icons-material/Paid";
import SchoolIcon from "@mui/icons-material/School";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  AppBar,
  Box,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/contexts/auth-context";
import LoadingView from "@/components/views/loading-view";
import LoginView from "@/components/views/login-view";

const links = [
  {
    label: "Learn",
    icon: <SchoolIcon />,
    href: "/learn",
  },
  {
    label: "Shop",
    icon: <ShoppingCartIcon />,
    href: "/shop",
  },
  {
    label: "Community",
    icon: <ForumIcon />,
    href: "/community",
  },
  {
    label: "Assistance",
    icon: <MessageIcon />,
    href: "/chat",
  },
  {
    label: "Budgeting",
    icon: <PaidIcon />,
    href: "/tracker",
  },
  {
    label: "Profile",
    icon: <AccountCircleIcon />,
    href: "/profile",
  },
];

export default function AppShell(props: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

  const [open, setOpen] = useState(false);

  if (auth.loading) return <LoadingView />;
  if (!auth.user) return <LoginView />;

  const handleNavigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Box className={"flex h-full"}>
      <AppBar className={"z-20"}>
        <Toolbar>
          <Box>
            <Tooltip title={"Menu"} placement={"right"}>
              <IconButton
                className={"mr-1"}
                sx={{
                  display: { xs: "block", sm: "none" },
                }}
                onClick={() => setOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Box
              component={Link}
              sx={{
                display: { xs: "none", sm: "block" },
              }}
              href={"/"}
            >
              <img className={"h-[40px]"} src={"/title.png"} alt={"Title"} />
            </Box>
          </Box>
          <Box className={"flex-1"} />
          <Box>
            <Chip label={`${auth.user.points} Points`} />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        className={"z-10 w-[200px] [&>.MuiDrawer-paper]:w-[200px]"}
        sx={{ display: { xs: "none", sm: "block" } }}
        variant={"permanent"}
      >
        <Toolbar />
        <Box>
          <List>
            {links.map((link) => (
              <ListItem key={link.label} disablePadding>
                <ListItemButton LinkComponent={Link} href={link.href} selected={link.href === pathname}>
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Drawer
        className={"w-[200px] [&>.MuiDrawer-paper]:w-[200px]"}
        sx={{ display: { xs: "block", sm: "none" } }}
        variant={"temporary"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <List>
          {links.map((link) => (
            <ListItem key={link.label} disablePadding>
              <ListItemButton onClick={() => handleNavigate(link.href)} selected={link.href === pathname}>
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box className={"grid flex-1 grid-rows-[auto,1fr]"}>
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
