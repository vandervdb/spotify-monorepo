import React from 'react';
import {Card} from 'react-native-paper';
import {StyleProps} from 'react-native-reanimated';
import {SpotifyLogo} from '@spotify/client';

export interface HeaderCardProps {
    style?: StyleProps;
}
export const HeaderCard = ({style}: HeaderCardProps) => {
    return (
        <Card style={[{padding: 0}, style]}>
            <Card.Content>
                <SpotifyLogo width={240} height={60} />
            </Card.Content>
        </Card>
    );
};

export default HeaderCard;
