import React from 'react';
import {Grid} from '@material-ui/core';
import {AccountCircle, Folder, Home, Star} from "@material-ui/icons";
import SidebarOption from "./sidebar-option/sidebar-option";

export default function Sidebar() {
  return <Grid container direction='column'>
    <Grid item>
      <SidebarOption to='/my-list' icon={<Home/>} title='My List'/>
    </Grid>
    <Grid item>
      <SidebarOption to='/my-list/archived' icon={<Folder/>} title='Archived'/>
    </Grid>
    <Grid item>
      <SidebarOption to='/my-list/favorites' icon={<Star/>} title='Favorites'/>
    </Grid>
    <Grid item>
      <SidebarOption to='/my-list/tags' icon={<Star/>} title='Tags'/>
    </Grid>
    <Grid item>
      <SidebarOption to='/my-profile' icon={<AccountCircle/>} title='My Profile'/>
    </Grid>
  </Grid>;
}