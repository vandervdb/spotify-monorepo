import {log} from "@core/logger";
import {Alert} from "react-native";

export const withCatch = async (fn: () => Promise<any>) => {
    try {
        await fn();
    } catch (e: any) {
        log.error(e);
        Alert.alert('Error', e?.message ?? String(e));
    }
};
