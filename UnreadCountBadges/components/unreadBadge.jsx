import { Webpack } from "@api";
import React from "react";
import styles from "./badge.scss";

const { NumberBadge } = Webpack.getByKeys("NumberBadge");
const MutedStore = Webpack.getStore("MutedStore");
const ReadStateStore = Webpack.getStore("ReadStateStore");
const useStateFromStores = Webpack.getByStrings("useStateFromStores", { searchExports: true });

export const isChannelMuted = function (guildId, channelId) {
    return MutedStore.getMutedChannels(guildId).has(channelId);
};

export function ConnectedUnreadBadge(props) {
    // TODO: Add custom color support
    const color = "#5865F2";

    return (
        <NumberBadge {...props} color={color} />
    );
};

export default function ChannelUnreadBadge({ channelId, guildId, selected }) {
    const unreadCount = useStateFromStores([ReadStateStore], () => {
        if (!ReadStateStore.hasUnread(channelId)) return 0;
        // TODO: Implement settings

        return ReadStateStore.getUnreadCount(channelId);
    });
    if (unreadCount === 0) return null;

    return (
        <ConnectedUnreadBadge
            count={unreadCount}
            color="channelColor"
            className={styles.channelUnread}
        />
    );
}