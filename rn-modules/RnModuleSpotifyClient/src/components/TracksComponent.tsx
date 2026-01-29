import React, {useCallback, useRef} from 'react';
import {FlatList, StyleSheet, ViewToken} from 'react-native';
import MiniPlayerTrack from "./MiniPlayerTrack";
import {debounce} from 'lodash';
import {log} from "@core/logger";
import {Track} from "../types";

export interface TracksComponentProps {
    onCurrentTrackChange: (trackId: string) => void;
    trackList: Track[];
}



const TracksComponent = ({trackList, onCurrentTrackChange}: TracksComponentProps) => {
    log.debug(`TracksComponent: trackList length = ${trackList.length}`);
    const debouncedTrackChangeRef = useRef(
        debounce((trackId: string) => {
            log.debug(`onCurrentTrackChange debounced: ${trackId}`);
            onCurrentTrackChange(trackId);
        }, 1000, {leading: true, trailing: false})
    );

    const onViewableItemsChanged = useCallback(
        ({changed, viewableItems}: { changed: ViewToken[], viewableItems: ViewToken[] }) => {
            const currentTrackId = viewableItems[0]?.item?.coverId;
            log.debug(`onCurrentTrackChange Changed : ${changed[0]?.item?.coverId}`);
            log.debug(`onCurrentTrackChange Viewable: ${currentTrackId}`);

            if (currentTrackId) {
                debouncedTrackChangeRef.current(currentTrackId);
            }
        }, [onCurrentTrackChange]);

    if (trackList.length === 0) {
        return null;
    }

    return (
        <FlatList
            horizontal={true}
            data={trackList}
            renderItem={({item}) => (
                <MiniPlayerTrack
                    trackName={item.trackName}
                    artistName={item.artistName}
                    coverUri={item.coverId}
                />
            )}
            keyExtractor={(item, index) => item.coverId || index.toString()}
            onViewableItemsChanged={onViewableItemsChanged}
            onMomentumScrollEnd={() => log.debug('onMomentumScrollEnd')}
        />
    );
};

export default TracksComponent;
