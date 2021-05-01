import React from 'react';
import {Box, Container, Typography} from "@material-ui/core";
import useHttpGet from "../../../../hooks/useHttpGet";
import BookmarksList from "../../../organisms/bookmarks-list/bookmarks-list/bookmarks-list";

export default function TagsScreen() {

    const {isLoading: labelDetailsLoading, response: labelDetails, fetch: fetchLabelDetails} = useHttpGet('labels', {}, true);
    const {response: labels, isLoading: labelsLoading} = useHttpGet('labels');

    const onLabelClick = (labelId: string) => {
        fetchLabelDetails(`labels/${labelId}`).then(data => {
            console.log('Label data: ', data);
        });
    }

    const label: any = labelDetails;

    return <Container>
        <Typography variant={'h4'}>Labels</Typography>
        <Typography variant={'h6'}>Selected: {labelDetails ? label.title : 'none'}</Typography>
        {
            labelsLoading || !labels ? <Box>Loading labels...</Box> : labels.map((label: any) => <Box onClick={() => onLabelClick(label.id)}>{label.title}</Box>)
        }
        {labelDetailsLoading ? <Box>Loading label details...</Box> : <BookmarksList bookmarks={label.bookmarks ?? []} onDelete={() => {}} onFavoriteUpdate={() => {}} onArchivedUpdate={() => {}} />}
    </Container>;

}