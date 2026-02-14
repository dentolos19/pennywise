"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShareIcon from "@mui/icons-material/Share";
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";

import { deletePostAction } from "@/app/(platform)/community/actions";
import { useAuth } from "@/components/contexts/auth-context";
import { useToast } from "@/components/contexts/toast-context";
import type { Post } from "@/lib/posts";

export default function PostItem(props: { className?: string; data: Post & { user: any } }) {
  const router = useRouter();
  const auth = useAuth();
  const toast = useToast();

  const [anchorElement, setAnchorElement] = useState<HTMLElement>();

  const handleMore = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleEdit = () => {
    router.push(`/community/${props.data.id}`);
  };

  const handleDelete = async () => {
    try {
      await deletePostAction(props.data.id);
      toast.show({ message: "Your post has been deleted!", severity: "success" });
      window.location.reload(); // TODO: replace with better reloading mechanism
    } catch (err) {
      console.log(err);
      toast.show({ message: "Unable to delete your post! Please try again later.", severity: "error" });
    }
    setAnchorElement(undefined);
  };

  const handleFavorite = () => {
    toast.show({ message: "Function not implemented.", severity: "error" });
  };

  const handleShare = () => {
    toast.show({ message: "Function not implemented.", severity: "error" });
  };

  return (
    <Card className={props.className}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: red[800] }}>{props.data.user?.name[0].toUpperCase() || "X"}</Avatar>}
        title={props.data.user?.name || "Unknown User"}
        subheader={dayjs(props.data.createdAt).format("MMMM D, YYYY")}
        action={
          auth.user?.id === props.data.user?.id && (
            <>
              <IconButton onClick={handleMore}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorElement} open={!!anchorElement} onClose={() => setAnchorElement(undefined)}>
                <MenuItem onClick={handleEdit}>
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )
        }
      />
      {props.data.mediaUrl && (
        <CardMedia component={"img"} className={"h-[200px]"} image={props.data.mediaUrl} alt={"Media"} />
      )}
      <CardContent>
        <Typography color={"textSecondary"}>{props.data.content}</Typography>
      </CardContent>
      <CardActions>
        <Tooltip title={"Like"}>
          <IconButton onClick={handleFavorite}>
            <FavoriteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Share"}>
          <IconButton onClick={handleShare}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
