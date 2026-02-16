import React from 'react';
import {Card} from 'react-native-paper';
import {StyleProps} from 'react-native-reanimated';
import {SpotifyLogo} from '@spotify/client';
import {StyleSheet, View} from 'react-native';
import {ByVander} from '../assets/icons';

export interface HeaderCardProps {
    style?: StyleProps;
}
export const HeaderCard = ({style}: HeaderCardProps) => {
    return (
        <Card style={[{padding: 0}, style]}>
            <Card.Content>
                <SpotifyLogo width={240} height={60} />
                <View style={styles.overlay}>
                    <ByVander width={240} height={80} />
                </View>
            </Card.Content>
        </Card>
    );
};

export default HeaderCard;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        pointerEvents: 'none',
    },
});
