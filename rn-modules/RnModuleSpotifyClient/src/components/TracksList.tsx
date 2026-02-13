import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import {log} from '@core/logger';
import {QueueTrack} from '../types';
import MiniPlayerTrack from './MiniPlayerTrack';
import {useSpotifyPlayer} from '../hooks';

const TracksList = () => {
    const {queueTracks, trackUri, setUri} = useSpotifyPlayer();
    const flatListRef = useRef<FlatList<QueueTrack>>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const isScrollingProgrammatically = useRef(false);
    const lastOffsetXRef = useRef(0);

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        const width = e.nativeEvent.layout.width;
        setContainerWidth(prev => (prev === width ? prev : width));
    }, []);

    const getItemLayout = useCallback(
        (_: ArrayLike<QueueTrack> | null | undefined, index: number) => ({
            length: containerWidth,
            offset: containerWidth * index,
            index,
        }),
        [containerWidth],
    );

    useEffect(() => {
        if (!trackUri || queueTracks.length === 0 || containerWidth <= 0) {
            return;
        }

        const index = queueTracks.findIndex(track => track.trackUri === trackUri);

        if (index < 0) return;

        log.debug(`TracksList: scrollToIndex ${index} for ${trackUri}`);

        isScrollingProgrammatically.current = true;

        flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0,
        });

        setTimeout(() => {
            isScrollingProgrammatically.current = false;
        }, 400);
    }, [trackUri, queueTracks, containerWidth]);

    const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        lastOffsetXRef.current = e.nativeEvent.contentOffset.x;
    }, []);

    const onMomentumScrollEnd = useCallback(() => {
        if (isScrollingProgrammatically.current) return;
        if (containerWidth <= 0) return;

        const index = Math.round(lastOffsetXRef.current / containerWidth);
        const item = queueTracks[index];

        log.debug(
            `TracksList: onMomentumScrollEnd offset=${lastOffsetXRef.current} index=${index} uri=${item?.trackUri}`,
        );

        if (!item?.trackUri) return;
        if (item.trackUri === trackUri) return;

        setUri(item.trackUri);
    }, [containerWidth, queueTracks, trackUri, setUri]);

    const renderItem = useCallback(
        ({item}: {item: QueueTrack}) => (
            <MiniPlayerTrack trackName={item.trackName} artistName={item.artistName} width={containerWidth} />
        ),
        [containerWidth],
    );

    if (queueTracks.length === 0) {
        log.debug('TracksList: trackList empty');
        return null;
    }

    return (
        <FlatList
            ref={flatListRef}
            horizontal
            pagingEnabled
            data={queueTracks}
            renderItem={renderItem}
            keyExtractor={item => item.trackUri}
            onLayout={onLayout}
            getItemLayout={containerWidth > 0 ? getItemLayout : undefined}
            onScroll={onScroll}
            scrollEventThrottle={16}
            onMomentumScrollEnd={onMomentumScrollEnd}
            showsHorizontalScrollIndicator={false}
        />
    );
};

export default TracksList;
