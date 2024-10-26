import React from "react";
import { Patcher, Webpack } from "@api";
import manifest from "@manifest";
import Styles from "@styles";

import ChannelUnreadBadge from "./components/unreadBadge";
import SettingsPanel from "./components/settings";
import Settings from "./modules/settings";

export default class UnreadCountBadges {
    start() {
        this.showChangelog();
        this.patchChannelItem();
        Styles.load();
    }

    showChangelog() {
        if (
            !manifest.changelog?.length ||
            Settings.get("lastVersion") === manifest.version
        ) return;

        const i18n = Webpack.getByKeys("getLocale");
        const formatter = new Intl.DateTimeFormat(i18n.getLocale(), {
            month: "long",
            day: "numeric",
            year: "numeric"
        });

        const title = (
            <div className="Changelog-Title-Wrapper">
                <h1>What's New - {manifest.name}</h1>
                <div>{formatter.format(new Date(manifest.changelogDate))} - v{manifest.version}</div>
            </div>
        )

        const items = manifest.changelog.map(item => (
            <div className="Changelog-Item">
                <h4 className={`Changelog-Header ${item.type}`}>{item.title}</h4>
                {item.items.map(item => (
                    <span>{item}</span>
                ))}
            </div>
        ));

        "changelogImage" in manifest && items.unshift(
            <img className="Changelog-Banner" src={manifest.changelogImage} />
        );

        Settings.set("lastVersion", manifest.version);

        UI.alert(title, items);
    }

    patchChannelItem() {
        const [ChannelItem, key] = Webpack.getWithKey(Webpack.Filters.byStrings("channel", "locked", "hasActiveThreads"))
        Patcher.after(ChannelItem, key, (_, [{ channel, children, selected }]) => {
            if (!Array.isArray(children)) return;
            if (children.some(child => child?.type === ChannelUnreadBadge)) return;

            children.push(
                <ChannelUnreadBadge
                    channelId={channel.id}
                    guildId={channel.guild_id}
                    selected={selected}
                />
            );
        });
    }

    stop() {
        Patcher.unpatchAll();
        Styles.unload();
    }

    getSettingsPanel() {
        return <SettingsPanel />;
    }
}