import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, ViewToken} from 'react-native';
import MiniPlayerTrack from './MiniPlayerTrack';
import {log} from '@core/logger';
import {QueueTrack} from '../types';
import {PlayerState} from '../../specs';

export interface TracksComponentProps {
    trackList: QueueTrack[];
    currentlyPlaying: PlayerState | undefined;
    onCurrentTrackChange: (trackId: string) => void;
}

const TracksList = ({trackList, currentlyPlaying, onCurrentTrackChange}: TracksComponentProps) => {
    const flatListRef = useRef<FlatList>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const displayedTrackId = useRef(currentlyPlaying?.trackUri);
    const isScrollingProgrammatically = useRef(false);
    const currentTrackUri = currentlyPlaying?.trackUri;

    log.debug(
        `TracksComponent: currentlyPlaying = ${currentTrackUri} / displayedTrackId = ${displayedTrackId.current}`,
    );

    useEffect(() => {
        if (currentTrackUri && trackList.length > 0 && currentTrackUri !== displayedTrackId.current) {
            const index = trackList.findIndex(track => track.trackUri === currentTrackUri);
            if (index !== -1 && index < trackList.length) {
                log.debug(`Scrolling to index ${index} for track: ${currentTrackUri}`);
                isScrollingProgrammatically.current = true;
                displayedTrackId.current = currentTrackUri;
                flatListRef.current?.scrollToIndex({
                    index,
                    animated: true,
                    viewPosition: 0,
                });
                // Reset flag after animation
                setTimeout(() => {
                    isScrollingProgrammatically.current = false;
                }, 500);
            }
        }
    }, [currentTrackUri, trackList]);

    const onViewableItemsChanged = useCallback(
        ({changed, viewableItems}: {changed: ViewToken<QueueTrack>[]; viewableItems: ViewToken<QueueTrack>[]}) => {
            if (isScrollingProgrammatically.current) return;

            const currentTrackId = viewableItems[0]?.item?.trackUri;
            log.debug(`onCurrentTrack Viewable: ${currentTrackId}`);
            log.debug(`onCurrentTrack Changed 0: ${changed[0]?.item?.trackUri}`);
            log.debug(`onCurrentTrack Changed 1: ${changed[1]?.item?.trackUri}`);

            if (currentTrackId) {
                displayedTrackId.current = currentTrackId;
            }
        },
        [],
    );

    const onScrollEnd = useCallback(() => {
        if (isScrollingProgrammatically.current) return;

        log.debug(`onScrollEnd: ${displayedTrackId.current}`);
        if (displayedTrackId.current === currentTrackUri || !displayedTrackId.current) return;
        onCurrentTrackChange(displayedTrackId.current);
    }, [currentTrackUri, onCurrentTrackChange]);
    if (trackList.length === 0) {
        return null;
    }

    return (
        <FlatList
            ref={flatListRef}
            horizontal={true}
            pagingEnabled
            onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
            data={trackList}
            renderItem={({item}) => (
                <MiniPlayerTrack
                    trackName={item.trackName ?? ''}
                    artistName={item.artistName ?? ''}
                    width={containerWidth}
                />
            )}
            keyExtractor={(item, index) => item.trackUri || index.toString()}
            onViewableItemsChanged={onViewableItemsChanged}
            onMomentumScrollEnd={onScrollEnd}
            onScrollToIndexFailed={info => {
                log.error(`ScrollToIndex failed: ${JSON.stringify(info)}`);
                // setTimeout(() => {
                //     flatListRef.current?.scrollToIndex({
                //         index: info.index,
                //         animated: true,
                //         viewPosition: 0,
                //     });
                // }, 100);
            }}
        />
    );
};

export default TracksList;
