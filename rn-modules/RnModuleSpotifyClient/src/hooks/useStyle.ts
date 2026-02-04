import {useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useMemo} from 'react';

export const useStyle = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = useMemo(
        () => ({backgroundColor: isDarkMode ? Colors.darker : Colors.lighter}),
        [isDarkMode],
    );

    return {
        isDarkMode,
        backgroundStyle,
    };
};
