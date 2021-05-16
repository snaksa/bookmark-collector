import React from "react";
import { Grid } from "@material-ui/core";
import {
  FolderOutlined,
  HomeOutlined,
  LocalOfferOutlined,
  StarOutline,
} from "@material-ui/icons";
import SidebarOption from "./sidebar-option/sidebar-option";

export default function Sidebar() {
  return (
    <Grid container direction="column" spacing={1}>
      <Grid item>
        <SidebarOption to="/my-list" icon={<HomeOutlined />} title="My List" />
      </Grid>
      <Grid item>
        <SidebarOption
          to="/my-list/archived"
          icon={<FolderOutlined />}
          title="Archived"
        />
      </Grid>
      <Grid item>
        <SidebarOption
          to="/my-list/favorites"
          icon={<StarOutline />}
          title="Favorites"
        />
      </Grid>
      <Grid item>
        <SidebarOption
          to="/my-list/tags"
          icon={<LocalOfferOutlined />}
          title="Tags"
        />
      </Grid>
    </Grid>
  );
}
